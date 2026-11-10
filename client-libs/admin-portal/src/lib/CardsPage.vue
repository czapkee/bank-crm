<script setup lang="ts">

import { useAuthStore, useCards, useClients, useToastStore } from '@org/api-client'
import { Roles } from '@org/enums'
import {
  AppIcon,
  Badge,
  Button,
  ConfirmDialog,
  DataTable,
  Drawer,
  PageHeader,
  Pagination,
  Panel,
  SearchField,
  Select,
  CARD_STATUS_LABELS,
  CARD_STATUS_OPTIONS,
  cardStatusTone,
  formatCardNumber,
  formatDateTime,
  formatExpire,
  formatMoney,
  formatPersonName,
  labelOf,
} from '@org/ui'
import { computed, onMounted, ref } from 'vue'

import CardFormDialog from './components/CardFormDialog.vue'

import type { ListQuery } from '@org/api-client'
import type { CardOutput } from '@org/shared-types'

const auth = useAuthStore()
const store = useCards()
const clients = useClients()
const toast = useToastStore()

const canBrowseClients = computed(
  () => auth.role === Roles.HEAD_OF_DEPARTMENT || auth.role === Roles.SUPERADMIN,
)

const search = ref('')
const status = ref<string | undefined>(undefined)
const formOpen = ref(false)
const formMode = ref<'create' | 'edit'>('create')
const editCard = ref<CardOutput | null>(null)
const drawer = ref<CardOutput | null>(null)
const deleteTarget = ref<CardOutput | null>(null)
const acting = ref(false)

const cards = computed(() => store.cards.value)

const columns = computed(() => [
  { key: 'cardNumber', label: 'карта' },
  ...(canBrowseClients.value ? [{ key: 'client', label: 'клиент' }] : []),
  { key: 'dateOfExpire', label: 'срок' },
  { key: 'status', label: 'статус' },
  { key: 'balance', label: 'баланс', align: 'right' as const },
  { key: 'createdAt', label: 'выпущена', align: 'right' as const },
])

onMounted(async () => {
  await load()

  if (canBrowseClients.value) await clients.fetchClients({ limit: 100 })
})

function query(page = 1): ListQuery {
  return {
    page,
    limit: 10,
    ...(search.value ? { search: search.value } : {}),
    ...(status.value ? { status: status.value } : {}),
  }
}

async function load(page = 1): Promise<void> {
  await store.fetchCards(query(page))
}

function clientOf(userId: string): string {
  const client = clients.clients.value.find((item) => item.id === userId)
  return client ? formatPersonName(client) : '—'
}

function create(): void {
  formMode.value = 'create'
  editCard.value = null
  formOpen.value = true
}

function edit(card: CardOutput): void {
  formMode.value = 'edit'
  editCard.value = card
  formOpen.value = true
}

async function toggleBlock(card: CardOutput): Promise<void> {
  acting.value = true
  const result = card.status === 'BLOCKED' ? await store.unblockCard(card.id) : await store.blockCard(card.id)
  acting.value = false

  if (result) {
    toast.success(card.status === 'BLOCKED' ? 'Карта разблокирована' : 'Карта заблокирована')
    drawer.value = result
    await load()
  } else {
    toast.error(store.error.value ?? 'Не удалось изменить статус')
  }
}

async function confirmDelete(): Promise<void> {
  if (!deleteTarget.value) return
  acting.value = true
  const ok = await store.deleteCard(deleteTarget.value.id)
  acting.value = false

  if (ok) {
    toast.success('Карта удалена')
    deleteTarget.value = null
    drawer.value = null
    await load()
  } else {
    toast.error(store.error.value ?? 'Не удалось удалить карту')
  }
}
</script>

