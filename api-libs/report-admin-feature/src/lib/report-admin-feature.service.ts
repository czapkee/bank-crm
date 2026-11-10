import { status as GrpcStatus } from '@grpc/grpc-js'
import { Injectable } from '@nestjs/common'
import { RpcException } from '@nestjs/microservices'
import { ReportStatus as DbReportStatus } from '@org/report-database'
import { ReportAuthUtil, ReportDatabaseUtil, ReportMapUtil, ReportValidateUtil } from '@org/report-utils'
import { REPORT_MESSAGES } from '@org/validation-messages'

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
  constructor(
    private readonly db: ReportDatabaseUtil,
    private readonly auth: ReportAuthUtil,
    private readonly validate: ReportValidateUtil,
    private readonly map: ReportMapUtil,
  ) {}

  async GetReports(data: GetReportsInput): Promise<PaginatedReportsOutput> {
    this.auth.validateAdminAccess(data.validation.accessToken)
    const pagination = this.validate.validateReportPagination(data.pagination)
    const result = await this.db.getReports(pagination)

    return this.map.mapReportListResult(result)
  }

  async GetReport(data: GetAdminReportInput): Promise<ReportOutput> {
    this.auth.validateAdminAccess(data.validation.accessToken)
    const report = await this.validate.validateReportExists(data.id)

    return this.map.mapReport(report)
  }

  async UpdateReport(data: UpdateReportInput): Promise<ReportOutput> {
    this.auth.validateAdminAccess(data.validation.accessToken)
    const existing = await this.validate.validateReportExists(data.id)
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
    const status =
      data.status === undefined ? undefined : this.validate.validateReportStatus(data.status)
    const priority =
      data.priority === undefined ? undefined : this.validate.validateReportPriority(data.priority)
    const themeId =
      data.themeId === undefined ? undefined : await this.validate.validateThemeId(data.themeId)
    const assignedToId =
      data.assignedToId === undefined
        ? undefined
        : this.validate.validateAssignedToId(data.assignedToId)

    if (
      existing.status === DbReportStatus.CLOSED &&
      status !== undefined &&
      status !== DbReportStatus.CLOSED
    ) {
      this.throwClosed()
    }

    if (feedbackType !== undefined || data.feedbackContact !== undefined) {
      this.validate.validateFeedbackContactRequired(
        feedbackType ?? existing.feedbackType,
        data.feedbackContact === undefined ? existing.feedbackContact : feedbackContact,
      )
    }

    const resolvedAt =
      status === undefined
        ? undefined
        : status === DbReportStatus.CLOSED
          ? existing.resolvedAt ?? new Date()
          : null

    const report = await this.db.updateReport(data.id, {
      title,
      content,
      feedbackContact,
      themeId,
      status,
      feedbackType,
      priority,
      assignedToId,
      resolvedAt,
    })

    return this.map.mapReport(report)
  }

  async AssignReport(data: AssignReportInput): Promise<ReportOutput> {
    this.auth.validateAdminAccess(data.validation.accessToken)
    const existing = await this.validate.validateReportExists(data.id)
    this.validate.validateReportModifiable(existing)

    if (data.assignedToId === undefined) {
      const report = await this.db.updateReport(data.id, { assignedToId: null })
      return this.map.mapReport(report)
    }

    const assignedToId = this.validate.validateAssignedToId(data.assignedToId)

    if (existing.assignedToId === assignedToId) {
      return this.map.mapReport(existing)
    }

    const report = await this.db.updateReport(data.id, { assignedToId })

    return this.map.mapReport(report)
  }

  async ChangeReportStatus(data: ChangeReportStatusInput): Promise<ReportOutput> {
    this.auth.validateAdminAccess(data.validation.accessToken)
    const existing = await this.validate.validateReportExists(data.id)
    const status = this.validate.validateReportStatus(data.status)

    if (existing.status === DbReportStatus.CLOSED && status !== DbReportStatus.CLOSED) {
      this.throwClosed()
    }

    if (existing.status === status) {
      return this.map.mapReport(existing)
    }

    const resolvedAt =
      status === DbReportStatus.CLOSED ? existing.resolvedAt ?? new Date() : null
    const report = await this.db.updateReport(data.id, { status, resolvedAt })

    return this.map.mapReport(report)
  }

  async ResolveReport(data: ReportActionInput): Promise<ReportOutput> {
    this.auth.validateAdminAccess(data.validation.accessToken)
    const existing = await this.validate.validateReportExists(data.id)
    this.validate.validateReportModifiable(existing)

    const report = await this.db.updateReport(data.id, {
      status: DbReportStatus.CLOSED,
      resolvedAt: new Date(),
    })

    return this.map.mapReport(report)
  }

  async DeleteReport(data: ReportActionInput): Promise<Empty> {
    this.auth.validateAdminAccess(data.validation.accessToken)
    await this.validate.validateReportExists(data.id)
    await this.db.deleteReport(data.id)

    return {}
  }

  private throwClosed(): never {
    throw new RpcException({
      message: REPORT_MESSAGES.REPORT_CLOSED,
      code: GrpcStatus.FAILED_PRECONDITION,
    })
  }
}
