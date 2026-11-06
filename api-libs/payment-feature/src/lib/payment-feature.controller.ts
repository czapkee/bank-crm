import { Controller } from '@nestjs/common'
import { GrpcMethod } from '@nestjs/microservices'

import { PaymentFeatureService } from './payment-feature.service.js'

import type {
  GetMyCardPaymentsInput,
  GetMyPaymentsInput,
  PaginatedPaymentsOutput,
  PaymentOutput,
  PaymentServiceContract,
  WriteOffCardInput,
} from '@org/grpc-types'

@Controller()
export class PaymentFeatureController implements PaymentServiceContract {
  constructor(private readonly service: PaymentFeatureService) {}

  @GrpcMethod('PaymentService', 'WriteOffCard')
  async WriteOffCard(data: WriteOffCardInput): Promise<PaymentOutput> {
    return await this.service.WriteOffCard(data)
  }

  @GrpcMethod('PaymentService', 'GetMyPayments')
  async GetMyPayments(data: GetMyPaymentsInput): Promise<PaginatedPaymentsOutput> {
    return await this.service.GetMyPayments(data)
  }

  @GrpcMethod('PaymentService', 'GetMyCardPayments')
  async GetMyCardPayments(data: GetMyCardPaymentsInput): Promise<PaginatedPaymentsOutput> {
    return await this.service.GetMyCardPayments(data)
  }
}
