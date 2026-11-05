import { Controller } from '@nestjs/common'
import { GrpcMethod } from '@nestjs/microservices'

import { ReportAdminFeatureService } from './report-admin-feature.service.js'

import type {
  AssignReportInput,
  ChangeReportStatusInput,
  Empty,
  GetAdminReportInput,
  GetReportsInput,
  PaginatedReportsOutput,
  ReportActionInput,
  ReportAdminServiceContract,
  ReportOutput,
  UpdateReportInput,
} from '@org/grpc-types'

@Controller()
export class ReportAdminFeatureController implements ReportAdminServiceContract {
  constructor(private readonly service: ReportAdminFeatureService) {}

  @GrpcMethod('ReportAdminService', 'GetReports')
  async GetReports(data: GetReportsInput): Promise<PaginatedReportsOutput> {
    return await this.service.GetReports(data)
  }

  @GrpcMethod('ReportAdminService', 'GetReport')
  async GetReport(data: GetAdminReportInput): Promise<ReportOutput> {
    return await this.service.GetReport(data)
  }

  @GrpcMethod('ReportAdminService', 'UpdateReport')
  async UpdateReport(data: UpdateReportInput): Promise<ReportOutput> {
    return await this.service.UpdateReport(data)
  }

  @GrpcMethod('ReportAdminService', 'AssignReport')
  async AssignReport(data: AssignReportInput): Promise<ReportOutput> {
    return await this.service.AssignReport(data)
  }

  @GrpcMethod('ReportAdminService', 'ChangeReportStatus')
  async ChangeReportStatus(data: ChangeReportStatusInput): Promise<ReportOutput> {
    return await this.service.ChangeReportStatus(data)
  }

  @GrpcMethod('ReportAdminService', 'ResolveReport')
  async ResolveReport(data: ReportActionInput): Promise<ReportOutput> {
    return await this.service.ResolveReport(data)
  }

  @GrpcMethod('ReportAdminService', 'DeleteReport')
  async DeleteReport(data: ReportActionInput): Promise<Empty> {
    return await this.service.DeleteReport(data)
  }
}
