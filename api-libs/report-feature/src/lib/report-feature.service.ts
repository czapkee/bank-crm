import { Injectable } from '@nestjs/common'
import { ReportFeedback as DbReportFeedback } from '@org/report-database'
import { ReportAuthUtil, ReportDatabaseUtil, ReportMapUtil, ReportValidateUtil } from '@org/report-utils'

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
  constructor(
    private readonly db: ReportDatabaseUtil,
    private readonly auth: ReportAuthUtil,
    private readonly validate: ReportValidateUtil,
    private readonly map: ReportMapUtil,
  ) {}

  async CreateReport(data: CreateReportInput): Promise<ReportOutput> {
    const payload = this.auth.validateClientAccess(data.validation.accessToken)
    const title = this.validate.validateTitle(data.title)
    const content = this.validate.validateContent(data.content)
    const feedbackContact =
      data.feedbackContact === undefined
        ? undefined
        : this.validate.validateFeedbackContact(data.feedbackContact)
    const feedbackType =
      data.feedbackType === undefined
        ? DbReportFeedback.NOT_REQUIRED
        : this.validate.validateReportFeedback(data.feedbackType)
    const themeId =
      data.themeId === undefined ? undefined : await this.validate.validateThemeId(data.themeId)

    this.validate.validateFeedbackContactRequired(feedbackType, feedbackContact)

    const report = await this.db.createReport({
      userId: payload.id,
      title,
      content,
      feedbackContact,
      themeId,
      feedbackType,
    })

    return this.map.mapReport(report)
  }

  async GetMyReports(data: GetMyReportsInput): Promise<PaginatedReportsOutput> {
    const payload = this.auth.validateClientAccess(data.validation.accessToken)
    const pagination = this.validate.validateReportPagination(data.pagination)
    const result = await this.db.getReports({ ...pagination, userId: payload.id })

    return this.map.mapReportListResult(result)
  }

  async GetMyReport(data: GetMyReportInput): Promise<ReportOutput> {
    const payload = this.auth.validateClientAccess(data.validation.accessToken)
    const report = await this.validate.validateOwnedReport(data.id, payload.id)

    return this.map.mapReport(report)
  }

  async UpdateMyReport(data: UpdateMyReportInput): Promise<ReportOutput> {
    const payload = this.auth.validateClientAccess(data.validation.accessToken)
    const existing = await this.validate.validateOwnedReport(data.id, payload.id)
    this.validate.validateReportModifiable(existing)

    const title = data.title === undefined ? undefined : this.validate.validateTitle(data.title)
    const content =
      data.content === undefined ? undefined : this.validate.validateContent(data.content)
    const feedbackContact =
      data.feedbackContact === undefined
        ? undefined
        : this.validate.validateFeedbackContact(data.feedbackContact)
    const feedbackType =
      data.feedbackType === undefined
        ? undefined
        : this.validate.validateReportFeedback(data.feedbackType)
    const themeId =
      data.themeId === undefined ? undefined : await this.validate.validateThemeId(data.themeId)

    if (feedbackType !== undefined || data.feedbackContact !== undefined) {
      this.validate.validateFeedbackContactRequired(
        feedbackType ?? existing.feedbackType,
        data.feedbackContact === undefined ? existing.feedbackContact : feedbackContact,
      )
    }

    const report = await this.db.updateReport(data.id, {
      title,
      content,
      feedbackContact,
      themeId,
      feedbackType,
    })

    return this.map.mapReport(report)
  }

  async DeleteMyReport(data: MyReportActionInput): Promise<Empty> {
    const payload = this.auth.validateClientAccess(data.validation.accessToken)
    await this.validate.validateOwnedReport(data.id, payload.id)
    await this.db.deleteReport(data.id)

    return {}
  }
}
