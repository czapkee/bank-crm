import { Injectable } from '@nestjs/common'
import {
  REPORT_FEEDBACKS_TO_GRPC,
  REPORT_PRIORITIES_TO_GRPC,
  REPORT_STATUSES_TO_GRPC,
} from '@org/enums'

import type {
  ReportListResult,
  ReportPaginationResult,
  ThemeListResult,
  ThemePaginationResult,
  ThemeWithChildren,
} from './database.util.js'
import type {
  ReportFeedback,
  ReportPriority,
  ReportStatus,
} from '@org/enums'
import type {
  PaginatedReportsOutput,
  PaginatedThemesOutput,
  ReportListOutput,
  ReportOutput,
  ReportPaginationOutput,
  ThemeDetailedOutput,
  ThemeOutput,
  ThemePaginationOutput,
} from '@org/grpc-types'
import type { Report, Theme } from '@org/report-database'

@Injectable()
export class ReportMapUtil {
  mapReportList(report: Report): ReportListOutput {
    return {
      id: report.id,
      userId: report.userId,
      assignedToId: report.assignedToId,
      title: report.title,
      themeId: report.themeId,
      status: REPORT_STATUSES_TO_GRPC[report.status as ReportStatus],
      feedbackType: REPORT_FEEDBACKS_TO_GRPC[report.feedbackType as ReportFeedback],
      priority: REPORT_PRIORITIES_TO_GRPC[report.priority as ReportPriority],
      createdAt: report.createdAt.toISOString(),
      updatedAt: report.updatedAt.toISOString(),
    }
  }

  mapReport(report: Report): ReportOutput {
    return {
      id: report.id,
      userId: report.userId,
      assignedToId: report.assignedToId,
      title: report.title,
      content: report.content,
      feedbackContact: report.feedbackContact,
      themeId: report.themeId,
      status: REPORT_STATUSES_TO_GRPC[report.status as ReportStatus],
      feedbackType: REPORT_FEEDBACKS_TO_GRPC[report.feedbackType as ReportFeedback],
      priority: REPORT_PRIORITIES_TO_GRPC[report.priority as ReportPriority],
      resolvedAt: report.resolvedAt?.toISOString() ?? null,
      createdAt: report.createdAt.toISOString(),
      updatedAt: report.updatedAt.toISOString(),
    }
  }

  mapTheme(theme: Theme): ThemeOutput {
    return {
      id: theme.id,
      name: theme.name,
      description: theme.description,
      parentId: theme.parentId,
      createdAt: theme.createdAt.toISOString(),
      updatedAt: theme.updatedAt.toISOString(),
    }
  }

  mapThemeDetailed(theme: ThemeWithChildren): ThemeDetailedOutput {
    return {
      ...this.mapTheme(theme),
      children: theme.children.map((child) => this.mapTheme(child)),
    }
  }

  mapReportPagination(pagination: ReportPaginationResult): ReportPaginationOutput {
    return {
      page: pagination.page,
      limit: pagination.limit,
      total: pagination.total,
      totalPages: pagination.totalPages,
      hasNext: pagination.hasNext,
      hasPrev: pagination.hasPrev,
      search: pagination.search,
      userId: pagination.userId,
      assignedToId: pagination.assignedToId,
      themeId: pagination.themeId,
      status: pagination.status,
      feedbackType: pagination.feedbackType,
      priority: pagination.priority,
      dateFrom: pagination.dateFrom,
      dateTo: pagination.dateTo,
    }
  }

  mapThemePagination(pagination: ThemePaginationResult): ThemePaginationOutput {
    return {
      page: pagination.page,
      limit: pagination.limit,
      total: pagination.total,
      totalPages: pagination.totalPages,
      hasNext: pagination.hasNext,
      hasPrev: pagination.hasPrev,
      search: pagination.search,
      parentId: pagination.parentId,
    }
  }

  mapReportListResult(result: ReportListResult): PaginatedReportsOutput {
    return {
      pagination: this.mapReportPagination(result.pagination),
      reports: result.reports.map((report) => this.mapReportList(report)),
    }
  }

  mapThemeListResult(result: ThemeListResult): PaginatedThemesOutput {
    return {
      pagination: this.mapThemePagination(result.pagination),
      themes: result.themes.map((theme) => this.mapTheme(theme)),
    }
  }
}
