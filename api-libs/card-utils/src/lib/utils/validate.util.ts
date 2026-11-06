import { status as GrpcStatus } from '@grpc/grpc-js'
import { Injectable } from '@nestjs/common'
import { RpcException } from '@nestjs/microservices'
import {
  CardStatuses as DbCardStatuses,
  CardPaymentStatus as DbCardPaymentStatus,
  PaymentReference as DbPaymentReference,
} from '@org/card-database'
import {
  GRPC_TO_CARD_PAYMENT_STATUSES,
  GRPC_TO_CARD_STATUSES,
  GRPC_TO_PAYMENT_REFERENCES,
} from '@org/enums'
import { DateMapUtil, StringValidationUtil } from '@org/shared-utils'
import { CARD_CONFIG, PAYMENT_CONFIG, SHARED_CONFIG } from '@org/validation-config'
import { CARD_MESSAGES, PAYMENT_MESSAGES, SHARED_MESSAGES } from '@org/validation-messages'

import { CardDatabaseUtil } from './database.util.js'

import type { CardPaginationData, PaymentPaginationData } from './database.util.js'
import type { Card, Payment } from '@org/card-database'

interface CardPaginationLike {
  page?: number
  limit?: number
  search?: string
  status?: number
  userId?: string
  dateFrom?: Date | string
  dateTo?: Date | string
}

interface PaymentPaginationLike {
  page?: number
  limit?: number
  search?: string
  status?: number
  reference?: number
  cardId?: string
  dateFrom?: Date | string
  dateTo?: Date | string
}

export interface CardPaginationOptions {
  allowUserId?: boolean
}

export interface PaymentPaginationOptions {
  allowCardId?: boolean
}

@Injectable()
export class CardValidateUtil {
  constructor(
    private readonly db: CardDatabaseUtil,
    private readonly date: DateMapUtil,
    private readonly string: StringValidationUtil,
  ) {}

  async validateCardExists(id: string): Promise<Card> {
    this.string.validateId(id)
    const card = await this.db.findCardById(id)

    if (!card) {
      this.throwError(CARD_MESSAGES.CARD_NOT_FOUND, GrpcStatus.NOT_FOUND)
    }

    return card
  }

  async validateOwnedCard(id: string, userId: string): Promise<Card> {
    this.string.validateId(id)
    const card = await this.db.findCardByOwner(id, userId)

    if (!card) {
      this.throwError(CARD_MESSAGES.CARD_NOT_FOUND, GrpcStatus.NOT_FOUND)
    }

    return card
  }

  async validatePaymentExists(id: string): Promise<Payment> {
    this.string.validateId(id)
    const payment = await this.db.findPaymentById(id)

    if (!payment) {
      this.throwError(PAYMENT_MESSAGES.PAYMENT_NOT_FOUND, GrpcStatus.NOT_FOUND)
    }

    return payment
  }

  validateUserId(id: string): void {
    this.string.validateId(id)
  }

  validateCardNumber(cardNumber: string): string {
    if (!cardNumber) {
      this.throwError(CARD_MESSAGES.CARD_NUMBER_VALIDATION.NOT_EMPTY, GrpcStatus.INVALID_ARGUMENT)
    }

    if (typeof cardNumber !== 'string') {
      this.throwError(CARD_MESSAGES.CARD_NUMBER_VALIDATION.TYPE, GrpcStatus.INVALID_ARGUMENT)
    }

    if (!/^[0-9 ]+$/.test(cardNumber)) {
      this.throwError(CARD_MESSAGES.CARD_NUMBER_VALIDATION.FORMAT, GrpcStatus.INVALID_ARGUMENT)
    }

    const digits = cardNumber.replace(/\s+/g, '')

    if (
      digits.length < CARD_CONFIG.CARD_NUMBER.MIN_LENGTH ||
      digits.length > CARD_CONFIG.CARD_NUMBER.MAX_LENGTH
    ) {
      this.throwError(CARD_MESSAGES.CARD_NUMBER_VALIDATION.LENGTH, GrpcStatus.INVALID_ARGUMENT)
    }

    return digits
  }

