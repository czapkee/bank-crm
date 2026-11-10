<script setup lang="ts">

import { useCards, usePayments, useToastStore } from '@org/api-client'
import {
  AppIcon,
  Badge,
  Button,
  ConfirmDialog,
  DataTable,
  Input,
  PageHeader,
  Pagination,
  Panel,
  Select,

  PAYMENT_REFERENCE_LABELS,
  PAYMENT_STATUS_LABELS,
  PAYMENT_STATUS_OPTIONS,
  formatAmount,
  formatCardNumber,
  formatDateTime,
  formatMoney,
  labelOf,
  paymentStatusTone} from '@org/ui'
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

import PaymentCreateDialog from './components/PaymentCreateDialog.vue'

import type { ListQuery } from '@org/api-client'
import type { PaymentOutput } from '@org/shared-types'

const route = useRoute()
const store = usePayments()
const cardsStore = useCards()
const toast = useToastStore()

const cardId = ref<string | undefined>(typeof route.query.card === 'string' ? route.query.card : undefined)
const status = ref<string | undefined>(undefined)
const date = ref('')
const createOpen = ref(false)
const selectedId = ref<string | null>(null)
const deleteTarget = ref<PaymentOutput | null>(null)
const acting = ref(false)

const payments = computed(() => store.payments.value)
const cards = computed(() => cardsStore.cards.value)
const selected = computed(() => payments.value.find((payment) => payment.id === selectedId.value) ?? null)

const cardOptions = computed(() =>
  cards.value.map((card) => ({
    value: card.id,
    label: `${formatCardNumber(card.cardNumber)} · ${formatMoney(card.balance)}`,
  })),
)

const columns = [
  { key: 'cardId', label: 'карта' },
  { key: 'sum', label: 'сумма', align: 'right' as const },
  { key: 'dateAndTime', label: 'дата' },
  { key: 'service', label: 'сервис' },
  { key: 'reference', label: 'назначение' },
  { key: 'status', label: 'статус' },
]

onMounted(async () => {
  await Promise.all([cardsStore.fetchCards({ limit: 100 }), load()])
})

function query(page = 1): ListQuery {
  const result: ListQuery = {
    page,
    limit: 10,
    ...(status.value ? { status: status.value } : {}),
  }

  if (date.value) {
    const from = new Date(`${date.value}T00:00:00`)
    const to = new Date(`${date.value}T23:59:59`)
    result.dateFrom = from.toISOString()
    result.dateTo = to.toISOString()
  }

  return result
}

async function load(page = 1): Promise<void> {
  if (cardId.value) {
    await store.fetchCardPayments(cardId.value, query(page))
  } else {
    await store.fetchPayments(query(page))
  }

  selectedId.value = null
}

function cardLabel(id: string): string {
  const card = cards.value.find((item) => item.id === id)
  return card ? formatCardNumber(card.cardNumber) : id.slice(0, 8)
}

async function changeStatus(payment: PaymentOutput, next: string): Promise<void> {
  acting.value = true
  const result = await store.changePaymentStatus(payment.id, next as never)
  acting.value = false

  if (result) {
    toast.success('Статус платежа обновлён')
    await load(store.pagination.value?.page ?? 1)
  } else {
    toast.error(store.error.value ?? 'Не удалось изменить статус')
  }
}

async function confirmDelete(): Promise<void> {
  if (!deleteTarget.value) return
  acting.value = true
  const ok = await store.deletePayment(deleteTarget.value.id)
  acting.value = false

  if (ok) {
    toast.success('Платёж удалён')
    deleteTarget.value = null
    await load()
  } else {
    toast.error(store.error.value ?? 'Не удалось удалить платёж')
  }
}
</script>

<template>
  <div class="space-y-7">
    <PageHeader eyebrow="рабочее место" title="Платежи" description="Операции по картам клиентов: суммы, назначение и статусы.">
      <template #actions>
        <Button size="sm" :disabled="cards.length === 0" @click="createOpen = true">
          <AppIcon name="plus" :size="14" />
          Новый платёж
        </Button>
      </template>
    </PageHeader>

    <div class="flex flex-wrap items-end gap-3 border-y border-line py-4">
      <div class="w-full sm:w-64">
        <Select
          v-model="cardId"
          label="карта"
          :options="cardOptions"
          placeholder="все карты"
          @update:model-value="load(1)"
        />
      </div>
      <div class="w-full sm:w-44">
        <Select
          v-model="status"
          label="статус"
          :options="[{ value: '', label: 'все' }, ...PAYMENT_STATUS_OPTIONS]"
          @update:model-value="load(1)"
        />
      </div>
      <div class="w-full sm:w-40">
        <Input v-model="date" label="дата" type="date" />
      </div>
      <Button variant="secondary" size="sm" @click="load(1)">Применить</Button>
      <p v-if="store.error.value" class="text-[11px] text-danger">{{ store.error.value }}</p>
    </div>

    <Panel>
      <DataTable
        :columns="columns"
        :rows="payments"
        :loading="store.loading.value"
        :selected-key="selectedId"
        clickable
        empty-text="Платежи не найдены"
        @row-click="(row) => (selectedId = String(row.id))"
      >
        <template #cell-cardId="{ row }">
          <span class="font-mono text-[11px] text-muted">{{ cardLabel(row.cardId) }}</span>
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
      <Pagination :pagination="store.pagination.value" @change="load" />
    </Panel>

    <section v-if="selected" class="flex flex-wrap items-center justify-between gap-4 border border-line bg-surface px-4 py-4">
      <div class="flex flex-wrap items-center gap-6 text-[12px]">
        <div>
          <p class="text-[9px] uppercase tracking-[0.14em] text-muted">платёж</p>
          <p class="mt-1 font-mono text-[11px] text-ink">№ {{ selected.id.slice(0, 8) }}</p>
        </div>
        <div>
          <p class="text-[9px] uppercase tracking-[0.14em] text-muted">сумма</p>
          <p class="mt-1 font-medium tabular-nums text-ink">{{ formatMoney(selected.sum) }}</p>
        </div>
        <div>
          <p class="text-[9px] uppercase tracking-[0.14em] text-muted">сервис</p>
          <p class="mt-1 text-ink">{{ selected.service }}</p>
        </div>
      </div>

      <div class="flex flex-wrap items-center gap-2">
        <div class="w-52">
          <Select
            :model-value="selected.status"
            :options="PAYMENT_STATUS_OPTIONS"
            @update:model-value="(value) => selected && changeStatus(selected, String(value))"
          />
        </div>
        <Button variant="ghost" size="sm" @click="deleteTarget = selected">Удалить</Button>
        <Button variant="secondary" size="sm" @click="selectedId = null">Снять выбор</Button>
      </div>
    </section>

    <PaymentCreateDialog
      v-if="createOpen"
      :card-id="cardId"
      @close="createOpen = false"
      @created="load(1)"
    />

    <ConfirmDialog
      :open="deleteTarget !== null"
      title="Удалить платёж?"
      message="Операция будет удалена из истории платежей."
      confirm-label="Удалить"
      :loading="acting"
      @cancel="deleteTarget = null"
      @confirm="confirmDelete"
    />
  </div>
</template>
