import { ref } from 'vue'

import { request } from '../../request.js'
import { useApi } from '../use-api.js'

import type { Pagination, ListQuery } from '../../types/api.type.js'
import type { LogOutput, PaginatedLogsOutput } from '@org/shared-types'
import type { Ref } from 'vue'

export interface UseLogsReturn {
  logs: Ref<LogOutput[]>
  pagination: Ref<Pagination | null>
  loading: Ref<boolean>
  error: Ref<string | null>
  fetchLogs: (query?: ListQuery) => Promise<PaginatedLogsOutput | null>
  fetchUserLogs: (userId: string, query?: ListQuery) => Promise<PaginatedLogsOutput | null>
  getLog: (id: string) => Promise<LogOutput | null>
}

export function useLogs(): UseLogsReturn {
  const logs = ref<LogOutput[]>([])
  const pagination = ref<Pagination | null>(null)
  const { loading, error, run } = useApi()

  async function fetchLogs(query: ListQuery = {}): Promise<PaginatedLogsOutput | null> {
    const result = await run(() =>
      request<PaginatedLogsOutput>('/log/log/logs', {
        method: 'QUERY',
        body: { page: 1, limit: 20, ...query },
      }),
    )

    if (result) {
      logs.value = result.logs ?? []
      pagination.value = result.pagination ?? null
    }

    return result
  }

  async function fetchUserLogs(userId: string, query: ListQuery = {}): Promise<PaginatedLogsOutput | null> {
    const result = await run(() =>
      request<PaginatedLogsOutput>(`/log/log/users/${userId}/logs`, {
        method: 'QUERY',
        body: { page: 1, limit: 20, ...query },
      }),
    )

    if (result) {
      logs.value = result.logs ?? []
      pagination.value = result.pagination ?? null
    }

    return result
  }

  async function getLog(id: string): Promise<LogOutput | null> {
    return run(() => request<LogOutput>(`/log/log/logs/${id}`))
  }

  return {
    logs,
    pagination,
    loading,
    error,
    fetchLogs,
    fetchUserLogs,
    getLog,
  }
}
