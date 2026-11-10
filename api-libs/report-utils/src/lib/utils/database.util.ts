import { Injectable } from '@nestjs/common'
import {
  GRPC_TO_REPORT_FEEDBACKS,
  GRPC_TO_REPORT_PRIORITIES,
  GRPC_TO_REPORT_STATUSES,
} from '@org/enums'
import {
  ReportDatabaseService,
  ReportFeedback as DbReportFeedback,
  ReportPriority as DbReportPriority,
  ReportStatus as DbReportStatus,
} from '@org/report-database'
import { PaginationUtil } from '@org/shared-utils'

import type {
  Report,
  ReportWhereInput,
  Theme,
  ThemeWhereInput,
} from '@org/report-database'

export interface ReportPaginationData {
  page?: number
  limit?: number
  search?: string
  userId?: string
  assignedToId?: string
  themeId?: string
  status?: number
  feedbackType?: number
  priority?: number
  dateFrom?: Date
  dateTo?: Date
}

export interface ReportPaginationResult {
  page: number
  limit: number
  total: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
  search?: string
  userId?: string
  assignedToId?: string
  themeId?: string
  status?: number
  feedbackType?: number
  priority?: number
  dateFrom?: string
  dateTo?: string
}

export interface ThemePaginationData {
  page?: number
  limit?: number
  search?: string
  parentId?: string
}

export interface ThemePaginationResult {
  page: number
  limit: number
  total: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
  search?: string
  parentId?: string
}

export interface ReportListResult {
  reports: Report[]
  pagination: ReportPaginationResult
}

export interface ThemeListResult {
  themes: Theme[]
  pagination: ThemePaginationResult
}

export interface CreateReportData {
  userId: string
  title: string
  content: string
  feedbackContact?: string
  themeId?: string
  feedbackType: DbReportFeedback
}

export interface UpdateReportData {
  title?: string
  content?: string
  feedbackContact?: string
  themeId?: string
  status?: DbReportStatus
  feedbackType?: DbReportFeedback
  priority?: DbReportPriority
  assignedToId?: string | null
  resolvedAt?: Date | null
}

export interface CreateThemeData {
  name: string
  description?: string
  parentId?: string
}

export interface UpdateThemeData {
  name?: string
  description?: string
  parentId?: string
}

export interface ThemeWithChildren extends Theme {
  children: Theme[]
}

@Injectable()
export class ReportDatabaseUtil {
  constructor(
    protected readonly db: ReportDatabaseService,
    protected readonly pagination: PaginationUtil,
  ) {}

