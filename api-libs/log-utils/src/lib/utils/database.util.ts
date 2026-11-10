import { Injectable } from '@nestjs/common'
import { LogDatabaseService } from '@org/log-database'
import { PaginationUtil } from '@org/shared-utils'

import type { Log, LogWhereInput } from '@org/log-database'

export interface LogPaginationData {
  page?: number
  limit?: number
  search?: string
  service?: string
  entity?: string
  method?: string
  action?: string
  userId?: string
  dateFrom?: Date
  dateTo?: Date
}

export interface LogPaginationResult {
  page: number
  limit: number
  total: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
  search?: string
  service?: string
  entity?: string
  method?: string
  action?: string
  userId?: string
  dateFrom?: string
  dateTo?: string
}

export interface LogListResult {
  logs: Log[]
  pagination: LogPaginationResult
}

@Injectable()
export class LogDatabaseUtil {
  constructor(
    protected readonly db: LogDatabaseService,
    protected readonly pagination: PaginationUtil,
  ) {}

  async getLogs(data: LogPaginationData): Promise<LogListResult> {
    const where = this.buildWhere(data)
    const total = await this.db.log.count({ where })
    const params = this.pagination.getPaginationParams(total, data.page, data.limit)
    const logs = await this.db.log.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: params.skip,
      take: params.limit,
    })

    return {
      logs,
      pagination: {
        page: params.page,
        limit: params.limit,
        total: params.total,
        totalPages: params.totalPages,
        hasNext: params.hasNext,
        hasPrev: params.hasPrev,
        search: data.search,
        service: data.service,
        entity: data.entity,
        method: data.method,
        action: data.action,
        userId: data.userId,
        dateFrom: data.dateFrom?.toISOString(),
        dateTo: data.dateTo?.toISOString(),
      },
    }
  }

  findLogById(id: string): Promise<Log | null> {
    return this.db.log.findUnique({ where: { id } })
  }

  private buildWhere(data: LogPaginationData): LogWhereInput {
    const filters: LogWhereInput[] = []

    if (data.service !== undefined) {
      filters.push({ service: { contains: data.service, mode: 'insensitive' } })
    }

    if (data.entity !== undefined) {
      filters.push({ entity: { contains: data.entity, mode: 'insensitive' } })
    }

    if (data.method !== undefined) {
      filters.push({ method: { contains: data.method, mode: 'insensitive' } })
    }

    if (data.action !== undefined) {
      filters.push({ action: { contains: data.action, mode: 'insensitive' } })
    }

    if (data.userId !== undefined) {
      filters.push({ userId: data.userId })
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
      filters.push({
        OR: [
          { service: { contains: data.search, mode: 'insensitive' } },
          { entity: { contains: data.search, mode: 'insensitive' } },
          { method: { contains: data.search, mode: 'insensitive' } },
          { action: { contains: data.search, mode: 'insensitive' } },
          { userAgent: { contains: data.search, mode: 'insensitive' } },
        ],
      })
    }

    return filters.length === 0 ? {} : { AND: filters }
  }
}
