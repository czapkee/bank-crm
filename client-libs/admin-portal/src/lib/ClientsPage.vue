<script setup lang="ts">

import { useCards, useClients, useToastStore } from '@org/api-client'
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
  cardStatusTone,
  formatCardNumber,
  formatDate,
  formatDateTime,
  formatExpire,
  formatPersonName,
  labelOf,
} from '@org/ui'
import { computed, onMounted, ref } from 'vue'

import PersonForm from './components/PersonForm.vue'
import ResetPasswordDialog from './components/ResetPasswordDialog.vue'

import type { ListQuery } from '@org/api-client'
import type { CardOutput, ClientOutput } from '@org/shared-types'

const store = useClients()
const cardsStore = useCards()
const toast = useToastStore()

const search = ref('')
const active = ref<string | undefined>(undefined)
const formOpen = ref(false)
const formMode = ref<'create' | 'edit'>('create')
const editEntity = ref<ClientOutput | null>(null)
const drawer = ref<ClientOutput | null>(null)
const drawerCards = ref<CardOutput[]>([])
const resetTarget = ref<ClientOutput | null>(null)
const deleteTarget = ref<ClientOutput | null>(null)
const acting = ref(false)
const loadingCards = ref(false)

const clients = computed(() => store.clients.value)

const columns = [
  { key: 'name', label: 'клиент' },
  { key: 'email', label: 'email' },
  { key: 'phoneNumber', label: 'телефон' },
  { key: 'numPass', label: 'паспорт' },
  { key: 'isActive', label: 'статус' },
  { key: 'createdAt', label: 'создан', align: 'right' as const },
]

const cardColumns = [
  { key: 'cardNumber', label: 'карта' },
  { key: 'dateOfExpire', label: 'срок' },
  { key: 'status', label: 'статус' },
]

onMounted(() => load())

function query(page = 1): ListQuery {
  return {
    page,
    limit: 10,
    ...(search.value ? { search: search.value } : {}),
    ...(active.value === 'active' ? { isActive: true } : {}),
    ...(active.value === 'blocked' ? { isActive: false } : {}),
  }
}

async function load(page = 1): Promise<void> {
  await store.fetchClients(query(page))
}

function fullName(client: ClientOutput): string {
  return formatPersonName(client)
}

function create(): void {
  formMode.value = 'create'
  editEntity.value = null
  formOpen.value = true
}

function edit(client: ClientOutput): void {
  formMode.value = 'edit'
  editEntity.value = client
  formOpen.value = true
}

async function openDrawer(row: Record<string, unknown>): Promise<void> {
  const client = row as unknown as ClientOutput
  drawer.value = client
  loadingCards.value = true
  const result = await cardsStore.fetchUserCards(client.id, { limit: 20 })
  drawerCards.value = result?.cards ?? []
  loadingCards.value = false
}

async function toggleBlock(client: ClientOutput): Promise<void> {
  acting.value = true
  const result = client.isActive ? await store.blockClient(client.id) : await store.unblockClient(client.id)
  acting.value = false

  if (result) {
    toast.success(client.isActive ? 'Клиент заблокирован' : 'Клиент разблокирован')
    drawer.value = result
    await load()
  } else {
    toast.error(store.error.value ?? 'Не удалось изменить статус')
  }
}

async function confirmDelete(): Promise<void> {
  if (!deleteTarget.value) return
  acting.value = true
  const ok = await store.deleteClient(deleteTarget.value.id)
  acting.value = false

  if (ok) {
    toast.success('Клиент удалён')
    deleteTarget.value = null
    drawer.value = null
    await load()
  } else {
    toast.error(store.error.value ?? 'Не удалось удалить клиента')
  }
}
</script>

