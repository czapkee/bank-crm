import { Injectable } from '@nestjs/common'
import { CardStatuses as DbCardStatuses } from '@org/card-database'
import { CardAuthUtil, CardDatabaseUtil, CardMapUtil, CardValidateUtil } from '@org/card-utils'
import { LogPublisher } from '@org/rmq-config'
import { CARD_LOG_ACTIONS } from '@org/rmq-messages'

import type {
  CardActionInput,
  CardAdminServiceContract,
  CardOutput,
  ChangeCardStatusInput,
  CreateCardInput,
  Empty,
  GetCardInput,
  GetCardsInput,
  GetUserCardsInput,
  PaginatedCardsOutput,
  UpdateCardInput,
} from '@org/grpc-types'

@Injectable()
export class CardAdminFeatureService implements CardAdminServiceContract {
  constructor(
    private readonly db: CardDatabaseUtil,
    private readonly auth: CardAuthUtil,
    private readonly validate: CardValidateUtil,
    private readonly map: CardMapUtil,
    private readonly log: LogPublisher,
  ) {}

  async GetCards(data: GetCardsInput): Promise<PaginatedCardsOutput> {
    this.auth.validateEmployeeAccess(data.validation.accessToken)
    const pagination = this.validate.validateCardPagination(data.pagination, { allowUserId: true })
    const result = await this.db.getCards(pagination)

    return this.map.mapCardList(result)
  }

  async GetCard(data: GetCardInput): Promise<CardOutput> {
    this.auth.validateEmployeeAccess(data.validation.accessToken)
    const card = await this.validate.validateCardExists(data.id)

    return this.map.mapCard(card)
  }

  async GetUserCards(data: GetUserCardsInput): Promise<PaginatedCardsOutput> {
    this.auth.validateEmployeeAccess(data.validation.accessToken)
    this.validate.validateUserId(data.userId)
    const pagination = this.validate.validateCardPagination(data.pagination)
    const result = await this.db.getCards({ ...pagination, userId: data.userId })

    return this.map.mapCardList(result)
  }

  async CreateCard(data: CreateCardInput): Promise<CardOutput> {
    const actor = this.auth.validateEmployeeAccess(data.validation.accessToken)
    this.validate.validateUserId(data.userId)
    const cardNumber = this.validate.validateCardNumber(data.cardNumber)
    const accountNumber = this.validate.validateAccountNumber(data.accountNumber)
    const dateOfExpire = this.validate.validateDateOfExpire(data.dateOfExpire)
    const balance = this.validate.validateBalance(data.balance)
    const status =
      data.status === undefined
        ? DbCardStatuses.CREATED
        : this.validate.validateCardStatus(data.status)

    await this.validate.validateCardNumberAvailable(cardNumber)
    await this.validate.validateAccountNumberAvailable(accountNumber)

    const card = await this.db.createCard({
      cardNumber,
      accountNumber,
      dateOfExpire,
      balance,
      status,
      userId: data.userId,
    })

    this.log.publish({
      service: 'card',
      entity: 'Card',
      method: 'CreateCard',
      action: CARD_LOG_ACTIONS.ADMIN_CREATE,
      userId: actor.id,
      data: { cardId: card.id, ownerId: data.userId },
    })

    return this.map.mapCard(card)
  }

  async UpdateCard(data: UpdateCardInput): Promise<CardOutput> {
    const actor = this.auth.validateEmployeeAccess(data.validation.accessToken)
    await this.validate.validateCardExists(data.id)
    const accountNumber =
      data.accountNumber === undefined
        ? undefined
        : this.validate.validateAccountNumber(data.accountNumber)
    const dateOfExpire =
      data.dateOfExpire === undefined ? undefined : this.validate.validateDateOfExpire(data.dateOfExpire)
    const balance = data.balance === undefined ? undefined : this.validate.validateBalance(data.balance)
    const status =
      data.status === undefined ? undefined : this.validate.validateCardStatus(data.status)

    if (accountNumber !== undefined) {
      await this.validate.validateAccountNumberAvailable(accountNumber, data.id)
    }

    const card = await this.db.updateCard(data.id, {
      accountNumber,
      dateOfExpire,
      balance,
      status,
    })

    this.log.publish({
      service: 'card',
      entity: 'Card',
      method: 'UpdateCard',
      action: CARD_LOG_ACTIONS.ADMIN_UPDATE,
      userId: actor.id,
      data: { cardId: data.id, changes: { ...data } },
    })

    return this.map.mapCard(card)
  }

  async ChangeCardStatus(data: ChangeCardStatusInput): Promise<CardOutput> {
    const actor = this.auth.validateEmployeeAccess(data.validation.accessToken)
    await this.validate.validateCardExists(data.id)
    const status = this.validate.validateCardStatus(data.status)
    const card = await this.db.changeCardStatus(data.id, status)

    this.log.publish({
      service: 'card',
      entity: 'Card',
      method: 'ChangeCardStatus',
      action: CARD_LOG_ACTIONS.ADMIN_CHANGE_STATUS,
      userId: actor.id,
      data: { cardId: data.id, status: data.status },
    })

    return this.map.mapCard(card)
  }

  async BlockCard(data: CardActionInput): Promise<CardOutput> {
    const actor = this.auth.validateEmployeeAccess(data.validation.accessToken)
    const existing = await this.validate.validateCardExists(data.id)
    this.validate.validateCardBlockable(existing)
    const card = await this.db.changeCardStatus(data.id, DbCardStatuses.BLOCKED)

    this.log.publish({
      service: 'card',
      entity: 'Card',
      method: 'BlockCard',
      action: CARD_LOG_ACTIONS.ADMIN_BLOCK,
      userId: actor.id,
      data: { cardId: data.id },
    })

    return this.map.mapCard(card)
  }

  async UnblockCard(data: CardActionInput): Promise<CardOutput> {
    const actor = this.auth.validateEmployeeAccess(data.validation.accessToken)
    const existing = await this.validate.validateCardExists(data.id)
    this.validate.validateCardUnblockable(existing)
    const card = await this.db.changeCardStatus(data.id, DbCardStatuses.AT_CLIENT)

    this.log.publish({
      service: 'card',
      entity: 'Card',
      method: 'UnblockCard',
      action: CARD_LOG_ACTIONS.ADMIN_UNBLOCK,
      userId: actor.id,
      data: { cardId: data.id },
    })

    return this.map.mapCard(card)
  }

  async DeleteCard(data: CardActionInput): Promise<Empty> {
    const actor = this.auth.validateEmployeeAccess(data.validation.accessToken)
    await this.validate.validateCardExists(data.id)
    await this.db.deleteCard(data.id)

    this.log.publish({
      service: 'card',
      entity: 'Card',
      method: 'DeleteCard',
      action: CARD_LOG_ACTIONS.ADMIN_DELETE,
      userId: actor.id,
      data: { cardId: data.id },
    })

    return {}
  }
}
