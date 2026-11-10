import { ref } from 'vue'

import { request } from '../../request.js'
import { useApi } from '../use-api.js'

import type { Pagination, ListQuery } from '../../types/api.type.js'
import type { ClientOutput, PaginatedClientsOutput } from '@org/shared-types'
import type { Ref } from 'vue'

export interface ClientPayload {
  email?: string
  password?: string
  confirmationPassword?: string
  name?: string
  surname?: string
  fatherName?: string
  phoneNumber?: string
  isResident?: boolean
  identifCode?: string
  numPass?: string
  codeWord?: string
  address?: string
}

export interface UseClientsReturn {
  clients: Ref<ClientOutput[]>
  pagination: Ref<Pagination | null>
  loading: Ref<boolean>
  error: Ref<string | null>
  fetchClients: (query?: ListQuery) => Promise<PaginatedClientsOutput | null>
  getClient: (id: string) => Promise<ClientOutput | null>
  createClient: (payload: ClientPayload) => Promise<ClientOutput | null>
  updateClient: (id: string, payload: ClientPayload) => Promise<ClientOutput | null>
  blockClient: (id: string) => Promise<ClientOutput | null>
  unblockClient: (id: string) => Promise<ClientOutput | null>
  resetClientPassword: (id: string, newPassword: string) => Promise<boolean>
  deleteClient: (id: string) => Promise<boolean>
}

export function useClients(): UseClientsReturn {
  const clients = ref<ClientOutput[]>([])
  const pagination = ref<Pagination | null>(null)
  const { loading, error, run } = useApi()

  async function fetchClients(query: ListQuery = {}): Promise<PaginatedClientsOutput | null> {
    const result = await run(() =>
      request<PaginatedClientsOutput>('/user/clientadmin/clients', {
        method: 'QUERY',
        body: { page: 1, limit: 10, ...query },
      }),
    )

    if (result) {
      clients.value = result.clients
      pagination.value = result.pagination
    }

    return result
  }

  async function getClient(id: string): Promise<ClientOutput | null> {
    return run(() => request<ClientOutput>(`/user/clientadmin/clients/${id}`))
  }

  async function createClient(payload: ClientPayload): Promise<ClientOutput | null> {
    return run(() =>
      request<ClientOutput>('/user/clientadmin/clients', { method: 'POST', body: payload }),
    )
  }

  async function updateClient(id: string, payload: ClientPayload): Promise<ClientOutput | null> {
    return run(() =>
      request<ClientOutput>(`/user/clientadmin/clients/${id}`, { method: 'PUT', body: payload }),
    )
  }

  async function blockClient(id: string): Promise<ClientOutput | null> {
    return run(() =>
      request<ClientOutput>(`/user/clientadmin/clients/${id}/block`, { method: 'PATCH' }),
    )
  }

  async function unblockClient(id: string): Promise<ClientOutput | null> {
    return run(() =>
      request<ClientOutput>(`/user/clientadmin/clients/${id}/unblock`, { method: 'PATCH' }),
    )
  }

  async function resetClientPassword(id: string, newPassword: string): Promise<boolean> {
    return (await run(() =>
      request<null>(`/user/clientadmin/clients/${id}/reset-password`, {
        method: 'PATCH',
        body: { newPassword },
      }),
    )) !== null
  }

  async function deleteClient(id: string): Promise<boolean> {
    return (await run(() =>
      request<null>(`/user/clientadmin/clients/${id}`, { method: 'DELETE' }),
    )) !== null
  }

  return {
    clients,
    pagination,
    loading,
    error,
    fetchClients,
    getClient,
    createClient,
    updateClient,
    blockClient,
    unblockClient,
    resetClientPassword,
    deleteClient,
  }
}
