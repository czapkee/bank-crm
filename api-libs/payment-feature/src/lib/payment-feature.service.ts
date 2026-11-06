import { Injectable } from '@nestjs/common'

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
  async WriteOffCard(_data: WriteOffCardInput): Promise<PaymentOutput> {
    throw new Error('Method not implemented')
  }

  async GetMyPayments(_data: GetMyPaymentsInput): Promise<PaginatedPaymentsOutput> {
    throw new Error('Method not implemented')
  }

  async GetMyCardPayments(_data: GetMyCardPaymentsInput): Promise<PaginatedPaymentsOutput> {
    throw new Error('Method not implemented')
  }
}
