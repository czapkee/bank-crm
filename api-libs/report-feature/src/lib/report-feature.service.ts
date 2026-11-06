import { Injectable } from '@nestjs/common'

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

@Injectable()
export class ReportFeatureService implements ReportServiceContract {
  async CreateReport(_data: CreateReportInput): Promise<ReportOutput> {
    throw new Error('Method not implemented')
  }

  async GetMyReports(_data: GetMyReportsInput): Promise<PaginatedReportsOutput> {
    throw new Error('Method not implemented')
  }

  async GetMyReport(_data: GetMyReportInput): Promise<ReportOutput> {
    throw new Error('Method not implemented')
  }

  async UpdateMyReport(_data: UpdateMyReportInput): Promise<ReportOutput> {
    throw new Error('Method not implemented')
  }

  async DeleteMyReport(_data: MyReportActionInput): Promise<Empty> {
    throw new Error('Method not implemented')
  }
}
