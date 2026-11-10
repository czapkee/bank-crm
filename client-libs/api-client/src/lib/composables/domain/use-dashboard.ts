import { ref } from 'vue'

import { request } from '../../request.js'
import { useApi } from '../use-api.js'

import type { CardOutput } from '@org/shared-types'
import type { Ref } from 'vue'

interface PageResult {
  pagination?: { total?: number }
}

export interface DashboardStats {
  clients: number | null
  cards: number | null
  payments: number | null
  reports: number | null
  logs: number | null
}

async function total(path: string): Promise<number | null> {
  try {
    const result = await request<PageResult>(path, {
      method: 'QUERY',
      body: { page: 1, limit: 1 },
    })
    return result.pagination?.total ?? null
  } catch {
    return null
  }
}

export interface UseDashboardReturn {
  stats: Ref<DashboardStats>
  cardSample: Ref<CardOutput[]>
  loading: Ref<boolean>
  error: Ref<string | null>
  fetchStats: () => Promise<void>
}

export function useDashboard(): UseDashboardReturn {
  const stats = ref<DashboardStats>({
    clients: null,
    cards: null,
    payments: null,
    reports: null,
    logs: null,
  })
  const cardSample = ref<CardOutput[]>([])
  const { loading, error, run } = useApi()

  async function fetchStats(): Promise<void> {
    await run(async () => {
      const [clients, cards, payments, reports, logs] = await Promise.all([
        total('/user/clientadmin/clients'),
        total('/card/cardadmin/cards'),
        total('/card/paymentadmin/payments'),
        total('/report/reportadmin/reports'),
        total('/log/log/logs'),
      ])

      stats.value = { clients, cards, payments, reports, logs }

      try {
        const cardsPage = await request<{ cards: CardOutput[] }>('/card/cardadmin/cards', {
          method: 'QUERY',
          body: { page: 1, limit: 100 },
        })
        cardSample.value = cardsPage.cards
      } catch {
        cardSample.value = []
      }

      return true
    })
  }

  return { stats, cardSample, loading, error, fetchStats }
}
