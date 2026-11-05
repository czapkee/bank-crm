import { Controller } from '@nestjs/common'
import { GrpcMethod } from '@nestjs/microservices'

import { ReportFeatureService } from './report-feature.service.js'

import type {
  CreateReportInput,
  Empty,
  GetMyReportInput,
  GetMyReportsInput,
  MyReportActionInput,
  PaginatedReportsOutput,
  ReportOutput,
  ReportServiceContract,
  UpdateMyReportInput,
} from '@org/grpc-types'

@Controller()
export class ReportFeatureController implements ReportServiceContract {
  constructor(private readonly service: ReportFeatureService) {}

  @GrpcMethod('ReportService', 'CreateReport')
  async CreateReport(data: CreateReportInput): Promise<ReportOutput> {
    return await this.service.CreateReport(data)
  }

  @GrpcMethod('ReportService', 'GetMyReports')
  async GetMyReports(data: GetMyReportsInput): Promise<PaginatedReportsOutput> {
    return await this.service.GetMyReports(data)
  }

  @GrpcMethod('ReportService', 'GetMyReport')
  async GetMyReport(data: GetMyReportInput): Promise<ReportOutput> {
    return await this.service.GetMyReport(data)
  }

  @GrpcMethod('ReportService', 'UpdateMyReport')
  async UpdateMyReport(data: UpdateMyReportInput): Promise<ReportOutput> {
    return await this.service.UpdateMyReport(data)
  }

  @GrpcMethod('ReportService', 'DeleteMyReport')
  async DeleteMyReport(data: MyReportActionInput): Promise<Empty> {
    return await this.service.DeleteMyReport(data)
  }
}
