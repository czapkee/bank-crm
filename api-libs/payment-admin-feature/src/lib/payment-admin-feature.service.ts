import { Injectable } from '@nestjs/common'
import { CardPaymentStatus as DbCardPaymentStatus } from '@org/card-database'
import { CardAuthUtil, CardDatabaseUtil, CardMapUtil, CardValidateUtil } from '@org/card-utils'
import { LogPublisher } from '@org/rmq-config'
import { CARD_LOG_ACTIONS } from '@org/rmq-messages'

import type {
  ChangePaymentStatusInput,
  CreatePaymentInput,
  Empty,
  GetCardPaymentsInput,
  GetPaymentInput,
  GetPaymentsInput,
  PaginatedPaymentsOutput,
  PaymentActionInput,
  PaymentAdminServiceContract,
  PaymentOutput,
} from '@org/grpc-types'

@Injectable()
export class PaymentAdminFeatureService implements PaymentAdminServiceContract {
  constructor(
    private readonly db: CardDatabaseUtil,
    private readonly auth: CardAuthUtil,
    private readonly validate: CardValidateUtil,
    private readonly map: CardMapUtil,
    private readonly log: LogPublisher,
  ) {}

  async GetPayments(data: GetPaymentsInput): Promise<PaginatedPaymentsOutput> {
    this.auth.validateEmployeeAccess(data.validation.accessToken)
    const pagination = this.validate.validatePaymentPagination(data.pagination, {
      allowCardId: true,
    })
    const result = await this.db.getPayments(pagination)

    return this.map.mapPaymentList(result)
  }

  async GetPayment(data: GetPaymentInput): Promise<PaymentOutput> {
    this.auth.validateEmployeeAccess(data.validation.accessToken)
    const payment = await this.validate.validatePaymentExists(data.id)

    return this.map.mapPayment(payment)
  }

  async GetCardPayments(data: GetCardPaymentsInput): Promise<PaginatedPaymentsOutput> {
    this.auth.validateEmployeeAccess(data.validation.accessToken)
    await this.validate.validateCardExists(data.cardId)
    const pagination = this.validate.validatePaymentPagination(data.pagination)
    const result = await this.db.getPayments({ ...pagination, cardId: data.cardId })

    return this.map.mapPaymentList(result)
  }

  async CreatePayment(data: CreatePaymentInput): Promise<PaymentOutput> {
    const actor = this.auth.validateEmployeeAccess(data.validation.accessToken)
    await this.validate.validateCardExists(data.cardId)
    const sum = this.validate.validateSum(data.sum)
    const dateAndTime = this.validate.validateDateAndTime(data.dateAndTime)
    const service = this.validate.validateService(data.service)
    const reference = this.validate.validatePaymentReference(data.reference)
    const status =
      data.status === undefined
        ? DbCardPaymentStatus.IN_PROCESS
        : this.validate.validatePaymentStatus(data.status)

    const payment = await this.db.createPayment({
      cardId: data.cardId,
      sum,
      dateAndTime,
      service,
      reference,
      status,
    })

    this.log.publish({
      service: 'card',
      entity: 'Payment',
      method: 'CreatePayment',
      action: CARD_LOG_ACTIONS.PAYMENT_ADMIN_CREATE,
      userId: actor.id,
      data: { paymentId: payment.id, cardId: data.cardId, sum: data.sum },
    })

    return this.map.mapPayment(payment)
  }

  async ChangePaymentStatus(data: ChangePaymentStatusInput): Promise<PaymentOutput> {
    const actor = this.auth.validateEmployeeAccess(data.validation.accessToken)
    await this.validate.validatePaymentExists(data.id)
    const status = this.validate.validatePaymentStatus(data.status)
    const payment = await this.db.changePaymentStatus(data.id, status)

    this.log.publish({
      service: 'card',
      entity: 'Payment',
      method: 'ChangePaymentStatus',
      action: CARD_LOG_ACTIONS.PAYMENT_ADMIN_CHANGE_STATUS,
      userId: actor.id,
      data: { paymentId: data.id, status: data.status },
    })

    return this.map.mapPayment(payment)
  }

  async DeletePayment(data: PaymentActionInput): Promise<Empty> {
    const actor = this.auth.validateEmployeeAccess(data.validation.accessToken)
    await this.validate.validatePaymentExists(data.id)
    await this.db.deletePayment(data.id)

    this.log.publish({
      service: 'card',
      entity: 'Payment',
      method: 'DeletePayment',
      action: CARD_LOG_ACTIONS.PAYMENT_ADMIN_DELETE,
      userId: actor.id,
      data: { paymentId: data.id },
    })

    return {}
  }
}
