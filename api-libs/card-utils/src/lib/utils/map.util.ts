import { Injectable } from '@nestjs/common'
import {
  CARD_PAYMENT_STATUSES_TO_GRPC,
  CARD_STATUSES_TO_GRPC,
  PAYMENT_REFERENCES_TO_GRPC,
} from '@org/enums'

import type {
  CardListResult,
  CardPaginationResult,
  PaymentListResult,
  PaymentPaginationResult,
} from './database.util.js'
import type { Card, Payment } from '@org/card-database'
import type { CardStatuses, CardPaymentStatus, PaymentReference } from '@org/enums'
import type {
  CardOutput,
  CardPaginationOutput,
  PaginatedCardsOutput,
  PaginatedPaymentsOutput,
  PaymentOutput,
  PaymentPaginationOutput,
} from '@org/grpc-types'

@Injectable()
export class CardMapUtil {
  mapCard(card: Card): CardOutput {
    return {
      id: card.id,
      cardNumber: card.cardNumber.toString(),
      accountNumber: card.accountNumber,
      dateOfExpire: card.dateOfExpire.toISOString(),
      balance: card.balance.toFixed(2),
      status: CARD_STATUSES_TO_GRPC[card.status as CardStatuses],
      userId: card.userId,
      createdAt: card.createdAt.toISOString(),
      updatedAt: card.updatedAt.toISOString(),
    }
  }

  mapPayment(payment: Payment): PaymentOutput {
    return {
      id: payment.id,
      sum: payment.sum.toFixed(2),
      dateAndTime: payment.dateAndTime.toISOString(),
      service: payment.service,
      reference: PAYMENT_REFERENCES_TO_GRPC[payment.reference as PaymentReference],
      status: CARD_PAYMENT_STATUSES_TO_GRPC[payment.status as CardPaymentStatus],
      cardId: payment.cardId,
      createdAt: payment.createdAt.toISOString(),
      updatedAt: payment.updatedAt.toISOString(),
    }
  }

  mapCardPagination(pagination: CardPaginationResult): CardPaginationOutput {
    return {
      page: pagination.page,
      limit: pagination.limit,
      total: pagination.total,
      totalPages: pagination.totalPages,
      hasNext: pagination.hasNext,
      hasPrev: pagination.hasPrev,
      search: pagination.search,
      status: pagination.status,
      userId: pagination.userId,
      dateFrom: pagination.dateFrom,
      dateTo: pagination.dateTo,
    }
  }

  mapPaymentPagination(pagination: PaymentPaginationResult): PaymentPaginationOutput {
    return {
      page: pagination.page,
      limit: pagination.limit,
      total: pagination.total,
      totalPages: pagination.totalPages,
      hasNext: pagination.hasNext,
      hasPrev: pagination.hasPrev,
      search: pagination.search,
      status: pagination.status,
      reference: pagination.reference,
      cardId: pagination.cardId,
      dateFrom: pagination.dateFrom,
      dateTo: pagination.dateTo,
    }
  }

  mapCardList(result: CardListResult): PaginatedCardsOutput {
    return {
      pagination: this.mapCardPagination(result.pagination),
      cards: result.cards.map((card) => this.mapCard(card)),
    }
  }

  mapPaymentList(result: PaymentListResult): PaginatedPaymentsOutput {
    return {
      pagination: this.mapPaymentPagination(result.pagination),
      payments: result.payments.map((payment) => this.mapPayment(payment)),
    }
  }
}
