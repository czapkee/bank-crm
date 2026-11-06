import { Injectable } from '@nestjs/common'
import {
  CARD_PAYMENT_STATUSES_TO_GRPC,
  CardPaymentStatus,
  GRPC_TO_CARD_PAYMENT_STATUSES,
  GRPC_TO_PAYMENT_REFERENCES,
  PAYMENT_REFERENCES_TO_GRPC,
  PaymentReference,
} from '@org/enums'

import type {
  GrpcChangePaymentStatusInput,
  GrpcCreatePaymentInput,
  GrpcPaymentPaginationInput,
  GrpcWriteOffCardInput,
} from './types/grpc-input.types.js'
import type {
  GrpcPaginatedPaymentsOutput,
  GrpcPaymentOutput,
  GrpcPaymentPaginationOutput,
} from './types/grpc-output.types.js'
import type {
  ChangePaymentStatusInput,
  CreatePaymentInput,
  PaginatedPaymentsOutput,
  PaymentOutput,
  PaymentPaginationInput,
  PaymentPaginationOutput,
  WriteOffCardInput,
} from '@org/shared-types'

@Injectable()
export class PaymentGatewayMapService {
  mapPaymentStatus(status: number): CardPaymentStatus {
    return GRPC_TO_CARD_PAYMENT_STATUSES[status]
  }

  mapPaymentReference(reference: number): PaymentReference {
    return GRPC_TO_PAYMENT_REFERENCES[reference]
  }

  mapPayment(payment: GrpcPaymentOutput): PaymentOutput {
    return {
      ...payment,
      status: this.mapPaymentStatus(payment.status),
      reference: this.mapPaymentReference(payment.reference),
    }
  }

  mapPaymentPagination(pagination: GrpcPaymentPaginationOutput): PaymentPaginationOutput {
    return {
      ...pagination,
      status: pagination.status === undefined ? undefined : this.mapPaymentStatus(pagination.status),
      reference:
        pagination.reference === undefined ? undefined : this.mapPaymentReference(pagination.reference),
    }
  }

  mapPaymentPaginationRequest(pagination: PaymentPaginationInput): GrpcPaymentPaginationInput {
    return {
      ...pagination,
      status: pagination.status === undefined ? undefined : CARD_PAYMENT_STATUSES_TO_GRPC[pagination.status],
      reference:
        pagination.reference === undefined ? undefined : PAYMENT_REFERENCES_TO_GRPC[pagination.reference],
    }
  }

  mapWriteOffCardRequest(dto: WriteOffCardInput): GrpcWriteOffCardInput {
    return {
      ...dto,
      reference: PAYMENT_REFERENCES_TO_GRPC[dto.reference],
    }
  }

  mapCreatePaymentRequest(dto: CreatePaymentInput): GrpcCreatePaymentInput {
    return {
      ...dto,
      reference: PAYMENT_REFERENCES_TO_GRPC[dto.reference],
      status: dto.status === undefined ? undefined : CARD_PAYMENT_STATUSES_TO_GRPC[dto.status],
    }
  }

  mapChangePaymentStatusRequest(dto: ChangePaymentStatusInput): GrpcChangePaymentStatusInput {
    return {
      ...dto,
      status: CARD_PAYMENT_STATUSES_TO_GRPC[dto.status],
    }
  }

  mapPaginatedPayments(output: GrpcPaginatedPaymentsOutput): PaginatedPaymentsOutput {
    return {
      pagination: this.mapPaymentPagination(output.pagination),
      payments: output.payments.map((payment) => this.mapPayment(payment)),
    }
  }
}
