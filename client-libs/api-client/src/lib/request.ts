import { ofetch } from 'ofetch'

import { getApiHooks } from './api-hooks.js'
import { isFetchError } from './utils/is-fetch-error.js'

import type { ApiEnvelope, RequestOptions } from './types/api.type.js'

export const API_URL = import.meta.env.VITE_API_URL ?? '/api'

const client = ofetch.create({
  baseURL: API_URL,
  credentials: 'include',
  timeout: 20000,
  responseType: 'json',

  onRequest({ options }) {
    const token = getApiHooks().getAccessToken?.()

    if (token) {
      const headers = new Headers(options.headers as HeadersInit | undefined)
      headers.set('Authorization', `Bearer ${token}`)
      options.headers = headers
    }
  },

  onResponse({ response }) {
    const body = response._data as ApiEnvelope<unknown> | undefined

    if (body && typeof body === 'object' && 'data' in body && 'status' in body) {
      response._data = body.data
    }
  },
})

const isUnauthorized = (error: unknown): boolean => isFetchError(error) && error.response?.status === 401

async function send<T>(path: string, options: RequestOptions): Promise<T> {
  return client<T>(path, options)
}

export async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { skipAuthRefresh, ...fetchOptions } = options

  try {
    return await send<T>(path, fetchOptions)
  } catch (error) {
    if (skipAuthRefresh || !isUnauthorized(error)) {
      throw error
    }

    const onUnauthorized = getApiHooks().onUnauthorized

    if (!onUnauthorized || !(await onUnauthorized())) {
      throw error
    }

    return await send<T>(path, fetchOptions)
  }
}
