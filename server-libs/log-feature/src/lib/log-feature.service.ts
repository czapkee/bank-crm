import { Injectable } from '@nestjs/common'

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
  async GetLogs(_data: GetLogsInput): Promise<PaginatedLogsOutput> {
    throw new Error('Method not implemented')
  }

  async GetLog(_data: GetLogInput): Promise<LogOutput> {
    throw new Error('Method not implemented')
  }

  async GetLogsByUser(_data: GetLogsByUserInput): Promise<PaginatedLogsOutput> {
    throw new Error('Method not implemented')
  }
}