  validateAccountNumber(accountNumber: string): string {
    if (!accountNumber) {
      this.throwError(CARD_MESSAGES.ACCOUNT_NUMBER_VALIDATION.NOT_EMPTY, GrpcStatus.INVALID_ARGUMENT)
    }

    if (typeof accountNumber !== 'string') {
      this.throwError(CARD_MESSAGES.ACCOUNT_NUMBER_VALIDATION.TYPE, GrpcStatus.INVALID_ARGUMENT)
    }

    const value = accountNumber.trim()

    if (
      value.length < CARD_CONFIG.ACCOUNT_NUMBER.MIN_LENGTH ||
      value.length > CARD_CONFIG.ACCOUNT_NUMBER.MAX_LENGTH ||
      /\s/.test(value)
    ) {
      this.throwError(CARD_MESSAGES.ACCOUNT_NUMBER_VALIDATION.LENGTH, GrpcStatus.INVALID_ARGUMENT)
    }

    return value
  }

  validateDateOfExpire(value: Date | string): Date {
    if (value === undefined || value === null || value === '') {
      this.throwError(CARD_MESSAGES.DATE_OF_EXPIRE_VALIDATION.NOT_EMPTY, GrpcStatus.INVALID_ARGUMENT)
    }

    const date = this.date.mapDateAndValidate(value)

    if (date.getTime() <= Date.now()) {
      this.throwError(CARD_MESSAGES.DATE_OF_EXPIRE_VALIDATION.FUTURE, GrpcStatus.INVALID_ARGUMENT)
    }

    return date
  }

  validateBalance(balance: string): string {
    return this.validateMoney(
      balance,
      CARD_CONFIG.BALANCE.MIN_VALUE,
      CARD_MESSAGES.BALANCE_VALIDATION,
    )
  }

  validateDateAndTime(value: Date | string): Date {
    if (value === undefined || value === null || value === '') {
      this.throwError(SHARED_MESSAGES.DATE_VALIDATION.NOT_EMPTY, GrpcStatus.INVALID_ARGUMENT)
    }

    return this.date.mapDateAndValidate(value)
  }

  validateSum(sum: string): string {
    return this.validateMoney(sum, PAYMENT_CONFIG.SUM.MIN_VALUE, PAYMENT_MESSAGES.SUM_VALIDATION)
  }

  validateService(service: string): string {
    if (!service) {
      this.throwError(PAYMENT_MESSAGES.SERVICE_VALIDATION.NOT_EMPTY, GrpcStatus.INVALID_ARGUMENT)
    }

    if (typeof service !== 'string') {
      this.throwError(PAYMENT_MESSAGES.SERVICE_VALIDATION.TYPE, GrpcStatus.INVALID_ARGUMENT)
    }

    const value = service.trim()

    if (
      value.length < PAYMENT_CONFIG.SERVICE.MIN_LENGTH ||
      value.length > PAYMENT_CONFIG.SERVICE.MAX_LENGTH
    ) {
      this.throwError(PAYMENT_MESSAGES.SERVICE_VALIDATION.LENGTH, GrpcStatus.INVALID_ARGUMENT)
    }

    return value
  }

  validateCardStatus(status: number): DbCardStatuses {
    const mapped = GRPC_TO_CARD_STATUSES[status]

    if (mapped === undefined) {
      this.throwError(CARD_MESSAGES.STATUS_VALIDATION.ENUM(), GrpcStatus.INVALID_ARGUMENT)
    }

    return mapped as unknown as DbCardStatuses
  }

  validatePaymentStatus(status: number): DbCardPaymentStatus {
    const mapped = GRPC_TO_CARD_PAYMENT_STATUSES[status]

    if (mapped === undefined) {
      this.throwError(PAYMENT_MESSAGES.STATUS_VALIDATION.ENUM(), GrpcStatus.INVALID_ARGUMENT)
    }

    return mapped as unknown as DbCardPaymentStatus
  }

