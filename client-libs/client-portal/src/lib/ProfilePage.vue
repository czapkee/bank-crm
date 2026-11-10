<script setup lang="ts">

import { useAuthStore, useCards, useReports } from '@org/api-client'
import { AppIcon, Badge, Button, DataTable, PageHeader, Panel ,
  CARD_STATUS_LABELS,
  REPORT_STATUS_LABELS,
  cardStatusTone,
  formatCardNumber,
  formatDate,
  formatDateTime,
  formatExpire,
  formatMoney,
  labelOf,
  reportStatusTone,
} from '@org/ui'
import { computed, onMounted, ref } from 'vue'

import CardDetailDrawer from './components/CardDetailDrawer.vue'
import ProfileDialog from './components/ProfileDialog.vue'
import ReportFormDialog from './components/ReportFormDialog.vue'

import type { CardOutput } from '@org/shared-types'

const auth = useAuthStore()
const cardsStore = useCards()
const reportsStore = useReports()

const editOpen = ref(false)
const reportOpen = ref(false)
const selectedCard = ref<CardOutput | null>(null)

const profile = computed(() => auth.profile)
const fullName = computed(() => auth.displayName || 'Профиль клиента')

const info = computed(() => [
  { label: 'кодовое слово', value: profile.value?.codeWord || '—' },
  { label: 'номер паспорта', value: profile.value?.numPass || '—' },
  { label: 'идентификационный номер', value: profile.value?.identifCode || '—' },
  { label: 'адрес регистрации', value: profile.value?.address || '—' },
  { label: 'телефон', value: profile.value?.phoneNumber || '—' },
  { label: 'email', value: profile.value?.email ?? '—' },
  { label: 'резидент', value: profile.value?.isResident ? 'да' : 'нет' },
  { label: 'дата регистрации', value: profile.value ? formatDate(profile.value.createdAt) : '—' },
])

const cards = computed(() => cardsStore.cards.value)
const totalBalance = computed(() =>
  cards.value.reduce((sum, card) => sum + Number(card.balance ?? 0), 0).toFixed(2),
)

const columns = [
  { key: 'cardNumber', label: 'номер карты' },
  { key: 'dateOfExpire', label: 'срок' },
  { key: 'status', label: 'статус' },
  { key: 'accountNumber', label: 'номер счета' },
  { key: 'balance', label: 'баланс', align: 'right' as const },
]

onMounted(async () => {
  await Promise.all([
    cardsStore.fetchMyCards({ limit: 100 }),
    reportsStore.fetchMyReports({ limit: 3 }),
  ])
})

function openCard(row: Record<string, unknown>): void {
  selectedCard.value = row as unknown as CardOutput
}
</script>

<template>
  <div class="space-y-8">
    <PageHeader eyebrow="личный кабинет" :title="fullName" description="Профиль, карты и последние обращения в одном месте.">
      <template #actions>
        <Button variant="secondary" size="sm" @click="editOpen = true">Редактировать профиль</Button>
        <Button size="sm" @click="reportOpen = true">
          <AppIcon name="plus" :size="14" />
          Создать обращение
        </Button>
      </template>
    </PageHeader>

    <div class="grid gap-8 xl:grid-cols-[minmax(0,1.55fr)_minmax(280px,0.8fr)]">
      <div class="space-y-8">
        <Panel title="Данные клиента" description="Информация, которую использует банк при обслуживании.">
          <dl class="grid grid-cols-1 gap-x-8 gap-y-5 p-4 sm:grid-cols-2">
            <div v-for="item in info" :key="item.label">
              <dt class="text-[9px] font-medium uppercase tracking-[0.14em] text-muted">{{ item.label }}</dt>
              <dd class="mt-1.5 text-[12.5px] leading-5 text-ink">{{ item.value }}</dd>
            </div>
          </dl>
        </Panel>

        <Panel title="Карты" :description="`${cards.length} карт · ${formatMoney(totalBalance)}`">
          <template #actions>
            <RouterLink to="/portal/cards" class="text-[11px] text-muted underline decoration-line underline-offset-4 hover:text-ink">
              все карты
            </RouterLink>
          </template>

          <DataTable
            :columns="columns"
            :rows="cards"
            :loading="cardsStore.loading.value"
            clickable
            compact
            empty-text="У вас пока нет карт"
            @row-click="openCard"
          >
            <template #cell-cardNumber="{ row }">
              <span class="font-mono text-[12px] tracking-[-0.02em]">{{ formatCardNumber(row.cardNumber) }}</span>
            </template>
            <template #cell-dateOfExpire="{ row }">
              <span class="font-mono text-[11.5px]">{{ formatExpire(row.dateOfExpire) }}</span>
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
          </DataTable>
        </Panel>
      </div>

      <aside class="space-y-6">
        <section class="border border-line bg-[#f9e8e6] p-5">
          <p class="text-[10px] font-semibold uppercase tracking-[0.16em] text-ink/45">обратная связь</p>
          <h2 class="mt-2 text-[18px] font-semibold leading-snug tracking-[-0.02em] text-ink">
            Есть вопрос по карте или платежу?
          </h2>
          <p class="mt-2 text-[12px] leading-5 text-ink/55">
            Опишите ситуацию — обращение попадёт в работу, а статус будет виден в кабинете.
          </p>
          <Button class="mt-4" size="sm" @click="reportOpen = true">Создать обращение</Button>
        </section>

        <Panel title="Последние обращения">
          <template #actions>
            <RouterLink to="/portal/reports" class="text-[11px] text-muted underline decoration-line underline-offset-4 hover:text-ink">
              все
            </RouterLink>
          </template>

          <div v-if="reportsStore.loading.value" class="px-4 py-8 text-center text-[12px] text-muted">Загрузка…</div>
          <div v-else-if="reportsStore.reports.value.length === 0" class="px-4 py-8 text-center text-[12px] text-muted">
            Обращений пока нет
          </div>
          <template v-else>
            <RouterLink
              v-for="report in reportsStore.reports.value"
              :key="report.id"
              to="/portal/reports"
              class="flex items-start justify-between gap-3 border-b border-line px-4 py-3 transition-colors last:border-0 hover:bg-blush-50"
            >
              <div class="min-w-0">
                <p class="truncate text-[12px] font-medium text-ink">{{ report.title }}</p>
                <p class="mt-1 text-[10.5px] text-muted">{{ formatDate(report.createdAt) }}</p>
              </div>
              <Badge :tone="reportStatusTone(report.status)" :label="labelOf(REPORT_STATUS_LABELS, report.status)" />
            </RouterLink>
          </template>
        </Panel>

        <div class="border-t border-line pt-4 text-[10.5px] leading-5 text-muted">
          <p>Клиент с {{ profile ? formatDateTime(profile.createdAt) : '—' }}</p>
          <p class="mt-1">Идентификатор {{ profile?.id.slice(0, 8) ?? '—' }}</p>
        </div>
      </aside>
    </div>

    <ProfileDialog v-if="editOpen" @close="editOpen = false" @saved="() => {}" />
    <ReportFormDialog v-if="reportOpen" @close="reportOpen = false" @saved="reportsStore.fetchMyReports({ limit: 3 })" />
    <CardDetailDrawer v-if="selectedCard" :card="selectedCard" @close="selectedCard = null" />
  </div>
</template>
