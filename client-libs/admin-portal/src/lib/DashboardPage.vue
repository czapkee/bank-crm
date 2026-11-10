<script setup lang="ts">

import { useDashboard } from '@org/api-client'
import { Badge, DataTable, PageHeader, Panel ,
  CARD_STATUS_LABELS,
  cardStatusTone,
  formatCardNumber,
  formatCount,
  formatDate,
  formatExpire,
  formatMoney,
  labelOf,
} from '@org/ui'
import { computed, onMounted } from 'vue'

const store = useDashboard()

const statCards = computed(() => [
  { label: 'клиенты', value: formatCount(store.stats.value.clients), hint: 'всего в системе' },
  { label: 'карты', value: formatCount(store.stats.value.cards), hint: 'выпущено' },
  { label: 'платежи', value: formatCount(store.stats.value.payments), hint: 'операций' },
  { label: 'обращения', value: formatCount(store.stats.value.reports), hint: 'зарегистрировано' },
  { label: 'журнал', value: formatCount(store.stats.value.logs), hint: 'записей' },
])

const columns = [
  { key: 'cardNumber', label: 'карта' },
  { key: 'dateOfExpire', label: 'срок' },
  { key: 'status', label: 'статус' },
  { key: 'balance', label: 'баланс', align: 'right' as const },
  { key: 'createdAt', label: 'выпущена', align: 'right' as const },
]

onMounted(() => store.fetchStats())
</script>

<template>
  <div class="space-y-8">
    <PageHeader
      eyebrow="рабочее место"
      title="Обзор"
      description="Сводка по клиентам, картам, платежам и обращениям. Данные обновляются по запросу."
    />

    <section class="grid grid-cols-2 gap-y-6 border-y border-line py-6 sm:grid-cols-3 lg:grid-cols-5">
      <div
        v-for="(item, index) in statCards"
        :key="item.label"
        :class="['px-4 first:pl-0', index > 0 ? 'border-l border-line' : '']"
      >
        <p class="text-[9px] font-medium uppercase tracking-[0.16em] text-muted">{{ item.label }}</p>
        <p class="mt-2 text-[30px] font-semibold leading-none tracking-[-0.03em] tabular-nums text-ink">
          {{ item.value }}
        </p>
        <p class="mt-1.5 text-[10.5px] text-muted">{{ item.hint }}</p>
      </div>
    </section>

    <div class="grid gap-8 xl:grid-cols-[minmax(0,1.6fr)_minmax(280px,0.8fr)]">
      <Panel title="Последние карты" description="Портфель карт, выпущенных в системе.">
        <template #actions>
          <RouterLink to="/admin/cards" class="text-[11px] text-muted underline decoration-line underline-offset-4 hover:text-ink">
            все карты
          </RouterLink>
        </template>
        <DataTable
          :columns="columns"
          :rows="store.cardSample.value"
          :loading="store.loading.value"
          compact
          empty-text="Карты не выпущены"
        >
          <template #cell-cardNumber="{ row }">
            <span class="font-mono text-[11.5px]">{{ formatCardNumber(row.cardNumber) }}</span>
          </template>
          <template #cell-dateOfExpire="{ row }">
            <span class="font-mono text-[11px] text-muted">{{ formatExpire(row.dateOfExpire) }}</span>
          </template>
          <template #cell-status="{ row }">
            <Badge :tone="cardStatusTone(row.status)" :label="labelOf(CARD_STATUS_LABELS, row.status)" />
          </template>
          <template #cell-balance="{ row }">
            <span class="tabular-nums">{{ formatMoney(row.balance) }}</span>
          </template>
          <template #cell-createdAt="{ row }">
            <span class="whitespace-nowrap text-[11px] text-muted">{{ formatDate(row.createdAt) }}</span>
          </template>
        </DataTable>
      </Panel>

      <aside class="space-y-6">
        <section class="border border-line bg-[#f9e8e6] p-5">
          <p class="text-[10px] font-semibold uppercase tracking-[0.16em] text-ink/45">рабочий день</p>
          <h2 class="mt-2 text-[17px] font-semibold leading-snug tracking-[-0.02em] text-ink">
            Проверьте обращения и журнал операций
          </h2>
          <p class="mt-2 text-[12px] leading-5 text-ink/55">
            Новые обращения требуют назначения ответственного. Журнал фиксирует действия сотрудников.
          </p>
          <div class="mt-4 flex flex-wrap gap-2">
            <RouterLink to="/admin/reports" class="text-[11.5px] font-medium text-ink underline decoration-ink/30 underline-offset-4 hover:decoration-ink">
              обращения
            </RouterLink>
            <span class="text-ink/25">/</span>
            <RouterLink to="/admin/logs" class="text-[11.5px] font-medium text-ink underline decoration-ink/30 underline-offset-4 hover:decoration-ink">
              журнал
            </RouterLink>
          </div>
        </section>

        <Panel title="Покрытие данных">
          <dl class="divide-y divide-line">
            <div class="flex items-center justify-between gap-3 px-4 py-3">
              <dt class="text-[11.5px] text-muted">карты в портфеле</dt>
              <dd class="tabular-nums text-[12px] font-medium text-ink">{{ formatCount(store.stats.value.cards) }}</dd>
            </div>
            <div class="flex items-center justify-between gap-3 px-4 py-3">
              <dt class="text-[11.5px] text-muted">операции по картам</dt>
              <dd class="tabular-nums text-[12px] font-medium text-ink">{{ formatCount(store.stats.value.payments) }}</dd>
            </div>
            <div class="flex items-center justify-between gap-3 px-4 py-3">
              <dt class="text-[11.5px] text-muted">записи журнала</dt>
              <dd class="tabular-nums text-[12px] font-medium text-ink">{{ formatCount(store.stats.value.logs) }}</dd>
            </div>
          </dl>
        </Panel>

        <p v-if="store.error.value" class="text-[11.5px] text-danger">{{ store.error.value }}</p>
      </aside>
    </div>
  </div>
</template>
