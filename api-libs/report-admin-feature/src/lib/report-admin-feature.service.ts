import { Injectable } from '@nestjs/common'

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

@Injectable()
export class ReportAdminFeatureService implements ReportAdminServiceContract {
  async GetReports(_data: GetReportsInput): Promise<PaginatedReportsOutput> {
    throw new Error('Method not implemented')
  }

  async GetReport(_data: GetAdminReportInput): Promise<ReportOutput> {
    throw new Error('Method not implemented')
  }

  async UpdateReport(_data: UpdateReportInput): Promise<ReportOutput> {
    throw new Error('Method not implemented')
  }

  async AssignReport(_data: AssignReportInput): Promise<ReportOutput> {
    throw new Error('Method not implemented')
  }

  async ChangeReportStatus(_data: ChangeReportStatusInput): Promise<ReportOutput> {
    throw new Error('Method not implemented')
  }

  async ResolveReport(_data: ReportActionInput): Promise<ReportOutput> {
    throw new Error('Method not implemented')
  }

  async DeleteReport(_data: ReportActionInput): Promise<Empty> {
    throw new Error('Method not implemented')
  }
}
