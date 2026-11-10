<script setup lang="ts">

import { useCards } from '@org/api-client'
import { Badge, Button, DataTable, PageHeader, Panel ,
  CARD_STATUS_LABELS,
  cardStatusTone,
  formatCardNumber,
  formatExpire,
  formatMoney,
  labelOf,
} from '@org/ui'
import { computed, onMounted, ref } from 'vue'

import CardDetailDrawer from './components/CardDetailDrawer.vue'

import type { CardOutput } from '@org/shared-types'

const cardsStore = useCards()
const selected = ref<CardOutput | null>(null)

const cards = computed(() => cardsStore.cards.value)
const totalBalance = computed(() => cards.value.reduce((sum, card) => sum + Number(card.balance), 0).toFixed(2))
const activeCount = computed(() => cards.value.filter((card) => card.status === 'AT_CLIENT').length)

const columns = [
  { key: 'cardNumber', label: 'номер карты' },
  { key: 'dateOfExpire', label: 'срок' },
  { key: 'status', label: 'статус' },
  { key: 'accountNumber', label: 'номер счета' },
  { key: 'balance', label: 'баланс', align: 'right' as const },
  { key: 'actions', label: '', width: '110px', align: 'right' as const },
]

onMounted(async () => {
  await cardsStore.fetchMyCards({ limit: 100 })
})

function open(row: Record<string, unknown>): void {
  selected.value = row as unknown as CardOutput
}
</script>

<template>
  <div class="space-y-8">
    <PageHeader eyebrow="личный кабинет" title="Мои карты" description="Все выпущенные карты, срок действия и доступный остаток.">
      <template #actions>
        <RouterLink to="/portal/payments">
          <Button variant="secondary" size="sm">Перейти к платежам</Button>
        </RouterLink>
      </template>
    </PageHeader>

    <div class="grid gap-6 border-b border-line pb-6 sm:grid-cols-3">
      <div>
        <p class="text-[9px] font-medium uppercase tracking-[0.14em] text-muted">всего карт</p>
        <p class="mt-2 text-[28px] font-semibold leading-none tabular-nums text-ink">{{ cards.length }}</p>
      </div>
      <div class="sm:border-l sm:border-line sm:pl-6">
        <p class="text-[9px] font-medium uppercase tracking-[0.14em] text-muted">активные</p>
        <p class="mt-2 text-[28px] font-semibold leading-none tabular-nums text-ink">{{ activeCount }}</p>
      </div>
      <div class="sm:border-l sm:border-line sm:pl-6">
        <p class="text-[9px] font-medium uppercase tracking-[0.14em] text-muted">общий баланс</p>
        <p class="mt-2 text-[28px] font-semibold leading-none tabular-nums text-ink">{{ formatMoney(totalBalance) }}</p>
      </div>
    </div>

    <Panel title="Список карт" description="Нажмите на строку, чтобы посмотреть операции.">
      <DataTable
        :columns="columns"
        :rows="cards"
        :loading="cardsStore.loading.value"
        clickable
        empty-text="Карты пока не выпущены"
        @row-click="open"
      >
        <template #cell-cardNumber="{ row }">
          <span class="whitespace-nowrap font-mono text-[12px] tracking-[-0.02em]">{{ formatCardNumber(row.cardNumber) }}</span>
        </template>
        <template #cell-dateOfExpire="{ row }">
          <span class="font-mono text-[11.5px] text-muted">{{ formatExpire(row.dateOfExpire) }}</span>
        </template>
        <template #cell-status="{ row }">
          <Badge :tone="cardStatusTone(row.status)" :label="labelOf(CARD_STATUS_LABELS, row.status)" />
        </template>
        <template #cell-accountNumber="{ row }">
          <span class="font-mono text-[11.5px] text-muted">{{ row.accountNumber }}</span>
        </template>
        <template #cell-balance="{ row }">
          <span class="tabular-nums">{{ formatMoney(row.balance) }}</span>
        </template>
        <template #cell-actions>
          <button type="button" class="text-[11px] text-muted underline decoration-line underline-offset-4 hover:text-ink" @click.stop="open(row)">
            детали
          </button>
        </template>
      </DataTable>
    </Panel>

    <CardDetailDrawer v-if="selected" :card="selected" @close="selected = null" />
  </div>
</template>