<template>
  <div class="space-y-7">
    <PageHeader
      eyebrow="рабочее место"
      title="Карты"
      description="Выпуск, блокировка и сопровождение банковских карт."
    >
      <template #actions>
        <Button size="sm" @click="create">
          <AppIcon name="plus" :size="14" />
          Новая карта
        </Button>
      </template>
    </PageHeader>

    <div class="flex flex-wrap items-center gap-3 border-y border-line py-4">
      <SearchField
        v-model="search"
        placeholder="Номер карты или счёт"
        @search="load(1)"
      />
      <div class="w-full sm:w-48">
        <Select
          v-model="status"
          :options="[{ value: '', label: 'все статусы' }, ...CARD_STATUS_OPTIONS]"
          @update:model-value="load(1)"
        />
      </div>
      <p v-if="store.error.value" class="text-[11px] text-danger">{{ store.error.value }}</p>
    </div>

    <Panel>
      <DataTable
        :columns="columns"
        :rows="cards"
        :loading="store.loading.value"
        clickable
        empty-text="Карты не найдены"
        @row-click="(row) => (drawer = row as CardOutput)"
      >
        <template #cell-cardNumber="{ row }">
          <span class="whitespace-nowrap font-mono text-[11.5px] tracking-[-0.02em]">{{ formatCardNumber(row.cardNumber) }}</span>
        </template>
        <template #cell-client="{ row }">
          {{ clientOf(row.userId) }}
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
          <span class="whitespace-nowrap text-[11px] text-muted">{{ formatDateTime(row.createdAt) }}</span>
        </template>
      </DataTable>
      <Pagination :pagination="store.pagination.value" @change="load" />
    </Panel>

    <CardFormDialog
      v-if="formOpen"
      :mode="formMode"
      :card="editCard"
      @close="formOpen = false"
      @saved="load()"
    />

    <Drawer
      v-if="drawer"
      open
      :title="formatCardNumber(drawer.cardNumber)"
      :description="`клиент: ${clientOf(drawer.userId)}`"
      @close="drawer = null"
    >
      <div class="space-y-6 px-5 py-5">
        <div class="flex flex-wrap items-center gap-2">
          <Badge :tone="cardStatusTone(drawer.status)" :label="labelOf(CARD_STATUS_LABELS, drawer.status)" />
          <span class="font-mono text-[10px] text-muted">ID {{ drawer.id.slice(0, 8) }}</span>
        </div>

        <dl class="grid grid-cols-2 gap-x-4 gap-y-4 border-y border-line py-4 text-[12px]">
          <div>
            <dt class="text-[9px] uppercase tracking-[0.14em] text-muted">номер счёта</dt>
            <dd class="mt-1 font-mono text-[11.5px] text-ink">{{ drawer.accountNumber }}</dd>
          </div>
          <div>
            <dt class="text-[9px] uppercase tracking-[0.14em] text-muted">баланс</dt>
            <dd class="mt-1 text-[15px] font-semibold tabular-nums text-ink">{{ formatMoney(drawer.balance) }}</dd>
          </div>
          <div>
            <dt class="text-[9px] uppercase tracking-[0.14em] text-muted">срок действия</dt>
            <dd class="mt-1 font-mono text-[11.5px] text-ink">{{ formatExpire(drawer.dateOfExpire) }}</dd>
          </div>
          <div>
            <dt class="text-[9px] uppercase tracking-[0.14em] text-muted">выпущена</dt>
            <dd class="mt-1 text-ink">{{ formatDateTime(drawer.createdAt) }}</dd>
          </div>
          <div class="col-span-2">
            <dt class="text-[9px] uppercase tracking-[0.14em] text-muted">обновлена</dt>
            <dd class="mt-1 text-ink">{{ formatDateTime(drawer.updatedAt) }}</dd>
          </div>
        </dl>

        <div class="flex flex-wrap gap-2">
          <Button size="sm" variant="secondary" @click="drawer && edit(drawer)">Редактировать</Button>
          <Button size="sm" variant="secondary" :loading="acting" @click="drawer && toggleBlock(drawer)">
            {{ drawer.status === 'BLOCKED' ? 'Разблокировать' : 'Заблокировать' }}
          </Button>
          <RouterLink :to="`/admin/payments?card=${drawer.id}`">
            <Button size="sm" variant="secondary">Платежи по карте</Button>
          </RouterLink>
        </div>
      </div>

      <template #footer>
        <div class="flex items-center justify-between">
          <Button variant="ghost" size="sm" @click="deleteTarget = drawer">Удалить</Button>
          <Button variant="secondary" size="sm" @click="drawer = null">Закрыть</Button>
        </div>
      </template>
    </Drawer>

    <ConfirmDialog
      :open="deleteTarget !== null"
      title="Удалить карту?"
      message="Карта и связанные операции будут удалены без возможности восстановления."
      confirm-label="Удалить"
      :loading="acting"
      @cancel="deleteTarget = null"
      @confirm="confirmDelete"
    />
  </div>
</template>
