import { Controller } from '@nestjs/common'
import { GrpcMethod } from '@nestjs/microservices'

import { LogFeatureService } from './log-feature.service.js'

import type {
  GetLogInput,
  GetLogsByUserInput,
  GetLogsInput,
  LogOutput,
  LogServiceContract,
  PaginatedLogsOutput,
} from '@org/grpc-types'

@Controller()
export class LogFeatureController implements LogServiceContract {
  constructor(private readonly service: LogFeatureService) {}

  @GrpcMethod('LogService', 'GetLogs')
  async GetLogs(data: GetLogsInput): Promise<PaginatedLogsOutput> {
    return await this.service.GetLogs(data)
  }

  @GrpcMethod('LogService', 'GetLog')
  async GetLog(data: GetLogInput): Promise<LogOutput> {
    return await this.service.GetLog(data)
  }

  @GrpcMethod('LogService', 'GetLogsByUser')
  async GetLogsByUser(data: GetLogsByUserInput): Promise<PaginatedLogsOutput> {
    return await this.service.GetLogsByUser(data)
  }
}
