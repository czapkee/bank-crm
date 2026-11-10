import { status as GrpcStatus } from '@grpc/grpc-js'
import { Injectable } from '@nestjs/common'
import { RpcException } from '@nestjs/microservices'
import {
  GRPC_TO_REPORT_FEEDBACKS,
  GRPC_TO_REPORT_PRIORITIES,
  GRPC_TO_REPORT_STATUSES,
} from '@org/enums'
import {
  ReportFeedback as DbReportFeedback,
  ReportPriority as DbReportPriority,
  ReportStatus as DbReportStatus,
} from '@org/report-database'
import { DateMapUtil, StringValidationUtil } from '@org/shared-utils'
import { REPORT_CONFIG, SHARED_CONFIG, THEME_CONFIG } from '@org/validation-config'
import { REPORT_MESSAGES, SHARED_MESSAGES, THEME_MESSAGES } from '@org/validation-messages'

import { ReportDatabaseUtil } from './database.util.js'

import type {
  ReportPaginationData,
  ThemePaginationData,
  ThemeWithChildren,
} from './database.util.js'
import type { Report, Theme } from '@org/report-database'

interface ReportPaginationLike {
  page?: number
  limit?: number
  search?: string
  userId?: string
  assignedToId?: string
  themeId?: string
  status?: number
  feedbackType?: number
  priority?: number
  dateFrom?: Date | string
  dateTo?: Date | string
}

interface ThemePaginationLike {
  page?: number
  limit?: number
  search?: string
  parentId?: string
}

@Injectable()
export class ReportValidateUtil {
  constructor(
    private readonly db: ReportDatabaseUtil,
    private readonly date: DateMapUtil,
    private readonly string: StringValidationUtil,
  ) {}

  async validateReportExists(id: string): Promise<Report> {
    this.string.validateId(id)
    const report = await this.db.findReportById(id)

    if (!report) {
      this.throwError(REPORT_MESSAGES.REPORT_NOT_FOUND, GrpcStatus.NOT_FOUND)
    }

    return report
  }

  async validateOwnedReport(id: string, userId: string): Promise<Report> {
    this.string.validateId(id)
    const report = await this.db.findOwnedReport(id, userId)

    if (!report) {
      this.throwError(REPORT_MESSAGES.REPORT_NOT_FOUND, GrpcStatus.NOT_FOUND)
    }

    return report
  }

  async validateThemeExists(id: string): Promise<Theme> {
    this.string.validateId(id)
    const theme = await this.db.findThemeById(id)

    if (!theme) {
      this.throwError(THEME_MESSAGES.THEME_NOT_FOUND, GrpcStatus.NOT_FOUND)
    }

    return theme
  }

  async validateThemeDetailedExists(id: string): Promise<ThemeWithChildren> {
    this.string.validateId(id)
    const theme = await this.db.findThemeWithChildren(id)

    if (!theme) {
      this.throwError(THEME_MESSAGES.THEME_NOT_FOUND, GrpcStatus.NOT_FOUND)
    }

    return theme
  }

  validateUserId(id: string): void {
    this.string.validateId(id)
  }

  validateTitle(title: string): string {
    if (!title) {
      this.throwError(REPORT_MESSAGES.TITLE_VALIDATION.NOT_EMPTY, GrpcStatus.INVALID_ARGUMENT)
    }

    if (typeof title !== 'string') {
      this.throwError(REPORT_MESSAGES.TITLE_VALIDATION.TYPE, GrpcStatus.INVALID_ARGUMENT)
    }

    const value = title.trim()

    if (
      value.length < REPORT_CONFIG.TITLE.MIN_LENGTH ||
      value.length > REPORT_CONFIG.TITLE.MAX_LENGTH
    ) {
      this.throwError(REPORT_MESSAGES.TITLE_VALIDATION.LENGTH, GrpcStatus.INVALID_ARGUMENT)
    }

    return value
  }

  validateContent(content: string): string {
    if (!content) {
      this.throwError(REPORT_MESSAGES.CONTENT_VALIDATION.NOT_EMPTY, GrpcStatus.INVALID_ARGUMENT)
    }

    if (typeof content !== 'string') {
      this.throwError(REPORT_MESSAGES.CONTENT_VALIDATION.TYPE, GrpcStatus.INVALID_ARGUMENT)
    }

    const value = content.trim()

    if (
      value.length < REPORT_CONFIG.CONTENT.MIN_LENGTH ||
      value.length > REPORT_CONFIG.CONTENT.MAX_LENGTH
    ) {
      this.throwError(REPORT_MESSAGES.CONTENT_VALIDATION.LENGTH, GrpcStatus.INVALID_ARGUMENT)
    }

    return value
  }

