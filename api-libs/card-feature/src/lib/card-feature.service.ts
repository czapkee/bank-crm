import { Injectable } from '@nestjs/common'
import { CardAuthUtil, CardDatabaseUtil, CardMapUtil, CardValidateUtil } from '@org/card-utils'

import type {
  CardOutput,
  CardServiceContract,
  GetMyCardInput,
  GetMyCardsInput,
  PaginatedCardsOutput,
} from '@org/grpc-types'

@Injectable()
export class CardFeatureService implements CardServiceContract {
  constructor(
    private readonly db: CardDatabaseUtil,
    private readonly auth: CardAuthUtil,
    private readonly validate: CardValidateUtil,
    private readonly map: CardMapUtil,
  ) {}

  async GetMyCards(data: GetMyCardsInput): Promise<PaginatedCardsOutput> {
    const payload = this.auth.validateClientAccess(data.validation.accessToken)
    const pagination = this.validate.validateCardPagination(data.pagination)
    const result = await this.db.getCards({ ...pagination, userId: payload.id })

    return this.map.mapCardList(result)
  }

  async GetMyCard(data: GetMyCardInput): Promise<CardOutput> {
    const payload = this.auth.validateClientAccess(data.validation.accessToken)
    const card = await this.validate.validateOwnedCard(data.id, payload.id)

    return this.map.mapCard(card)
  }
}