  validatePaymentReference(reference: number): DbPaymentReference {
    const mapped = GRPC_TO_PAYMENT_REFERENCES[reference]

    if (mapped === undefined) {
      this.throwError(PAYMENT_MESSAGES.REFERENCE_VALIDATION.ENUM(), GrpcStatus.INVALID_ARGUMENT)
    }

    return mapped as unknown as DbPaymentReference
  }

  validateDebitReference(reference: DbPaymentReference): void {
    if (
      reference !== DbPaymentReference.PAYMENT_FOR_GOODS_AND_SERVICES &&
      reference !== DbPaymentReference.CARD_TO_CARD_TRANSFER
    ) {
      this.throwError(PAYMENT_MESSAGES.REFERENCE_NOT_ALLOWED, GrpcStatus.INVALID_ARGUMENT)
    }
  }

  validateCardPayable(card: Card): void {
    if (card.status === DbCardStatuses.BLOCKED) {
      this.throwError(CARD_MESSAGES.CARD_BLOCKED, GrpcStatus.FAILED_PRECONDITION)
    }

    if (card.status === DbCardStatuses.EXPIRED || card.dateOfExpire.getTime() <= Date.now()) {
      this.throwError(CARD_MESSAGES.CARD_EXPIRED, GrpcStatus.FAILED_PRECONDITION)
    }

    if (card.status !== DbCardStatuses.AT_CLIENT) {
      this.throwError(CARD_MESSAGES.CARD_NOT_ACTIVE, GrpcStatus.FAILED_PRECONDITION)
    }
  }

  validateCardBlockable(card: Card): void {
    if (card.status === DbCardStatuses.BLOCKED) {
      this.throwError(CARD_MESSAGES.CARD_ALREADY_BLOCKED, GrpcStatus.FAILED_PRECONDITION)
    }

    if (card.status === DbCardStatuses.DESTROYED || card.status === DbCardStatuses.CLOSED) {
      this.throwError(CARD_MESSAGES.CARD_NOT_ACTIVE, GrpcStatus.FAILED_PRECONDITION)
    }
  }

  validateCardUnblockable(card: Card): void {
    if (card.status !== DbCardStatuses.BLOCKED) {
      this.throwError(CARD_MESSAGES.CARD_NOT_BLOCKED, GrpcStatus.FAILED_PRECONDITION)
    }
  }

  async validateCardNumberAvailable(cardNumber: string, excludeId?: string): Promise<void> {
    if (await this.db.cardNumberExists(cardNumber, excludeId)) {
      this.throwError(CARD_MESSAGES.CARD_NUMBER_EXISTS, GrpcStatus.ALREADY_EXISTS)
    }
  }

  async validateAccountNumberAvailable(accountNumber: string, excludeId?: string): Promise<void> {
    if (await this.db.accountNumberExists(accountNumber, excludeId)) {
      this.throwError(CARD_MESSAGES.ACCOUNT_NUMBER_EXISTS, GrpcStatus.ALREADY_EXISTS)
    }
  }

  validateCardPagination(
    pagination?: CardPaginationLike,
    options: CardPaginationOptions = {},
  ): CardPaginationData {
    this.validatePagination(pagination)
    const period = this.validatePeriod(pagination?.dateFrom, pagination?.dateTo)
    const userId = options.allowUserId ? pagination?.userId : undefined

    if (pagination?.status !== undefined) {
      this.validateCardStatus(pagination.status)
    }

    if (userId !== undefined) {
      this.string.validateId(userId)
    }

    return {
      page: pagination?.page,
      limit: pagination?.limit,
      search: pagination?.search?.trim(),
      status: pagination?.status,
      userId,
      ...period,
    }
  }