<template>
  <div class="space-y-7">
    <PageHeader eyebrow="рабочее место" title="Клиенты" description="Карточки клиентов, статусы обслуживания и выпущенные карты.">
      <template #actions>
        <Button size="sm" @click="create">
          <AppIcon name="plus" :size="14" />
          Новый клиент
        </Button>
      </template>
    </PageHeader>

    <div class="flex flex-wrap items-center gap-3 border-y border-line py-4">
      <SearchField v-model="search" placeholder="ФИО, email или телефон" @search="load(1)" />
      <div class="w-full sm:w-44">
        <Select
          v-model="active"
          :options="[
            { value: '', label: 'все клиенты' },
            { value: 'active', label: 'активные' },
            { value: 'blocked', label: 'заблокированные' },
          ]"
          @update:model-value="load(1)"
        />
      </div>
      <p v-if="store.error.value" class="text-[11px] text-danger">{{ store.error.value }}</p>
    </div>

    <Panel>
      <DataTable
        :columns="columns"
        :rows="clients"
        :loading="store.loading.value"
        clickable
        empty-text="Клиенты не найдены"
        @row-click="openDrawer"
      >
        <template #cell-name="{ row }">
          <div class="min-w-0">
            <p class="truncate text-[12.5px] font-medium text-ink">
              {{ formatPersonName(row) }}
            </p>
            <p class="mt-0.5 font-mono text-[10px] text-muted">{{ String(row.id).slice(0, 8) }}</p>
          </div>
        </template>
        <template #cell-isActive="{ row }">
          <Badge :tone="row.isActive ? 'success' : 'danger'" :label="row.isActive ? 'активен' : 'заблокирован'" />
        </template>
        <template #cell-createdAt="{ row }">
          <span class="whitespace-nowrap text-[11.5px] text-muted">{{ formatDate(row.createdAt) }}</span>
        </template>
      </DataTable>
      <Pagination :pagination="store.pagination.value" @change="load" />
    </Panel>

    <PersonForm
      v-if="formOpen"
      kind="client"
      :mode="formMode"
      :entity="editEntity"
      @close="formOpen = false"
      @saved="load()"
    />

    <Drawer
      v-if="drawer"
      open
      :title="fullName(drawer)"
      :description="drawer.email"
      @close="drawer = null"
    >
      <div class="space-y-6 px-5 py-5">
        <div class="flex items-center justify-between gap-3">
          <Badge :tone="drawer.isActive ? 'success' : 'danger'" :label="drawer.isActive ? 'активен' : 'заблокирован'" />
          <span class="font-mono text-[10px] text-muted">ID {{ drawer.id.slice(0, 8) }}</span>
        </div>

        <dl class="grid grid-cols-2 gap-x-4 gap-y-4 border-y border-line py-4 text-[12px]">
          <div>
            <dt class="text-[9px] uppercase tracking-[0.14em] text-muted">телефон</dt>
            <dd class="mt-1 text-ink">{{ drawer.phoneNumber }}</dd>
          </div>
          <div>
            <dt class="text-[9px] uppercase tracking-[0.14em] text-muted">паспорт</dt>
            <dd class="mt-1 font-mono text-[11.5px] text-ink">{{ drawer.numPass }}</dd>
          </div>
          <div>
            <dt class="text-[9px] uppercase tracking-[0.14em] text-muted">идентификационный номер</dt>
            <dd class="mt-1 font-mono text-[11.5px] text-ink">{{ drawer.identifCode }}</dd>
          </div>
          <div>
            <dt class="text-[9px] uppercase tracking-[0.14em] text-muted">резидент</dt>
            <dd class="mt-1 text-ink">{{ drawer.isResident ? 'да' : 'нет' }}</dd>
          </div>
          <div class="col-span-2">
            <dt class="text-[9px] uppercase tracking-[0.14em] text-muted">адрес регистрации</dt>
            <dd class="mt-1 text-ink">{{ drawer.address }}</dd>
          </div>
          <div>
            <dt class="text-[9px] uppercase tracking-[0.14em] text-muted">создан</dt>
            <dd class="mt-1 text-ink">{{ formatDateTime(drawer.createdAt) }}</dd>
          </div>
          <div>
            <dt class="text-[9px] uppercase tracking-[0.14em] text-muted">обновлён</dt>
            <dd class="mt-1 text-ink">{{ formatDateTime(drawer.updatedAt) }}</dd>
          </div>
        </dl>

        <div class="flex flex-wrap gap-2">
          <Button size="sm" variant="secondary" @click="drawer && edit(drawer)">Редактировать</Button>
          <Button size="sm" variant="secondary" :loading="acting" @click="drawer && toggleBlock(drawer)">
            {{ drawer.isActive ? 'Заблокировать' : 'Разблокировать' }}
          </Button>
          <Button size="sm" variant="secondary" @click="resetTarget = drawer">Сбросить пароль</Button>
        </div>

        <div>
          <h3 class="mb-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">карты клиента</h3>
          <DataTable
            :columns="cardColumns"
            :rows="drawerCards"
            :loading="loadingCards"
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
          </DataTable>
        </div>
      </div>

      <template #footer>
        <div class="flex items-center justify-between">
          <Button variant="ghost" size="sm" @click="deleteTarget = drawer">Удалить</Button>
          <Button variant="secondary" size="sm" @click="drawer = null">Закрыть</Button>
        </div>
      </template>
    </Drawer>

    <ResetPasswordDialog
      v-if="resetTarget"
      kind="client"
      :target-id="resetTarget.id"
      :target-name="fullName(resetTarget)"
      @close="resetTarget = null"
    />

    <ConfirmDialog
      :open="deleteTarget !== null"
      title="Удалить клиента?"
      message="Учётная запись клиента, его карты и платежи будут удалены."
      confirm-label="Удалить"
      :loading="acting"
      @cancel="deleteTarget = null"
      @confirm="confirmDelete"
    />
  </div>
</template>
