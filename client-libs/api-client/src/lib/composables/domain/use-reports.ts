import { ref } from 'vue'

import { request } from '../../request.js'
import { useApi } from '../use-api.js'

import type { Pagination, ListQuery } from '../../types/api.type.js'
import type { ReportFeedback, ReportPriority, ReportStatus } from '@org/enums'
import type {
  PaginatedReportsOutput,
  ReportListOutput,
  ReportOutput,
} from '@org/shared-types'
import type { Ref } from 'vue'

export interface ReportPayload {
  title?: string
  content?: string
  feedbackContact?: string
  themeId?: string
  feedbackType?: ReportFeedback
  status?: ReportStatus
  priority?: ReportPriority
  assignedToId?: string
}

export interface UseReportsReturn {
  reports: Ref<ReportListOutput[]>
  pagination: Ref<Pagination | null>
  loading: Ref<boolean>
  error: Ref<string | null>
  fetchMyReports: (query?: ListQuery) => Promise<PaginatedReportsOutput | null>
  fetchReports: (query?: ListQuery) => Promise<PaginatedReportsOutput | null>
  getMyReport: (id: string) => Promise<ReportOutput | null>
  getReport: (id: string) => Promise<ReportOutput | null>
  createReport: (payload: ReportPayload) => Promise<ReportOutput | null>
  updateMyReport: (id: string, payload: ReportPayload) => Promise<ReportOutput | null>
  updateReport: (id: string, payload: ReportPayload) => Promise<ReportOutput | null>
  assignReport: (id: string, assignedToId?: string) => Promise<ReportOutput | null>
  changeReportStatus: (id: string, status: ReportStatus) => Promise<ReportOutput | null>
  resolveReport: (id: string) => Promise<ReportOutput | null>
  deleteMyReport: (id: string) => Promise<boolean>
  deleteReport: (id: string) => Promise<boolean>
}

export function useReports(): UseReportsReturn {
  const reports = ref<ReportListOutput[]>([])
  const pagination = ref<Pagination | null>(null)
  const { loading, error, run } = useApi()

  async function fetchMyReports(query: ListQuery = {}): Promise<PaginatedReportsOutput | null> {
    const result = await run(() =>
      request<PaginatedReportsOutput>('/report/report/my/reports', {
        method: 'QUERY',
        body: { page: 1, limit: 10, ...query },
      }),
    )

    if (result) {
      reports.value = result.reports ?? []
      pagination.value = result.pagination ?? null
    }

    return result
  }

  async function fetchReports(query: ListQuery = {}): Promise<PaginatedReportsOutput | null> {
    const result = await run(() =>
      request<PaginatedReportsOutput>('/report/reportadmin/reports', {
        method: 'QUERY',
        body: { page: 1, limit: 10, ...query },
      }),
    )

    if (result) {
      reports.value = result.reports ?? []
      pagination.value = result.pagination ?? null
    }

    return result
  }

  async function getMyReport(id: string): Promise<ReportOutput | null> {
    return run(() => request<ReportOutput>(`/report/report/my/reports/${id}`))
  }

  async function getReport(id: string): Promise<ReportOutput | null> {
    return run(() => request<ReportOutput>(`/report/reportadmin/reports/${id}`))
  }

  async function createReport(payload: ReportPayload): Promise<ReportOutput | null> {
    return run(() => request<ReportOutput>('/report/report/reports', { method: 'POST', body: payload }))
  }

  async function updateMyReport(id: string, payload: ReportPayload): Promise<ReportOutput | null> {
    return run(() =>
      request<ReportOutput>(`/report/report/my/reports/${id}`, { method: 'PUT', body: payload }),
    )
  }

  async function updateReport(id: string, payload: ReportPayload): Promise<ReportOutput | null> {
    return run(() =>
      request<ReportOutput>(`/report/reportadmin/reports/${id}`, { method: 'PUT', body: payload }),
    )
  }

  async function assignReport(id: string, assignedToId?: string): Promise<ReportOutput | null> {
    return run(() =>
      request<ReportOutput>(`/report/reportadmin/reports/${id}/assign`, {
        method: 'PATCH',
        body: { assignedToId },
      }),
    )
  }

  async function changeReportStatus(id: string, status: ReportStatus): Promise<ReportOutput | null> {
    return run(() =>
      request<ReportOutput>(`/report/reportadmin/reports/${id}/status`, {
        method: 'PATCH',
        body: { status },
      }),
    )
  }

  async function resolveReport(id: string): Promise<ReportOutput | null> {
    return run(() =>
      request<ReportOutput>(`/report/reportadmin/reports/${id}/resolve`, { method: 'PATCH' }),
    )
  }

  async function deleteMyReport(id: string): Promise<boolean> {
    return (await run(() =>
      request<null>(`/report/report/my/reports/${id}`, { method: 'DELETE' }),
    )) !== null
  }

  async function deleteReport(id: string): Promise<boolean> {
    return (await run(() =>
      request<null>(`/report/reportadmin/reports/${id}`, { method: 'DELETE' }),
    )) !== null
  }

  return {
    reports,
    pagination,
    loading,
    error,
    fetchMyReports,
    fetchReports,
    getMyReport,
    getReport,
    createReport,
    updateMyReport,
    updateReport,
    assignReport,
    changeReportStatus,
    resolveReport,
    deleteMyReport,
    deleteReport,
  }
}
