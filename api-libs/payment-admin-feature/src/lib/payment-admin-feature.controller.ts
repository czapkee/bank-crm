import { Controller } from '@nestjs/common'
import { GrpcMethod } from '@nestjs/microservices'

import { PaymentAdminFeatureService } from './payment-admin-feature.service.js'

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

@Controller()
export class PaymentAdminFeatureController implements PaymentAdminServiceContract {
  constructor(private readonly service: PaymentAdminFeatureService) {}

  @GrpcMethod('PaymentAdminService', 'GetPayments')
  async GetPayments(data: GetPaymentsInput): Promise<PaginatedPaymentsOutput> {
    return await this.service.GetPayments(data)
  }

  @GrpcMethod('PaymentAdminService', 'GetPayment')
  async GetPayment(data: GetPaymentInput): Promise<PaymentOutput> {
    return await this.service.GetPayment(data)
  }

  @GrpcMethod('PaymentAdminService', 'GetCardPayments')
  async GetCardPayments(data: GetCardPaymentsInput): Promise<PaginatedPaymentsOutput> {
    return await this.service.GetCardPayments(data)
  }

  @GrpcMethod('PaymentAdminService', 'CreatePayment')
  async CreatePayment(data: CreatePaymentInput): Promise<PaymentOutput> {
    return await this.service.CreatePayment(data)
  }

  @GrpcMethod('PaymentAdminService', 'ChangePaymentStatus')
  async ChangePaymentStatus(data: ChangePaymentStatusInput): Promise<PaymentOutput> {
    return await this.service.ChangePaymentStatus(data)
  }

  @GrpcMethod('PaymentAdminService', 'DeletePayment')
  async DeletePayment(data: PaymentActionInput): Promise<Empty> {
    return await this.service.DeletePayment(data)
  }
}
