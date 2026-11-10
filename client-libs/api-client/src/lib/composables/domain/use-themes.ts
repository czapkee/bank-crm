import { ref } from 'vue'

import { request } from '../../request.js'
import { useApi } from '../use-api.js'

import type { Pagination, ListQuery } from '../../types/api.type.js'
import type { PaginatedThemesOutput, ThemeDetailedOutput, ThemeOutput } from '@org/shared-types'
import type { Ref } from 'vue'

export interface ThemePayload {
  name?: string
  description?: string
  parentId?: string
}

export interface UseThemesReturn {
  themes: Ref<ThemeOutput[]>
  pagination: Ref<Pagination | null>
  loading: Ref<boolean>
  error: Ref<string | null>
  fetchThemes: (query?: ListQuery) => Promise<PaginatedThemesOutput | null>
  fetchAdminThemes: (query?: ListQuery) => Promise<PaginatedThemesOutput | null>
  getTheme: (id: string) => Promise<ThemeDetailedOutput | null>
  createTheme: (payload: ThemePayload) => Promise<ThemeOutput | null>
  updateTheme: (id: string, payload: ThemePayload) => Promise<ThemeOutput | null>
  deleteTheme: (id: string) => Promise<boolean>
}

export function useThemes(): UseThemesReturn {
  const themes = ref<ThemeOutput[]>([])
  const pagination = ref<Pagination | null>(null)
  const { loading, error, run } = useApi()

  async function fetchThemes(query: ListQuery = {}): Promise<PaginatedThemesOutput | null> {
    const result = await run(() =>
      request<PaginatedThemesOutput>('/report/theme/themes', {
        method: 'QUERY',
        body: { page: 1, limit: 100, ...query },
      }),
    )

    if (result) {
      themes.value = result.themes
      pagination.value = result.pagination
    }

    return result
  }

  async function fetchAdminThemes(query: ListQuery = {}): Promise<PaginatedThemesOutput | null> {
    const result = await run(() =>
      request<PaginatedThemesOutput>('/report/themeadmin/themes', {
        method: 'QUERY',
        body: { page: 1, limit: 100, ...query },
      }),
    )

    if (result) {
      themes.value = result.themes
      pagination.value = result.pagination
    }

    return result
  }

  async function getTheme(id: string): Promise<ThemeDetailedOutput | null> {
    return run(() => request<ThemeDetailedOutput>(`/report/theme/themes/${id}`))
  }

  async function createTheme(payload: ThemePayload): Promise<ThemeOutput | null> {
    return run(() => request<ThemeOutput>('/report/themeadmin/themes', { method: 'POST', body: payload }))
  }

  async function updateTheme(id: string, payload: ThemePayload): Promise<ThemeOutput | null> {
    return run(() =>
      request<ThemeOutput>(`/report/themeadmin/themes/${id}`, { method: 'PUT', body: payload }),
    )
  }

  async function deleteTheme(id: string): Promise<boolean> {
    return (await run(() =>
      request<null>(`/report/themeadmin/themes/${id}`, { method: 'DELETE' }),
    )) !== null
  }

  return {
    themes,
    pagination,
    loading,
    error,
    fetchThemes,
    fetchAdminThemes,
    getTheme,
    createTheme,
    updateTheme,
    deleteTheme,
  }
}
