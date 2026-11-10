import { Injectable } from '@nestjs/common'
import { LogAuthUtil, LogCacheUtil, LogDatabaseUtil, LogMapUtil, LogValidateUtil } from '@org/log-utils'

import type {
  GetLogInput,
  GetLogsByUserInput,
  GetLogsInput,
  LogOutput,
  LogServiceContract,
  PaginatedLogsOutput,
} from '@org/grpc-types'

@Injectable()
export class LogFeatureService implements LogServiceContract {
  constructor(
    private readonly db: LogDatabaseUtil,
    private readonly auth: LogAuthUtil,
    private readonly validate: LogValidateUtil,
    private readonly map: LogMapUtil,
    private readonly cache: LogCacheUtil,
  ) {}

  async GetLogs(data: GetLogsInput): Promise<PaginatedLogsOutput> {
    this.auth.validateAdminAccess(data.validation.accessToken)
    const pagination = this.validate.validateLogPagination(data.pagination)
    const cacheKey = `list:${JSON.stringify(pagination)}`
    const cached = await this.cache.get<PaginatedLogsOutput>(cacheKey)

    if (cached) {
      return cached
    }

    const result = await this.db.getLogs(pagination)
    const response = this.map.mapLogList(result)

    await this.cache.set(cacheKey, response)

    return response
  }

  async GetLog(data: GetLogInput): Promise<LogOutput> {
    this.auth.validateAdminAccess(data.validation.accessToken)
    const cacheKey = `item:${data.id}`
    const cached = await this.cache.get<LogOutput>(cacheKey)

    if (cached) {
      return cached
    }

    const log = await this.validate.validateLogExists(data.id)
    const response = this.map.mapLog(log)

    await this.cache.set(cacheKey, response)

    return response
  }

  async GetLogsByUser(data: GetLogsByUserInput): Promise<PaginatedLogsOutput> {
    this.auth.validateAdminAccess(data.validation.accessToken)
    this.validate.validateUserId(data.userId)
    const pagination = this.validate.validateLogPagination(data.pagination)
    const cacheKey = `user:${data.userId}:${JSON.stringify(pagination)}`
    const cached = await this.cache.get<PaginatedLogsOutput>(cacheKey)

    if (cached) {
      return cached
    }

    const result = await this.db.getLogs({ ...pagination, userId: data.userId })
    const response = this.map.mapLogList(result)

    await this.cache.set(cacheKey, response)

    return response
  }
}
