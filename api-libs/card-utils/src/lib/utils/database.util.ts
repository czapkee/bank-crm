import { status as GrpcStatus } from '@grpc/grpc-js'
import { Injectable } from '@nestjs/common'
import { RpcException } from '@nestjs/microservices'
import {
  CardPaymentStatus as DbCardPaymentStatus,
  CardStatuses as DbCardStatuses,
  CardDatabaseService,
  PaymentReference as DbPaymentReference,
} from '@org/card-database'
import { GRPC_TO_CARD_PAYMENT_STATUSES, GRPC_TO_CARD_STATUSES, GRPC_TO_PAYMENT_REFERENCES } from '@org/enums'
import { PaginationUtil } from '@org/shared-utils'
import { PAYMENT_MESSAGES } from '@org/validation-messages'

import type { Card, CardWhereInput, Payment, PaymentWhereInput, Prisma } from '@org/card-database'

export interface CardPaginationData {
  page?: number
  limit?: number
  search?: string
  status?: number
  userId?: string
  dateFrom?: Date
  dateTo?: Date
}

export interface CardPaginationResult {
  page: number
  limit: number
  total: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
  search?: string
  status?: number
  userId?: string
  dateFrom?: string
  dateTo?: string
}

export interface PaymentPaginationData {
  page?: number
  limit?: number
  search?: string
  status?: number
  reference?: number
  cardId?: string
  dateFrom?: Date
  dateTo?: Date
}

export interface PaymentPaginationResult {
  page: number
  limit: number
  total: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
  search?: string
  status?: number
  reference?: number
  cardId?: string
  dateFrom?: string
  dateTo?: string
}

export interface CardListResult {
  cards: Card[]
  pagination: CardPaginationResult
}

export interface PaymentListResult {
  payments: Payment[]
  pagination: PaymentPaginationResult
}

export interface CreateCardData {
  cardNumber: string
  accountNumber: string
  dateOfExpire: Date
  balance: string
  status: DbCardStatuses
  userId: string
}

export interface UpdateCardData {
  accountNumber?: string
  dateOfExpire?: Date
  balance?: string
  status?: DbCardStatuses
}

export interface CreatePaymentData {
  cardId: string
  sum: string
  dateAndTime: Date
  service: string
  reference: DbPaymentReference
  status: DbCardPaymentStatus
}

export interface WriteOffCardData {
  cardId: string
  userId: string
  sum: string
  service: string
  reference: DbPaymentReference
}

@Injectable()
export class CardDatabaseUtil {
  constructor(
    protected readonly db: CardDatabaseService,
    protected readonly pagination: PaginationUtil,
  ) {}

