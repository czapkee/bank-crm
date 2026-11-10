<script setup lang="ts">

import { usePayments } from '@org/api-client'
import { Badge, DataTable, Drawer, EmptyState ,
  CARD_STATUS_LABELS,
  PAYMENT_REFERENCE_LABELS,
  PAYMENT_STATUS_LABELS,
  cardStatusTone,
  formatAmount,
  formatCardNumber,
  formatDateTime,
  formatExpire,
  formatMoney,
  labelOf,
  paymentStatusTone,
} from '@org/ui'
import { computed, onMounted } from 'vue'

import type { CardOutput } from '@org/shared-types'

const props = defineProps<{ card: CardOutput }>()
const emit = defineEmits<{ close: [] }>()

const payments = usePayments()
const loading = computed(() => payments.loading.value)

const columns = [
  { key: 'dateAndTime', label: 'дата' },
  { key: 'service', label: 'сервис' },
  { key: 'reference', label: 'назначение' },
  { key: 'sum', label: 'сумма', align: 'right' as const },
  { key: 'status', label: 'статус' },
]

onMounted(async () => {
  await payments.fetchMyCardPayments(props.card.id, { limit: 10 })
})
</script>

<template>
  <Drawer open :title="formatCardNumber(card.cardNumber)" description="Детали карты и последние операции" @close="emit('close')">
    <div class="space-y-6 px-5 py-5">
      <div class="flex flex-wrap items-center gap-2">
        <Badge :tone="cardStatusTone(card.status)" :label="labelOf(CARD_STATUS_LABELS, card.status)" />
        <span class="text-[11px] text-muted">срок действия {{ formatExpire(card.dateOfExpire) }}</span>
      </div>

      <div class="grid grid-cols-2 gap-x-4 gap-y-4 border-y border-line py-4 text-[12px]">
        <div>
          <p class="text-[9px] uppercase tracking-[0.14em] text-muted">номер счета</p>
          <p class="mt-1 font-mono text-[12px] text-ink">{{ card.accountNumber }}</p>
        </div>
        <div>
          <p class="text-[9px] uppercase tracking-[0.14em] text-muted">баланс</p>
          <p class="mt-1 text-[16px] font-semibold tabular-nums text-ink">{{ formatMoney(card.balance) }}</p>
        </div>
        <div>
          <p class="text-[9px] uppercase tracking-[0.14em] text-muted">выпущена</p>
          <p class="mt-1 text-ink">{{ formatDateTime(card.createdAt) }}</p>
        </div>
        <div>
          <p class="text-[9px] uppercase tracking-[0.14em] text-muted">обновлена</p>
          <p class="mt-1 text-ink">{{ formatDateTime(card.updatedAt) }}</p>
        </div>
      </div>

      <div>
        <div class="mb-2 flex items-center justify-between">
          <h3 class="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">последние платежи</h3>
          <RouterLink to="/portal/payments" class="text-[11px] text-ink underline decoration-blush-300 underline-offset-4">
            все платежи
          </RouterLink>
        </div>
        <DataTable
          :columns="columns"
          :rows="payments.payments.value"
          :loading="loading"
          compact
          empty-text="Операций по карте пока нет"
        >
          <template #cell-dateAndTime="{ row }">
            {{ formatDateTime(row.dateAndTime) }}
          </template>
          <template #cell-reference="{ row }">
            {{ labelOf(PAYMENT_REFERENCE_LABELS, row.reference) }}
          </template>
          <template #cell-sum="{ row }">
            <span class="tabular-nums">{{ formatAmount(row.sum) }}</span>
          </template>
          <template #cell-status="{ row }">
            <Badge :tone="paymentStatusTone(row.status)" :label="labelOf(PAYMENT_STATUS_LABELS, row.status)" />
          </template>
        </DataTable>
      </div>

      <EmptyState
        v-if="!loading && payments.payments.value.length === 0"
        icon="wallet"
        title="Операций пока нет"
        description="Здесь появятся списания и переводы по этой карте."
      />
    </div>
  </Drawer>
</template>
