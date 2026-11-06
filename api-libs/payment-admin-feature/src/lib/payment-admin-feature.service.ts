import { Injectable } from '@nestjs/common'

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
  async GetPayments(_data: GetPaymentsInput): Promise<PaginatedPaymentsOutput> {
    throw new Error('Method not implemented')
  }

  async GetPayment(_data: GetPaymentInput): Promise<PaymentOutput> {
    throw new Error('Method not implemented')
  }

  async GetCardPayments(_data: GetCardPaymentsInput): Promise<PaginatedPaymentsOutput> {
    throw new Error('Method not implemented')
  }

  async CreatePayment(_data: CreatePaymentInput): Promise<PaymentOutput> {
    throw new Error('Method not implemented')
  }

  async ChangePaymentStatus(_data: ChangePaymentStatusInput): Promise<PaymentOutput> {
    throw new Error('Method not implemented')
  }

  async DeletePayment(_data: PaymentActionInput): Promise<Empty> {
    throw new Error('Method not implemented')
  }
}
