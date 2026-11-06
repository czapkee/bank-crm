import { Injectable } from '@nestjs/common'
import { CardAuthUtil, CardDatabaseUtil, CardMapUtil, CardValidateUtil } from '@org/card-utils'

import type {
  GetMyCardPaymentsInput,
  GetMyPaymentsInput,
  PaginatedPaymentsOutput,
  PaymentOutput,
  PaymentServiceContract,
  WriteOffCardInput,
} from '@org/grpc-types'

@Injectable()
export class PaymentFeatureService implements PaymentServiceContract {
  constructor(
    private readonly db: CardDatabaseUtil,
    private readonly auth: CardAuthUtil,
    private readonly validate: CardValidateUtil,
    private readonly map: CardMapUtil,
  ) {}

  async WriteOffCard(data: WriteOffCardInput): Promise<PaymentOutput> {
    const payload = this.auth.validateClientAccess(data.validation.accessToken)
    const card = await this.validate.validateOwnedCard(data.cardId, payload.id)
    const sum = this.validate.validateSum(data.sum)
    const service = this.validate.validateService(data.service)
    const reference = this.validate.validatePaymentReference(data.reference)

    this.validate.validateDebitReference(reference)
    this.validate.validateCardPayable(card)

    const payment = await this.db.writeOffCard({
      cardId: card.id,
      userId: payload.id,
      sum,
      service,
      reference,
    })

    return this.map.mapPayment(payment)
  }

  async GetMyPayments(data: GetMyPaymentsInput): Promise<PaginatedPaymentsOutput> {
    const payload = this.auth.validateClientAccess(data.validation.accessToken)
    const pagination = this.validate.validatePaymentPagination(data.pagination)
    const result = await this.db.getPayments(pagination, payload.id)

    return this.map.mapPaymentList(result)
  }

  async GetMyCardPayments(data: GetMyCardPaymentsInput): Promise<PaginatedPaymentsOutput> {
    const payload = this.auth.validateClientAccess(data.validation.accessToken)
    await this.validate.validateOwnedCard(data.cardId, payload.id)
    const pagination = this.validate.validatePaymentPagination(data.pagination)
    const result = await this.db.getPayments({ ...pagination, cardId: data.cardId }, payload.id)

    return this.map.mapPaymentList(result)
  }
}
