import { Injectable } from '@nestjs/common'

import type { GrpcLogPaginationInput } from './types/grpc-input.types.js'
import type { GrpcLogOutput, GrpcPaginatedLogsOutput } from './types/grpc-output.types.js'
import type { LogOutput, LogPaginationInput, PaginatedLogsOutput } from '@org/shared-types'

@Injectable()
export class LogGatewayMapService {
  mapLog(log: GrpcLogOutput): LogOutput {
    return {
      ...log,
      entity: log.entity ?? null,
      userId: log.userId ?? null,
      data: this.parseData(log.data),
      userAgent: log.userAgent ?? null,
    }
  }

  mapLogPaginationRequest(pagination: LogPaginationInput): GrpcLogPaginationInput {
    return {
      ...pagination,
      dateFrom: pagination.dateFrom === undefined ? undefined : new Date(pagination.dateFrom).toISOString(),
      dateTo: pagination.dateTo === undefined ? undefined : new Date(pagination.dateTo).toISOString(),
    }
  }

  mapPaginatedLogs(output: GrpcPaginatedLogsOutput): PaginatedLogsOutput {
    return {
      pagination: output.pagination,
      logs: (output.logs ?? []).map((log) => this.mapLog(log)),
    }
  }

  private parseData(data: string | null | undefined): unknown {
    if (data === null || data === undefined) {
      return null
    }

    try {
      return JSON.parse(data)
    } catch {
      return data
    }
  }
}
