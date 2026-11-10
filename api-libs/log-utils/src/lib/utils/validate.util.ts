import { status as GrpcStatus } from '@grpc/grpc-js'
import { Injectable } from '@nestjs/common'
import { RpcException } from '@nestjs/microservices'
import { DateMapUtil, StringValidationUtil } from '@org/shared-utils'
import { LOG_CONFIG, SHARED_CONFIG } from '@org/validation-config'
import { LOG_MESSAGES, SHARED_MESSAGES } from '@org/validation-messages'

import { LogDatabaseUtil } from './database.util.js'

import type { LogPaginationData } from './database.util.js'
import type { Log } from '@org/log-database'

interface LogPaginationLike {
  page?: number
  limit?: number
  search?: string
  service?: string
  entity?: string
  method?: string
  action?: string
  userId?: string
  dateFrom?: Date | string
  dateTo?: Date | string
}

interface FilterRules {
  minLength: number
  maxLength: number
  messages: {
    NOT_EMPTY: string
    TYPE: string
    LENGTH: string
  }
}

@Injectable()
export class LogValidateUtil {
  constructor(
    private readonly db: LogDatabaseUtil,
    private readonly date: DateMapUtil,
    private readonly string: StringValidationUtil,
  ) {}

  async validateLogExists(id: string): Promise<Log> {
    this.string.validateId(id)
    const log = await this.db.findLogById(id)

    if (!log) {
      this.throwError(LOG_MESSAGES.LOG_NOT_FOUND, GrpcStatus.NOT_FOUND)
    }

    return log
  }

  validateUserId(id: string): void {
    this.string.validateId(id)
  }

  validateLogPagination(pagination?: LogPaginationLike): LogPaginationData {
    this.validatePagination(pagination)
    const period = this.validatePeriod(pagination?.dateFrom, pagination?.dateTo)

    if (pagination?.userId !== undefined) {
      this.string.validateId(pagination.userId)
    }

    return {
      page: pagination?.page,
      limit: pagination?.limit,
      search: pagination?.search?.trim(),
      service: this.validateFilter(pagination?.service, {
        minLength: LOG_CONFIG.SERVICE.MIN_LENGTH,
        maxLength: LOG_CONFIG.SERVICE.MAX_LENGTH,
        messages: LOG_MESSAGES.SERVICE_VALIDATION,
      }),
      entity: this.validateFilter(pagination?.entity, {
        minLength: LOG_CONFIG.ENTITY.MIN_LENGTH,
        maxLength: LOG_CONFIG.ENTITY.MAX_LENGTH,
        messages: LOG_MESSAGES.ENTITY_VALIDATION,
      }),
      method: this.validateFilter(pagination?.method, {
        minLength: LOG_CONFIG.METHOD.MIN_LENGTH,
        maxLength: LOG_CONFIG.METHOD.MAX_LENGTH,
        messages: LOG_MESSAGES.METHOD_VALIDATION,
      }),
      action: this.validateFilter(pagination?.action, {
        minLength: LOG_CONFIG.ACTION.MIN_LENGTH,
        maxLength: LOG_CONFIG.ACTION.MAX_LENGTH,
        messages: LOG_MESSAGES.ACTION_VALIDATION,
      }),
      userId: pagination?.userId,
      ...period,
    }
  }

  private validateFilter(value: string | undefined, rules: FilterRules): string | undefined {
    if (value === undefined) {
      return undefined
    }

    if (!value) {
      this.throwError(rules.messages.NOT_EMPTY, GrpcStatus.INVALID_ARGUMENT)
    }

    if (typeof value !== 'string') {
      this.throwError(rules.messages.TYPE, GrpcStatus.INVALID_ARGUMENT)
    }

    const normalized = value.trim()

    if (normalized.length < rules.minLength || normalized.length > rules.maxLength) {
      this.throwError(rules.messages.LENGTH, GrpcStatus.INVALID_ARGUMENT)
    }

    return normalized
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

  private throwError(message: string, code: GrpcStatus): never {
    throw new RpcException({ message, code })
  }
}
