import { Injectable } from '@nestjs/common'

import type { LogListResult, LogPaginationResult } from './database.util.js'
import type {
  LogOutput,
  LogPaginationOutput,
  PaginatedLogsOutput,
} from '@org/grpc-types'
import type { Log } from '@org/log-database'

@Injectable()
export class LogMapUtil {
  mapLog(log: Log): LogOutput {
    return {
      id: log.id,
      service: log.service,
      entity: log.entity,
      method: log.method,
      action: log.action,
      userId: log.userId,
      data: log.data === null ? null : JSON.stringify(log.data),
      userAgent: log.userAgent,
      createdAt: log.createdAt.toISOString(),
    }
  }

  mapLogPagination(pagination: LogPaginationResult): LogPaginationOutput {
    return {
      page: pagination.page,
      limit: pagination.limit,
      total: pagination.total,
      totalPages: pagination.totalPages,
      hasNext: pagination.hasNext,
      hasPrev: pagination.hasPrev,
      search: pagination.search,
      service: pagination.service,
      entity: pagination.entity,
      method: pagination.method,
      action: pagination.action,
      userId: pagination.userId,
      dateFrom: pagination.dateFrom,
      dateTo: pagination.dateTo,
    }
  }

  mapLogList(result: LogListResult): PaginatedLogsOutput {
    return {
      pagination: this.mapLogPagination(result.pagination),
      logs: result.logs.map((log) => this.mapLog(log)),
    }
  }
}