  validateFeedbackContact(contact: string): string {
    if (!contact) {
      this.throwError(
        REPORT_MESSAGES.FEEDBACK_CONTACT_VALIDATION.NOT_EMPTY,
        GrpcStatus.INVALID_ARGUMENT,
      )
    }

    if (typeof contact !== 'string') {
      this.throwError(
        REPORT_MESSAGES.FEEDBACK_CONTACT_VALIDATION.TYPE,
        GrpcStatus.INVALID_ARGUMENT,
      )
    }

    const value = contact.trim()

    if (
      value.length < REPORT_CONFIG.FEEDBACK_CONTACT.MIN_LENGTH ||
      value.length > REPORT_CONFIG.FEEDBACK_CONTACT.MAX_LENGTH
    ) {
      this.throwError(
        REPORT_MESSAGES.FEEDBACK_CONTACT_VALIDATION.LENGTH,
        GrpcStatus.INVALID_ARGUMENT,
      )
    }

    return value
  }

  validateFeedbackContactRequired(
    feedbackType: DbReportFeedback,
    contact: string | null | undefined,
  ): void {
    if (feedbackType !== DbReportFeedback.NOT_REQUIRED && !contact) {
      this.throwError(
        REPORT_MESSAGES.REPORT_FEEDBACK_CONTACT_REQUIRED,
        GrpcStatus.INVALID_ARGUMENT,
      )
    }
  }

  async validateThemeId(id: string): Promise<string> {
    await this.validateThemeExists(id)

    return id
  }

  validateAssignedToId(id: string): string {
    this.string.validateId(id)

    return id
  }

  validateReportStatus(status: number): DbReportStatus {
    const mapped = GRPC_TO_REPORT_STATUSES[status]

    if (mapped === undefined) {
      this.throwError(REPORT_MESSAGES.STATUS_VALIDATION.ENUM(), GrpcStatus.INVALID_ARGUMENT)
    }

    return mapped as unknown as DbReportStatus
  }

  validateReportFeedback(feedback: number): DbReportFeedback {
    const mapped = GRPC_TO_REPORT_FEEDBACKS[feedback]

    if (mapped === undefined) {
      this.throwError(REPORT_MESSAGES.FEEDBACK_VALIDATION.ENUM(), GrpcStatus.INVALID_ARGUMENT)
    }

    return mapped as unknown as DbReportFeedback
  }

  validateReportPriority(priority: number): DbReportPriority {
    const mapped = GRPC_TO_REPORT_PRIORITIES[priority]

    if (mapped === undefined) {
      this.throwError(REPORT_MESSAGES.PRIORITY_VALIDATION.ENUM(), GrpcStatus.INVALID_ARGUMENT)
    }

    return mapped as unknown as DbReportPriority
  }

  validateReportModifiable(report: Report): void {
    if (report.status === DbReportStatus.CLOSED) {
      this.throwError(REPORT_MESSAGES.REPORT_CLOSED, GrpcStatus.FAILED_PRECONDITION)
    }
  }

  validateReportPagination(pagination?: ReportPaginationLike): ReportPaginationData {
    this.validatePagination(pagination)
    const period = this.validatePeriod(pagination?.dateFrom, pagination?.dateTo)

    if (pagination?.userId !== undefined) {
      this.string.validateId(pagination.userId)
    }

    if (pagination?.assignedToId !== undefined) {
      this.string.validateId(pagination.assignedToId)
    }

    if (pagination?.themeId !== undefined) {
      this.string.validateId(pagination.themeId)
    }

    if (pagination?.status !== undefined) {
      this.validateReportStatus(pagination.status)
    }

    if (pagination?.feedbackType !== undefined) {
      this.validateReportFeedback(pagination.feedbackType)
    }

    if (pagination?.priority !== undefined) {
      this.validateReportPriority(pagination.priority)
    }

    return {
      page: pagination?.page,
      limit: pagination?.limit,
      search: pagination?.search?.trim(),
      userId: pagination?.userId,
      assignedToId: pagination?.assignedToId,
      themeId: pagination?.themeId,
      status: pagination?.status,
      feedbackType: pagination?.feedbackType,
      priority: pagination?.priority,
      ...period,
    }
  }

  validateThemePagination(pagination?: ThemePaginationLike): ThemePaginationData {
    this.validatePagination(pagination)

    if (pagination?.parentId !== undefined) {
      this.string.validateId(pagination.parentId)
    }

    return {
      page: pagination?.page,
      limit: pagination?.limit,
      search: pagination?.search?.trim(),
      parentId: pagination?.parentId,
    }
  }

