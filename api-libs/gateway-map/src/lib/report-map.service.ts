import { Injectable } from '@nestjs/common'
import {
  GRPC_TO_REPORT_FEEDBACKS,
  GRPC_TO_REPORT_PRIORITIES,
  GRPC_TO_REPORT_STATUSES,
  REPORT_FEEDBACKS_TO_GRPC,
  REPORT_PRIORITIES_TO_GRPC,
  REPORT_STATUSES_TO_GRPC,
  ReportFeedback,
  ReportPriority,
  ReportStatus,
} from '@org/enums'

import type {
  GrpcChangeReportStatusInput,
  GrpcCreateReportInput,
  GrpcReportPaginationInput,
  GrpcUpdateMyReportInput,
  GrpcUpdateReportInput,
} from './types/grpc-input.types.js'
import type {
  GrpcPaginatedReportsOutput,
  GrpcReportListOutput,
  GrpcReportOutput,
  GrpcReportPaginationOutput,
} from './types/grpc-output.types.js'
import type {
  ChangeReportStatusInput,
  CreateReportInput,
  PaginatedReportsOutput,
  ReportListOutput,
  ReportOutput,
  ReportPaginationInput,
  ReportPaginationOutput,
  UpdateMyReportInput,
  UpdateReportInput,
} from '@org/shared-types'

@Injectable()
export class ReportGatewayMapService {
  mapReportStatus(status: number): ReportStatus {
    return GRPC_TO_REPORT_STATUSES[status]
  }

  mapReportFeedback(feedback: number): ReportFeedback {
    return GRPC_TO_REPORT_FEEDBACKS[feedback]
  }

  mapReportPriority(priority: number): ReportPriority {
    return GRPC_TO_REPORT_PRIORITIES[priority]
  }

  mapReportList(report: GrpcReportListOutput): ReportListOutput {
    return {
      ...report,
      userId: report.userId ?? null,
      assignedToId: report.assignedToId ?? null,
      themeId: report.themeId ?? null,
      status: this.mapReportStatus(report.status),
      feedbackType: this.mapReportFeedback(report.feedbackType),
      priority: this.mapReportPriority(report.priority),
    }
  }

  mapReport(report: GrpcReportOutput): ReportOutput {
    return {
      ...report,
      userId: report.userId ?? null,
      assignedToId: report.assignedToId ?? null,
      feedbackContact: report.feedbackContact ?? null,
      themeId: report.themeId ?? null,
      status: this.mapReportStatus(report.status),
      feedbackType: this.mapReportFeedback(report.feedbackType),
      priority: this.mapReportPriority(report.priority),
      resolvedAt: report.resolvedAt ?? null,
    }
  }

  mapReportPagination(pagination: GrpcReportPaginationOutput): ReportPaginationOutput {
    return {
      ...pagination,
      status: pagination.status === undefined ? undefined : this.mapReportStatus(pagination.status),
      feedbackType:
        pagination.feedbackType === undefined
          ? undefined
          : this.mapReportFeedback(pagination.feedbackType),
      priority:
        pagination.priority === undefined ? undefined : this.mapReportPriority(pagination.priority),
    }
  }

  mapReportPaginationRequest(pagination: ReportPaginationInput): GrpcReportPaginationInput {
    return {
      ...pagination,
      status: pagination.status === undefined ? undefined : REPORT_STATUSES_TO_GRPC[pagination.status],
      feedbackType:
        pagination.feedbackType === undefined
          ? undefined
          : REPORT_FEEDBACKS_TO_GRPC[pagination.feedbackType],
      priority:
        pagination.priority === undefined ? undefined : REPORT_PRIORITIES_TO_GRPC[pagination.priority],
      dateFrom: pagination.dateFrom === undefined ? undefined : new Date(pagination.dateFrom).toISOString(),
      dateTo: pagination.dateTo === undefined ? undefined : new Date(pagination.dateTo).toISOString(),
    }
  }

  mapCreateReportRequest(dto: CreateReportInput): GrpcCreateReportInput {
    return {
      ...dto,
      feedbackType:
        dto.feedbackType === undefined ? undefined : REPORT_FEEDBACKS_TO_GRPC[dto.feedbackType],
    }
  }

  mapUpdateMyReportRequest(dto: UpdateMyReportInput): GrpcUpdateMyReportInput {
    return {
      ...dto,
      feedbackType:
        dto.feedbackType === undefined ? undefined : REPORT_FEEDBACKS_TO_GRPC[dto.feedbackType],
    }
  }

  mapUpdateReportRequest(dto: UpdateReportInput): GrpcUpdateReportInput {
    return {
      ...dto,
      status: dto.status === undefined ? undefined : REPORT_STATUSES_TO_GRPC[dto.status],
      feedbackType:
        dto.feedbackType === undefined ? undefined : REPORT_FEEDBACKS_TO_GRPC[dto.feedbackType],
      priority: dto.priority === undefined ? undefined : REPORT_PRIORITIES_TO_GRPC[dto.priority],
    }
  }

  mapChangeReportStatusRequest(dto: ChangeReportStatusInput): GrpcChangeReportStatusInput {
    return {
      ...dto,
      status: REPORT_STATUSES_TO_GRPC[dto.status],
    }
  }

  mapPaginatedReports(output: GrpcPaginatedReportsOutput): PaginatedReportsOutput {
    return {
      pagination: this.mapReportPagination(output.pagination),
      reports: (output.reports ?? []).map((report) => this.mapReportList(report)),
    }
  }
}
