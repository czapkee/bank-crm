<script setup lang="ts">

import { useCards, usePayments } from '@org/api-client'
import { AppIcon, Badge, Button, DataTable, Input, PageHeader, Pagination, Panel, Select ,
  PAYMENT_REFERENCE_LABELS,
  PAYMENT_STATUS_LABELS,
  formatAmount,
  formatDateTime,
  formatMoney,
  labelOf,
  paymentStatusTone,
} from '@org/ui'
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

import PaymentFormDialog from './components/PaymentFormDialog.vue'

import type { ListQuery } from '@org/api-client'

const route = useRoute()
const cardsStore = useCards()
const paymentsStore = usePayments()

const cardId = ref<string | undefined>(typeof route.query.card === 'string' ? route.query.card : undefined)
const date = ref('')
const selectedId = ref<string | null>(null)
const formOpen = ref(false)

const cards = computed(() => cardsStore.cards.value)
const payments = computed(() => paymentsStore.payments.value)

const cardOptions = computed(() =>
  cards.value.map((card) => ({
    value: card.id,
    label: `${card.cardNumber} · ${formatMoney(card.balance)}`,
  })),
)

const selectedPayment = computed(() => payments.value.find((payment) => payment.id === selectedId.value) ?? null)
const currentCard = computed(
  () => cards.value.find((card) => card.id === (selectedPayment.value?.cardId ?? cardId.value)) ?? null,
)

const columns = [
  { key: 'accountNumber', label: 'номер счета' },
  { key: 'sum', label: 'сумма', align: 'right' as const },
  { key: 'dateAndTime', label: 'дата' },
  { key: 'service', label: 'сервис' },
  { key: 'reference', label: 'назначение платежа' },
  { key: 'status', label: 'статус' },
]

onMounted(async () => {
  await cardsStore.fetchMyCards({ limit: 100 })
  await load()
})

function queryFor(page: number): ListQuery {
  const query: ListQuery = { page, limit: 12 }

  if (date.value) {
    const from = new Date(`${date.value}T00:00:00`)
    const to = new Date(`${date.value}T23:59:59`)
    query.dateFrom = from.toISOString()
    query.dateTo = to.toISOString()
  }

  return query
}

async function load(page = 1): Promise<void> {
  const query = queryFor(page)

  if (cardId.value) {
    await paymentsStore.fetchMyCardPayments(cardId.value, query)
  } else {
    await paymentsStore.fetchMyPayments(query)
  }

  selectedId.value = null
}

async function applyFilters(): Promise<void> {
  await load(1)
}

function accountFor(paymentCardId: string): string {
  return cards.value.find((card) => card.id === paymentCardId)?.accountNumber ?? '—'
}

function selectRow(row: Record<string, unknown>): void {
  selectedId.value = String(row.id)
}

async function onCreated(): Promise<void> {
  await Promise.all([load(1), cardsStore.fetchMyCards({ limit: 100 })])
}
</script>

<template>
  <div class="space-y-8">
    <PageHeader eyebrow="личный кабинет" title="Платежи" description="История операций по картам и списания за выбранный период.">
      <template #actions>
        <Button size="sm" :disabled="cards.length === 0" @click="formOpen = true">
          <AppIcon name="plus" :size="14" />
          Новый платёж
        </Button>
      </template>
    </PageHeader>

    <div class="flex flex-wrap items-end gap-4 border-y border-line py-4">
      <div class="w-full sm:w-72">
        <Select
          v-model="cardId"
          label="номер карты"
          :options="cardOptions"
          placeholder="все карты"
          @update:model-value="applyFilters"
        />
      </div>
      <div class="w-full sm:w-44">
        <Input v-model="date" label="дата" type="date" />
      </div>
      <Button variant="secondary" size="sm" @click="applyFilters">Применить</Button>
      <p v-if="cardsStore.error.value" class="text-[11px] text-danger">{{ cardsStore.error.value }}</p>
    </div>

    <Panel>
      <DataTable
        :columns="columns"
        :rows="payments"
        :loading="paymentsStore.loading.value"
        :selected-key="selectedId"
        clickable
        empty-text="Операций за выбранный период нет"
        @row-click="selectRow"
      >
        <template #cell-accountNumber="{ row }">
          <span class="font-mono text-[11.5px] text-muted">{{ accountFor(row.cardId) }}</span>
        </template>
        <template #cell-sum="{ row }">
          <span class="tabular-nums">{{ formatAmount(row.sum) }}</span>
        </template>
        <template #cell-dateAndTime="{ row }">
          <span class="whitespace-nowrap text-[11.5px]">{{ formatDateTime(row.dateAndTime) }}</span>
        </template>
        <template #cell-reference="{ row }">
          {{ labelOf(PAYMENT_REFERENCE_LABELS, row.reference) }}
        </template>
        <template #cell-status="{ row }">
          <Badge :tone="paymentStatusTone(row.status)" :label="labelOf(PAYMENT_STATUS_LABELS, row.status)" />
        </template>
      </DataTable>

      <div v-if="selectedPayment" class="border-t border-line bg-[#fbeeec] px-4 py-3">
        <div class="grid gap-3 text-[11.5px] sm:grid-cols-3">
          <div>
            <p class="text-[9px] uppercase tracking-[0.12em] text-ink/45">сумма операции</p>
            <p class="mt-1 font-medium tabular-nums text-ink">
              {{ selectedPayment ? formatMoney(selectedPayment.sum) : '—' }}
            </p>
          </div>
          <div class="sm:border-l sm:border-ink/10 sm:pl-4">
            <p class="text-[9px] uppercase tracking-[0.12em] text-ink/45">остаток по карте</p>
            <p class="mt-1 font-medium tabular-nums text-ink">
              {{ currentCard ? formatMoney(currentCard.balance) : '—' }}
            </p>
          </div>
          <div class="sm:border-l sm:border-ink/10 sm:pl-4">
            <p class="text-[9px] uppercase tracking-[0.12em] text-ink/45">статус</p>
            <p class="mt-1 font-medium text-ink">
              {{ selectedPayment ? labelOf(PAYMENT_STATUS_LABELS, selectedPayment.status) : 'выберите платёж' }}
            </p>
          </div>
        </div>
      </div>

      <Pagination :pagination="paymentsStore.pagination.value" @change="load" />
    </Panel>

    <p v-if="paymentsStore.error.value" class="text-[12px] text-danger">{{ paymentsStore.error.value }}</p>

    <PaymentFormDialog
      v-if="formOpen"
      :cards="cards"
      :default-card-id="cardId"
      @close="formOpen = false"
      @created="onCreated"
    />
  </div>
</template>
