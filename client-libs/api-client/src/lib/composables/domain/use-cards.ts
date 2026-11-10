import { ref } from 'vue'

import { request } from '../../request.js'
import { useApi } from '../use-api.js'

import type { Pagination, ListQuery } from '../../types/api.type.js'
import type { CardStatuses } from '@org/enums'
import type { CardOutput, PaginatedCardsOutput } from '@org/shared-types'
import type { Ref } from 'vue'

export interface CardPayload {
  cardNumber?: string
  accountNumber?: string
  dateOfExpire?: string
  balance?: string
  status?: CardStatuses
  userId?: string
}

export interface UseCardsReturn {
  cards: Ref<CardOutput[]>
  pagination: Ref<Pagination | null>
  loading: Ref<boolean>
  error: Ref<string | null>
  fetchMyCards: (query?: ListQuery) => Promise<PaginatedCardsOutput | null>
  fetchCards: (query?: ListQuery) => Promise<PaginatedCardsOutput | null>
  fetchUserCards: (userId: string, query?: ListQuery) => Promise<PaginatedCardsOutput | null>
  getCard: (id: string) => Promise<CardOutput | null>
  getMyCard: (id: string) => Promise<CardOutput | null>
  createCard: (payload: CardPayload) => Promise<CardOutput | null>
  updateCard: (id: string, payload: CardPayload) => Promise<CardOutput | null>
  changeCardStatus: (id: string, status: CardStatuses) => Promise<CardOutput | null>
  blockCard: (id: string) => Promise<CardOutput | null>
  unblockCard: (id: string) => Promise<CardOutput | null>
  deleteCard: (id: string) => Promise<boolean>
}

export function useCards(): UseCardsReturn {
  const cards = ref<CardOutput[]>([])
  const pagination = ref<Pagination | null>(null)
  const { loading, error, run } = useApi()

  async function fetchMyCards(query: ListQuery = {}): Promise<PaginatedCardsOutput | null> {
    const result = await run(() =>
      request<PaginatedCardsOutput>('/card/card/my', {
        method: 'QUERY',
        body: { page: 1, limit: 20, ...query },
      }),
    )

    if (result) {
      cards.value = result.cards ?? []
      pagination.value = result.pagination ?? null
    }

    return result
  }

  async function fetchCards(query: ListQuery = {}): Promise<PaginatedCardsOutput | null> {
    const result = await run(() =>
      request<PaginatedCardsOutput>('/card/cardadmin/cards', {
        method: 'QUERY',
        body: { page: 1, limit: 10, ...query },
      }),
    )

    if (result) {
      cards.value = result.cards ?? []
      pagination.value = result.pagination ?? null
    }

    return result
  }

  async function fetchUserCards(userId: string, query: ListQuery = {}): Promise<PaginatedCardsOutput | null> {
    return run(() =>
      request<PaginatedCardsOutput>(`/card/cardadmin/users/${userId}/cards`, {
        method: 'QUERY',
        body: { page: 1, limit: 20, ...query },
      }),
    )
  }

  async function getCard(id: string): Promise<CardOutput | null> {
    return run(() => request<CardOutput>(`/card/cardadmin/cards/${id}`))
  }

  async function getMyCard(id: string): Promise<CardOutput | null> {
    return run(() => request<CardOutput>(`/card/card/my/${id}`))
  }

  async function createCard(payload: CardPayload): Promise<CardOutput | null> {
    return run(() => request<CardOutput>('/card/cardadmin/cards', { method: 'POST', body: payload }))
  }

  async function updateCard(id: string, payload: CardPayload): Promise<CardOutput | null> {
    return run(() =>
      request<CardOutput>(`/card/cardadmin/cards/${id}`, { method: 'PUT', body: payload }),
    )
  }

  async function changeCardStatus(id: string, status: CardStatuses): Promise<CardOutput | null> {
    return run(() =>
      request<CardOutput>(`/card/cardadmin/cards/${id}/status`, {
        method: 'PATCH',
        body: { status },
      }),
    )
  }

  async function blockCard(id: string): Promise<CardOutput | null> {
    return run(() => request<CardOutput>(`/card/cardadmin/cards/${id}/block`, { method: 'PATCH' }))
  }

  async function unblockCard(id: string): Promise<CardOutput | null> {
    return run(() => request<CardOutput>(`/card/cardadmin/cards/${id}/unblock`, { method: 'PATCH' }))
  }

  async function deleteCard(id: string): Promise<boolean> {
    return (await run(() =>
      request<null>(`/card/cardadmin/cards/${id}`, { method: 'DELETE' }),
    )) !== null
  }

  return {
    cards,
    pagination,
    loading,
    error,
    fetchMyCards,
    fetchCards,
    fetchUserCards,
    getCard,
    getMyCard,
    createCard,
    updateCard,
    changeCardStatus,
    blockCard,
    unblockCard,
    deleteCard,
  }
}