  async getReports(data: ReportPaginationData): Promise<ReportListResult> {
    const where = this.buildReportWhere(data)
    const total = await this.db.report.count({ where })
    const params = this.pagination.getPaginationParams(total, data.page, data.limit)
    const reports = await this.db.report.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: params.skip,
      take: params.limit,
    })

    return {
      reports,
      pagination: {
        page: params.page,
        limit: params.limit,
        total: params.total,
        totalPages: params.totalPages,
        hasNext: params.hasNext,
        hasPrev: params.hasPrev,
        search: data.search,
        userId: data.userId,
        assignedToId: data.assignedToId,
        themeId: data.themeId,
        status: data.status,
        feedbackType: data.feedbackType,
        priority: data.priority,
        dateFrom: data.dateFrom?.toISOString(),
        dateTo: data.dateTo?.toISOString(),
      },
    }
  }

  findReportById(id: string): Promise<Report | null> {
    return this.db.report.findUnique({ where: { id } })
  }

  findOwnedReport(id: string, userId: string): Promise<Report | null> {
    return this.db.report.findFirst({ where: { id, userId } })
  }

  async createReport(data: CreateReportData): Promise<Report> {
    await this.syncUserSnapshot(data.userId)

    return this.db.report.create({
      data: {
        userId: data.userId,
        title: data.title,
        content: data.content,
        feedbackContact: data.feedbackContact ?? null,
        themeId: data.themeId ?? null,
        feedbackType: data.feedbackType,
      },
    })
  }

  async updateReport(id: string, data: UpdateReportData): Promise<Report> {
    if (typeof data.assignedToId === 'string') {
      await this.syncUserSnapshot(data.assignedToId)
    }

    return this.db.report.update({
      where: { id },
      data: {
        ...(data.title === undefined ? {} : { title: data.title }),
        ...(data.content === undefined ? {} : { content: data.content }),
        ...(data.feedbackContact === undefined ? {} : { feedbackContact: data.feedbackContact }),
        ...(data.themeId === undefined ? {} : { themeId: data.themeId }),
        ...(data.status === undefined ? {} : { status: data.status }),
        ...(data.feedbackType === undefined ? {} : { feedbackType: data.feedbackType }),
        ...(data.priority === undefined ? {} : { priority: data.priority }),
        ...(data.assignedToId === undefined ? {} : { assignedToId: data.assignedToId }),
        ...(data.resolvedAt === undefined ? {} : { resolvedAt: data.resolvedAt }),
      },
    })
  }

  async deleteReport(id: string): Promise<void> {
    await this.db.report.delete({ where: { id } })
  }

  async getThemes(data: ThemePaginationData): Promise<ThemeListResult> {
    const where = this.buildThemeWhere(data)
    const total = await this.db.theme.count({ where })
    const params = this.pagination.getPaginationParams(total, data.page, data.limit)
    const themes = await this.db.theme.findMany({
      where,
      orderBy: { name: 'asc' },
      skip: params.skip,
      take: params.limit,
    })

    return {
      themes,
      pagination: {
        page: params.page,
        limit: params.limit,
        total: params.total,
        totalPages: params.totalPages,
        hasNext: params.hasNext,
        hasPrev: params.hasPrev,
        search: data.search,
        parentId: data.parentId,
      },
    }
  }

  findThemeById(id: string): Promise<Theme | null> {
    return this.db.theme.findUnique({ where: { id } })
  }

  findThemeWithChildren(id: string): Promise<ThemeWithChildren | null> {
    return this.db.theme.findUnique({
      where: { id },
      include: { children: { orderBy: { name: 'asc' } } },
    })
  }

  findThemeParentId(id: string): Promise<string | null> {
    return this.db.theme
      .findUnique({ where: { id }, select: { parentId: true } })
      .then((theme) => theme?.parentId ?? null)
  }

  async themeNameExists(name: string, excludeId?: string): Promise<boolean> {
    const theme = await this.db.theme.findFirst({
      where: {
        name,
        ...(excludeId === undefined ? {} : { NOT: { id: excludeId } }),
      },
      select: { id: true },
    })

    return theme !== null
  }

  async themeHasChildren(id: string): Promise<boolean> {
    const child = await this.db.theme.findFirst({
      where: { parentId: id },
      select: { id: true },
    })

    return child !== null
  }

  createTheme(data: CreateThemeData): Promise<Theme> {
    return this.db.theme.create({
      data: {
        name: data.name,
        description: data.description ?? null,
        parentId: data.parentId ?? null,
      },
    })
  }

  updateTheme(id: string, data: UpdateThemeData): Promise<Theme> {
    return this.db.theme.update({
      where: { id },
      data: {
        ...(data.name === undefined ? {} : { name: data.name }),
        ...(data.description === undefined ? {} : { description: data.description }),
        ...(data.parentId === undefined ? {} : { parentId: data.parentId }),
      },
    })
  }

  async deleteTheme(id: string): Promise<void> {
    await this.db.theme.delete({ where: { id } })
  }

  syncUserSnapshot(userId: string): Promise<unknown> {
    return this.db.userSnapshot.upsert({
      where: { userId },
      create: { userId },
      update: {},
    })
  }

  deleteUserSnapshot(userId: string): Promise<unknown> {
    return this.db.userSnapshot.deleteMany({ where: { userId } })
  }

  private buildReportWhere(data: ReportPaginationData): ReportWhereInput {
    const filters: ReportWhereInput[] = []

    if (data.userId !== undefined) {
      filters.push({ userId: data.userId })
    }

    if (data.assignedToId !== undefined) {
      filters.push({ assignedToId: data.assignedToId })
    }

    if (data.themeId !== undefined) {
      filters.push({ themeId: data.themeId })
    }

    if (data.status !== undefined) {
      filters.push({ status: GRPC_TO_REPORT_STATUSES[data.status] as DbReportStatus })
    }

    if (data.feedbackType !== undefined) {
      filters.push({
        feedbackType: GRPC_TO_REPORT_FEEDBACKS[data.feedbackType] as DbReportFeedback,
      })
    }

    if (data.priority !== undefined) {
      filters.push({ priority: GRPC_TO_REPORT_PRIORITIES[data.priority] as DbReportPriority })
    }

    if (data.dateFrom !== undefined || data.dateTo !== undefined) {
      filters.push({
        createdAt: {
          ...(data.dateFrom === undefined ? {} : { gte: data.dateFrom }),
          ...(data.dateTo === undefined ? {} : { lte: data.dateTo }),
        },
      })
    }

    if (data.search) {
      filters.push({
        OR: [
          { title: { contains: data.search, mode: 'insensitive' } },
          { content: { contains: data.search, mode: 'insensitive' } },
        ],
      })
    }

    return filters.length === 0 ? {} : { AND: filters }
  }

  private buildThemeWhere(data: ThemePaginationData): ThemeWhereInput {
    const filters: ThemeWhereInput[] = []

    if (data.parentId !== undefined) {
      filters.push({ parentId: data.parentId })
    }

    if (data.search) {
      filters.push({
        OR: [
          { name: { contains: data.search, mode: 'insensitive' } },
          { description: { contains: data.search, mode: 'insensitive' } },
        ],
      })
    }

    return filters.length === 0 ? {} : { AND: filters }
  }
}