  validateThemeName(name: string): string {
    if (!name) {
      this.throwError(THEME_MESSAGES.NAME_VALIDATION.NOT_EMPTY, GrpcStatus.INVALID_ARGUMENT)
    }

    if (typeof name !== 'string') {
      this.throwError(THEME_MESSAGES.NAME_VALIDATION.TYPE, GrpcStatus.INVALID_ARGUMENT)
    }

    const value = name.trim()

    if (
      value.length < THEME_CONFIG.NAME.MIN_LENGTH ||
      value.length > THEME_CONFIG.NAME.MAX_LENGTH
    ) {
      this.throwError(THEME_MESSAGES.NAME_VALIDATION.LENGTH, GrpcStatus.INVALID_ARGUMENT)
    }

    return value
  }

  validateThemeDescription(description: string): string {
    if (!description) {
      this.throwError(THEME_MESSAGES.DESCRIPTION_VALIDATION.NOT_EMPTY, GrpcStatus.INVALID_ARGUMENT)
    }

    if (typeof description !== 'string') {
      this.throwError(THEME_MESSAGES.DESCRIPTION_VALIDATION.TYPE, GrpcStatus.INVALID_ARGUMENT)
    }

    const value = description.trim()

    if (
      value.length < THEME_CONFIG.DESCRIPTION.MIN_LENGTH ||
      value.length > THEME_CONFIG.DESCRIPTION.MAX_LENGTH
    ) {
      this.throwError(THEME_MESSAGES.DESCRIPTION_VALIDATION.LENGTH, GrpcStatus.INVALID_ARGUMENT)
    }

    return value
  }

  async validateThemeNameAvailable(name: string, excludeId?: string): Promise<void> {
    if (await this.db.themeNameExists(name, excludeId)) {
      this.throwError(THEME_MESSAGES.THEME_NAME_EXISTS, GrpcStatus.ALREADY_EXISTS)
    }
  }

  async validateThemeParent(themeId: string | undefined, parentId: string): Promise<string> {
    await this.validateThemeExists(parentId)

    if (themeId === undefined) {
      return parentId
    }

    if (themeId === parentId) {
      this.throwError(THEME_MESSAGES.THEME_PARENT_INVALID, GrpcStatus.INVALID_ARGUMENT)
    }

    let current: string | null = parentId
    let depth = 0

    while (current !== null && depth < SHARED_CONFIG.PAGINATION.MAX_LIMIT * 10) {
      if (current === themeId) {
        this.throwError(THEME_MESSAGES.THEME_PARENT_INVALID, GrpcStatus.INVALID_ARGUMENT)
      }

      current = await this.db.findThemeParentId(current)
      depth += 1
    }

    return parentId
  }

  async validateThemeHasNoChildren(id: string): Promise<void> {
    if (await this.db.themeHasChildren(id)) {
      this.throwError(THEME_MESSAGES.THEME_HAS_CHILDREN, GrpcStatus.FAILED_PRECONDITION)
    }
  }

  private validatePagination(pagination?: {
    page?: number
    limit?: number
    search?: string
  }): void {
    const page = pagination?.page

    if (
      page !== undefined &&
      (!Number.isInteger(page) || page < SHARED_CONFIG.PAGINATION.MIN_PAGE)
    ) {
      this.throwError(
        SHARED_MESSAGES.PAGINATION_PAGE_VALIDATION.MIN,
        GrpcStatus.INVALID_ARGUMENT,
      )
    }

    const limit = pagination?.limit

    if (
      limit !== undefined &&
      (!Number.isInteger(limit) ||
        limit < SHARED_CONFIG.PAGINATION.MIN_LIMIT ||
        limit > SHARED_CONFIG.PAGINATION.MAX_LIMIT)
    ) {
      this.throwError(
        SHARED_MESSAGES.PAGINATION_LIMIT_VALIDATION.MAX,
        GrpcStatus.INVALID_ARGUMENT,
      )
    }

    const search = pagination?.search

    if (
      search !== undefined &&
      (search.length < SHARED_CONFIG.SEARCH.MIN_LENGTH ||
        search.length > SHARED_CONFIG.SEARCH.MAX_LENGTH)
    ) {
      this.throwError(
        SHARED_MESSAGES.PAGINATION_SEARCH_VALIDATION.LENGTH,
        GrpcStatus.INVALID_ARGUMENT,
      )
    }
  }

  private validatePeriod(
    dateFrom?: Date | string,
    dateTo?: Date | string,
  ): { dateFrom?: Date; dateTo?: Date } {
    const from = dateFrom === undefined ? undefined : this.date.mapDateAndValidate(dateFrom)
    const to = dateTo === undefined ? undefined : this.date.mapDateAndValidate(dateTo)

    if (from !== undefined && to !== undefined && from.getTime() > to.getTime()) {
      this.throwError(SHARED_MESSAGES.INVALID_DATE, GrpcStatus.INVALID_ARGUMENT)
    }

    return {
      ...(from === undefined ? {} : { dateFrom: from }),
      ...(to === undefined ? {} : { dateTo: to }),
    }
  }

  private throwError(message: string, code: GrpcStatus): never {
    throw new RpcException({ message, code })
  }
}
