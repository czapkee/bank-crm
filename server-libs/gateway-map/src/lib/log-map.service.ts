import { Injectable } from '@nestjs/common'

import type { GrpcLogOutput, GrpcPaginatedLogsOutput } from './types/grpc-output.types.js'
import type { LogOutput, PaginatedLogsOutput } from '@org/shared-types'

@Injectable()
export class LogGatewayMapService {
  mapLog(log: GrpcLogOutput): LogOutput {
    return {
      ...log,
      data: this.parseData(log.data),
    }
  }

  mapPaginatedLogs(output: GrpcPaginatedLogsOutput): PaginatedLogsOutput {
    return {
      pagination: output.pagination,
      logs: output.logs.map((log) => this.mapLog(log)),
    }
  }

  private parseData(data: string | null): unknown {
    if (data === null) {
      return null
    }

    try {
      return JSON.parse(data)
    } catch {
      return data
    }
  }
}
