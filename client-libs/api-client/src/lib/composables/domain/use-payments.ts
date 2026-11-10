import { ref } from 'vue'

import { request } from '../../request.js'
import { useApi } from '../use-api.js'

import type { Pagination, ListQuery } from '../../types/api.type.js'
import type { CardPaymentStatus, PaymentReference } from '@org/enums'
import type { PaymentOutput, PaginatedPaymentsOutput } from '@org/shared-types'
import type { Ref } from 'vue'

export interface PaymentPayload {
  sum: string
  dateAndTime?: string
  service: string
  reference: PaymentReference
  status?: CardPaymentStatus
}

export interface UsePaymentsReturn {
  payments: Ref<PaymentOutput[]>
  pagination: Ref<Pagination | null>
  loading: Ref<boolean>
  error: Ref<string | null>
  fetchMyPayments: (query?: ListQuery) => Promise<PaginatedPaymentsOutput | null>
  fetchMyCardPayments: (cardId: string, query?: ListQuery) => Promise<PaginatedPaymentsOutput | null>
  fetchPayments: (query?: ListQuery) => Promise<PaginatedPaymentsOutput | null>
  fetchCardPayments: (cardId: string, query?: ListQuery) => Promise<PaginatedPaymentsOutput | null>
  getPayment: (id: string) => Promise<PaymentOutput | null>
  writeOff: (cardId: string, payload: Omit<PaymentPayload, 'dateAndTime' | 'status'>) => Promise<PaymentOutput | null>
  createPayment: (cardId: string, payload: PaymentPayload) => Promise<PaymentOutput | null>
  changePaymentStatus: (id: string, status: CardPaymentStatus) => Promise<PaymentOutput | null>
  deletePayment: (id: string) => Promise<boolean>
}

export function usePayments(): UsePaymentsReturn {
  const payments = ref<PaymentOutput[]>([])
  const pagination = ref<Pagination | null>(null)
  const { loading, error, run } = useApi()

  async function fetchMyPayments(query: ListQuery = {}): Promise<PaginatedPaymentsOutput | null> {
    const result = await run(() =>
      request<PaginatedPaymentsOutput>('/card/payment/my', {
        method: 'QUERY',
        body: { page: 1, limit: 10, ...query },
      }),
    )

    if (result) {
      payments.value = result.payments
      pagination.value = result.pagination
    }

    return result
  }

  async function fetchMyCardPayments(cardId: string, query: ListQuery = {}): Promise<PaginatedPaymentsOutput | null> {
    const result = await run(() =>
      request<PaginatedPaymentsOutput>(`/card/payment/my/${cardId}`, {
        method: 'QUERY',
        body: { page: 1, limit: 10, ...query },
      }),
    )

    if (result) {
      payments.value = result.payments
      pagination.value = result.pagination
    }

    return result
  }

  async function fetchPayments(query: ListQuery = {}): Promise<PaginatedPaymentsOutput | null> {
    const result = await run(() =>
      request<PaginatedPaymentsOutput>('/card/paymentadmin/payments', {
        method: 'QUERY',
        body: { page: 1, limit: 10, ...query },
      }),
    )

    if (result) {
      payments.value = result.payments
      pagination.value = result.pagination
    }

    return result
  }

  async function fetchCardPayments(cardId: string, query: ListQuery = {}): Promise<PaginatedPaymentsOutput | null> {
    const result = await run(() =>
      request<PaginatedPaymentsOutput>(`/card/paymentadmin/cards/${cardId}/payments`, {
        method: 'QUERY',
        body: { page: 1, limit: 10, ...query },
      }),
    )

    if (result) {
      payments.value = result.payments
      pagination.value = result.pagination
    }

    return result
  }

  async function getPayment(id: string): Promise<PaymentOutput | null> {
    return run(() => request<PaymentOutput>(`/card/paymentadmin/payments/${id}`))
  }

  async function writeOff(cardId: string, payload: Omit<PaymentPayload, 'dateAndTime' | 'status'>): Promise<PaymentOutput | null> {
    return run(() =>
      request<PaymentOutput>(`/card/payment/cards/${cardId}/write-off`, {
        method: 'POST',
        body: payload,
      }),
    )
  }

  async function createPayment(cardId: string, payload: PaymentPayload): Promise<PaymentOutput | null> {
    return run(() =>
      request<PaymentOutput>(`/card/paymentadmin/cards/${cardId}/payments`, {
        method: 'POST',
        body: payload,
      }),
    )
  }

  async function changePaymentStatus(id: string, status: CardPaymentStatus): Promise<PaymentOutput | null> {
    return run(() =>
      request<PaymentOutput>(`/card/paymentadmin/payments/${id}/status`, {
        method: 'PATCH',
        body: { status },
      }),
    )
  }

  async function deletePayment(id: string): Promise<boolean> {
    return (await run(() =>
      request<null>(`/card/paymentadmin/payments/${id}`, { method: 'DELETE' }),
    )) !== null
  }

  return {
    payments,
    pagination,
    loading,
    error,
    fetchMyPayments,
    fetchMyCardPayments,
    fetchPayments,
    fetchCardPayments,
    getPayment,
    writeOff,
    createPayment,
    changePaymentStatus,
    deletePayment,
  }
}