  validatePaymentPagination(
    pagination?: PaymentPaginationLike,
    options: PaymentPaginationOptions = {},
  ): PaymentPaginationData {
    this.validatePagination(pagination)
    const period = this.validatePeriod(pagination?.dateFrom, pagination?.dateTo)
    const cardId = options.allowCardId ? pagination?.cardId : undefined

    if (pagination?.status !== undefined) {
      this.validatePaymentStatus(pagination.status)
    }

    if (pagination?.reference !== undefined) {
      this.validatePaymentReference(pagination.reference)
    }

    if (cardId !== undefined) {
      this.string.validateId(cardId)
    }

    return {
      page: pagination?.page,
      limit: pagination?.limit,
      search: pagination?.search?.trim(),
      status: pagination?.status,
      reference: pagination?.reference,
      cardId,
      ...period,
    }
  }

  private validatePagination(pagination?: {
    page?: number
    limit?: number
    search?: string
  }): void {
    const page = pagination?.page

    if (
      page !== undefined &&
      (!Number.isInteger(page) || page < SHARED_CONFIG.PAGINATION.MIN_PAGE)
    ) {
      this.throwError(
        SHARED_MESSAGES.PAGINATION_PAGE_VALIDATION.MIN,
        GrpcStatus.INVALID_ARGUMENT,
      )
    }

    const limit = pagination?.limit

    if (
      limit !== undefined &&
      (!Number.isInteger(limit) ||
        limit < SHARED_CONFIG.PAGINATION.MIN_LIMIT ||
        limit > SHARED_CONFIG.PAGINATION.MAX_LIMIT)
    ) {
      this.throwError(
        SHARED_MESSAGES.PAGINATION_LIMIT_VALIDATION.MAX,
        GrpcStatus.INVALID_ARGUMENT,
      )
    }

    const search = pagination?.search

    if (
      search !== undefined &&
      (search.length < SHARED_CONFIG.SEARCH.MIN_LENGTH ||
        search.length > SHARED_CONFIG.SEARCH.MAX_LENGTH)
    ) {
      this.throwError(
        SHARED_MESSAGES.PAGINATION_SEARCH_VALIDATION.LENGTH,
        GrpcStatus.INVALID_ARGUMENT,
      )
    }
  }

  private validatePeriod(
    dateFrom?: Date | string,
    dateTo?: Date | string,
  ): { dateFrom?: Date; dateTo?: Date } {
    const from = dateFrom === undefined ? undefined : this.date.mapDateAndValidate(dateFrom)
    const to = dateTo === undefined ? undefined : this.date.mapDateAndValidate(dateTo)

    if (from !== undefined && to !== undefined && from.getTime() > to.getTime()) {
      this.throwError(SHARED_MESSAGES.INVALID_DATE, GrpcStatus.INVALID_ARGUMENT)
    }

    return {
      ...(from === undefined ? {} : { dateFrom: from }),
      ...(to === undefined ? {} : { dateTo: to }),
    }
  }

  private validateMoney(
    value: string,
    minValue: number,
    messages: { NOT_EMPTY: string; TYPE: string; FORMAT: string; MIN: string },
  ): string {
    if (!value) {
      this.throwError(messages.NOT_EMPTY, GrpcStatus.INVALID_ARGUMENT)
    }

    if (typeof value !== 'string') {
      this.throwError(messages.TYPE, GrpcStatus.INVALID_ARGUMENT)
    }

    if (!new RegExp(`^\\d+(\\.\\d{1,${SHARED_CONFIG.MONEY.MAX_DECIMAL_PLACES}})?$`).test(value)) {
      this.throwError(messages.FORMAT, GrpcStatus.INVALID_ARGUMENT)
    }

    const [integer, fraction = ''] = value.split('.')
    const cents = BigInt(integer) * 100n + BigInt(`${fraction}00`.slice(0, 2))
    const minCents = BigInt(Math.round(minValue * 100))

    if (integer.length > 28 || cents < minCents) {
      this.throwError(messages.MIN, GrpcStatus.INVALID_ARGUMENT)
    }

    return `${integer}.${`${fraction}00`.slice(0, 2)}`
  }

  private throwError(message: string, code: GrpcStatus): never {
    throw new RpcException({ message, code })
  }
}
