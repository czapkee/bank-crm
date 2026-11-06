import { Injectable } from '@nestjs/common'
import { CardPaymentStatus as DbCardPaymentStatus } from '@org/card-database'
import { CardAuthUtil, CardDatabaseUtil, CardMapUtil, CardValidateUtil } from '@org/card-utils'

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
    this.auth.validateEmployeeAccess(data.validation.accessToken)
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

    return this.map.mapPayment(payment)
  }

  async ChangePaymentStatus(data: ChangePaymentStatusInput): Promise<PaymentOutput> {
    this.auth.validateEmployeeAccess(data.validation.accessToken)
    await this.validate.validatePaymentExists(data.id)
    const status = this.validate.validatePaymentStatus(data.status)
    const payment = await this.db.changePaymentStatus(data.id, status)

    return this.map.mapPayment(payment)
  }

  async DeletePayment(data: PaymentActionInput): Promise<Empty> {
    this.auth.validateEmployeeAccess(data.validation.accessToken)
    await this.validate.validatePaymentExists(data.id)
    await this.db.deletePayment(data.id)

    return {}
  }
}
