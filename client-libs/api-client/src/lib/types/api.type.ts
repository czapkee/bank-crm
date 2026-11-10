import type { FetchOptions } from 'ofetch'

export interface ApiEnvelope<T> {
  status: 'success' | 'error'
  date?: string
  time?: string
  path?: string
  data: T
  duration?: string
}

export interface Pagination {
  page: number
  limit: number
  search?: string
  total: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

export interface ListQuery {
  page?: number
  limit?: number
  search?: string
  [key: string]: unknown
}

export interface RequestOptions extends FetchOptions<'json'> {
  skipAuthRefresh?: boolean
}
