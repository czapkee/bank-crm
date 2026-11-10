import { Injectable } from '@nestjs/common'
import { LogAuthUtil, LogDatabaseUtil, LogMapUtil, LogValidateUtil } from '@org/log-utils'

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
  ) {}

  async GetLogs(data: GetLogsInput): Promise<PaginatedLogsOutput> {
    this.auth.validateAdminAccess(data.validation.accessToken)
    const pagination = this.validate.validateLogPagination(data.pagination)
    const result = await this.db.getLogs(pagination)

    return this.map.mapLogList(result)
  }

  async GetLog(data: GetLogInput): Promise<LogOutput> {
    this.auth.validateAdminAccess(data.validation.accessToken)
    const log = await this.validate.validateLogExists(data.id)

    return this.map.mapLog(log)
  }

  async GetLogsByUser(data: GetLogsByUserInput): Promise<PaginatedLogsOutput> {
    this.auth.validateAdminAccess(data.validation.accessToken)
    this.validate.validateUserId(data.userId)
    const pagination = this.validate.validateLogPagination(data.pagination)
    const result = await this.db.getLogs({ ...pagination, userId: data.userId })

    return this.map.mapLogList(result)
  }
}