  async getCards(data: CardPaginationData): Promise<CardListResult> {
    const where = this.buildCardWhere(data)
    const total = await this.db.card.count({ where })
    const params = this.pagination.getPaginationParams(total, data.page, data.limit)
    const cards = await this.db.card.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: params.skip,
      take: params.limit,
    })

    return {
      cards,
      pagination: {
        page: params.page,
        limit: params.limit,
        total: params.total,
        totalPages: params.totalPages,
        hasNext: params.hasNext,
        hasPrev: params.hasPrev,
        search: data.search,
        status: data.status,
        userId: data.userId,
        dateFrom: data.dateFrom?.toISOString(),
        dateTo: data.dateTo?.toISOString(),
      },
    }
  }

  async getPayments(data: PaymentPaginationData, userId?: string): Promise<PaymentListResult> {
    const where = this.buildPaymentWhere(data, userId)
    const total = await this.db.payment.count({ where })
    const params = this.pagination.getPaginationParams(total, data.page, data.limit)
    const payments = await this.db.payment.findMany({
      where,
      orderBy: { dateAndTime: 'desc' },
      skip: params.skip,
      take: params.limit,
    })

    return {
      payments,
      pagination: {
        page: params.page,
        limit: params.limit,
        total: params.total,
        totalPages: params.totalPages,
        hasNext: params.hasNext,
        hasPrev: params.hasPrev,
        search: data.search,
        status: data.status,
        reference: data.reference,
        cardId: data.cardId,
        dateFrom: data.dateFrom?.toISOString(),
        dateTo: data.dateTo?.toISOString(),
      },
    }
  }

  findCardById(id: string): Promise<Card | null> {
    return this.db.card.findUnique({ where: { id } })
  }

  findCardByOwner(id: string, userId: string): Promise<Card | null> {
    return this.db.card.findFirst({ where: { id, userId } })
  }

  findPaymentById(id: string): Promise<Payment | null> {
    return this.db.payment.findUnique({ where: { id } })
  }

  async cardNumberExists(cardNumber: string, excludeId?: string): Promise<boolean> {
    const card = await this.db.card.findFirst({
      where: {
        cardNumber: BigInt(cardNumber),
        ...(excludeId === undefined ? {} : { NOT: { id: excludeId } }),
      },
      select: { id: true },
    })

    return card !== null
  }

  async accountNumberExists(accountNumber: string, excludeId?: string): Promise<boolean> {
    const card = await this.db.card.findFirst({
      where: {
        accountNumber,
        ...(excludeId === undefined ? {} : { NOT: { id: excludeId } }),
      },
      select: { id: true },
    })

    return card !== null
  }

  async createCard(data: CreateCardData): Promise<Card> {
    await this.db.userSnapshot.upsert({
      where: { userId: data.userId },
      create: { userId: data.userId },
      update: {},
    })

    return this.db.card.create({
      data: {
        cardNumber: BigInt(data.cardNumber),
        accountNumber: data.accountNumber,
        dateOfExpire: data.dateOfExpire,
        balance: data.balance,
        status: data.status,
        userId: data.userId,
      },
    })
  }

  updateCard(id: string, data: UpdateCardData): Promise<Card> {
    return this.db.card.update({
      where: { id },
      data: {
        ...(data.accountNumber === undefined ? {} : { accountNumber: data.accountNumber }),
        ...(data.dateOfExpire === undefined ? {} : { dateOfExpire: data.dateOfExpire }),
        ...(data.balance === undefined ? {} : { balance: data.balance }),
        ...(data.status === undefined ? {} : { status: data.status }),
      },
    })
  }

  changeCardStatus(id: string, status: DbCardStatuses): Promise<Card> {
    return this.db.card.update({
      where: { id },
      data: { status },
    })
  }

  async deleteCard(id: string): Promise<void> {
    await this.db.card.delete({ where: { id } })
  }

  createPayment(data: CreatePaymentData): Promise<Payment> {
    return this.db.$transaction(async (tx) => {
      let status = data.status

      if (status === DbCardPaymentStatus.APPROVED) {
        const applied = await this.applyMovement(tx, data.cardId, data.sum, data.reference)

        if (!applied) {
          status = DbCardPaymentStatus.INSUFFICIENT_FUNDS
        }
      }

      return tx.payment.create({
        data: {
          cardId: data.cardId,
          sum: data.sum,
          dateAndTime: data.dateAndTime,
          service: data.service,
          reference: data.reference,
          status,
        },
      })
    })
  }

  writeOffCard(data: WriteOffCardData): Promise<Payment> {
    return this.db.$transaction(async (tx) => {
      const updated = await tx.card.updateMany({
        where: {
          id: data.cardId,
          userId: data.userId,
          status: DbCardStatuses.AT_CLIENT,
          dateOfExpire: { gt: new Date() },
          balance: { gte: data.sum },
        },
        data: { balance: { decrement: data.sum } },
      })

      const status =
        updated.count === 1 ? DbCardPaymentStatus.APPROVED : DbCardPaymentStatus.INSUFFICIENT_FUNDS

      return tx.payment.create({
        data: {
          cardId: data.cardId,
          sum: data.sum,
          dateAndTime: new Date(),
          service: data.service,
          reference: data.reference,
          status,
        },
      })
    })
  }

  changePaymentStatus(id: string, status: DbCardPaymentStatus): Promise<Payment> {
    return this.db.$transaction(async (tx) => {
      const payment = await tx.payment.findUnique({ where: { id } })

      if (!payment) {
        throw new RpcException({
          message: PAYMENT_MESSAGES.PAYMENT_NOT_FOUND,
          code: GrpcStatus.NOT_FOUND,
        })
      }

      if (payment.status === status) {
        return payment
      }

      let nextStatus = status

      if (payment.status !== DbCardPaymentStatus.APPROVED && status === DbCardPaymentStatus.APPROVED) {
        const applied = await this.applyMovement(
          tx,
          payment.cardId,
          payment.sum.toString(),
          payment.reference,
        )

        if (!applied) {
          nextStatus = DbCardPaymentStatus.INSUFFICIENT_FUNDS
        }
      } else if (
        payment.status === DbCardPaymentStatus.APPROVED &&
        status !== DbCardPaymentStatus.APPROVED
      ) {
        const reverted = await this.revertMovement(
          tx,
          payment.cardId,
          payment.sum.toString(),
          payment.reference,
        )

        if (!reverted) {
          throw new RpcException({
            message: PAYMENT_MESSAGES.INSUFFICIENT_FUNDS,
            code: GrpcStatus.FAILED_PRECONDITION,
          })
        }
      }

      return tx.payment.update({
        where: { id },
        data: { status: nextStatus },
      })
    })
  }

  async deletePayment(id: string): Promise<void> {
    await this.db.payment.delete({ where: { id } })
  }

  private buildCardWhere(data: CardPaginationData): CardWhereInput {
    const filters: CardWhereInput[] = []

    if (data.userId !== undefined) {
      filters.push({ userId: data.userId })
    }

    if (data.status !== undefined) {
      filters.push({ status: GRPC_TO_CARD_STATUSES[data.status] as DbCardStatuses })
    }

    if (data.dateFrom !== undefined || data.dateTo !== undefined) {
      filters.push({
        createdAt: {
          ...(data.dateFrom === undefined ? {} : { gte: data.dateFrom }),
          ...(data.dateTo === undefined ? {} : { lte: data.dateTo }),
        },
      })
    }

    if (data.search) {
      const digits = data.search.replace(/\s+/g, '')
      const search: CardWhereInput[] = [
        { accountNumber: { contains: data.search, mode: 'insensitive' } },
      ]

      if (/^\d{1,19}$/.test(digits)) {
        search.push({ cardNumber: BigInt(digits) })
      }

      filters.push({ OR: search })
    }

    return filters.length === 0 ? {} : { AND: filters }
  }

  private buildPaymentWhere(data: PaymentPaginationData, userId?: string): PaymentWhereInput {
    const filters: PaymentWhereInput[] = []
    const card: CardWhereInput = {}

    if (userId !== undefined) {
      card.userId = userId
    }

    if (data.cardId !== undefined) {
      card.id = data.cardId
    }

    if (Object.keys(card).length > 0) {
      filters.push({ card })
    }

    if (data.status !== undefined) {
      filters.push({ status: GRPC_TO_CARD_PAYMENT_STATUSES[data.status] as DbCardPaymentStatus })
    }

    if (data.reference !== undefined) {
      filters.push({ reference: GRPC_TO_PAYMENT_REFERENCES[data.reference] as DbPaymentReference })
    }

    if (data.dateFrom !== undefined || data.dateTo !== undefined) {
      filters.push({
        dateAndTime: {
          ...(data.dateFrom === undefined ? {} : { gte: data.dateFrom }),
          ...(data.dateTo === undefined ? {} : { lte: data.dateTo }),
        },
      })
    }

    if (data.search) {
      const digits = data.search.replace(/\s+/g, '')
      const search: PaymentWhereInput[] = [
        { service: { contains: data.search, mode: 'insensitive' } },
        { card: { accountNumber: { contains: data.search, mode: 'insensitive' } } },
      ]

      if (/^\d{1,19}$/.test(digits)) {
        search.push({ card: { cardNumber: BigInt(digits) } })
      }

      filters.push({ OR: search })
    }

    return filters.length === 0 ? {} : { AND: filters }
  }

  private isDebit(reference: DbPaymentReference): boolean {
    return (
      reference === DbPaymentReference.PAYMENT_FOR_GOODS_AND_SERVICES ||
      reference === DbPaymentReference.CARD_TO_CARD_TRANSFER
    )
  }

  private async applyMovement(
    tx: Prisma.TransactionClient,
    cardId: string,
    sum: string,
    reference: DbPaymentReference,
  ): Promise<boolean> {
    if (this.isDebit(reference)) {
      const updated = await tx.card.updateMany({
        where: { id: cardId, balance: { gte: sum } },
        data: { balance: { decrement: sum } },
      })

      return updated.count === 1
    }

    await tx.card.update({
      where: { id: cardId },
      data: { balance: { increment: sum } },
    })

    return true
  }

  private async revertMovement(
    tx: Prisma.TransactionClient,
    cardId: string,
    sum: string,
    reference: DbPaymentReference,
  ): Promise<boolean> {
    if (this.isDebit(reference)) {
      await tx.card.update({
        where: { id: cardId },
        data: { balance: { increment: sum } },
      })

      return true
    }

    const updated = await tx.card.updateMany({
      where: { id: cardId, balance: { gte: sum } },
      data: { balance: { decrement: sum } },
    })

    return updated.count === 1
  }
}
