<script setup lang="ts">

import { useAuthStore, useEmployees, useToastStore } from '@org/api-client'
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

  ROLE_LABELS,
  ROLE_OPTIONS,
  formatDate,
  formatDateTime,
  formatPersonName,
  labelOf,
  roleTone,
} from '@org/ui'
import { computed, onMounted, ref } from 'vue'

import PersonForm from './components/PersonForm.vue'
import ResetPasswordDialog from './components/ResetPasswordDialog.vue'

import type { ListQuery } from '@org/api-client'
import type { Roles } from '@org/enums'
import type { EmployeeUserEntity } from '@org/shared-types'

const auth = useAuthStore()
const store = useEmployees()
const toast = useToastStore()

const search = ref('')
const roleFilter = ref<string | undefined>(undefined)
const formOpen = ref(false)
const formMode = ref<'create' | 'edit'>('create')
const editEntity = ref<EmployeeUserEntity | null>(null)
const drawer = ref<EmployeeUserEntity | null>(null)
const resetTarget = ref<EmployeeUserEntity | null>(null)
const deleteTarget = ref<EmployeeUserEntity | null>(null)
const roleDraft = ref<string>('EMPLOYEE')
const acting = ref(false)

const isSuperadmin = computed(() => auth.role === 'SUPERADMIN')
const employees = computed(() => store.employees.value)

const columns = [
  { key: 'name', label: 'сотрудник' },
  { key: 'email', label: 'email' },
  { key: 'role', label: 'роль' },
  { key: 'phoneNumber', label: 'телефон' },
  { key: 'isActive', label: 'статус' },
  { key: 'createdAt', label: 'создан', align: 'right' as const },
]

onMounted(() => load())

function query(page = 1): ListQuery {
  return {
    page,
    limit: 10,
    ...(search.value ? { search: search.value } : {}),
    ...(roleFilter.value ? { role: roleFilter.value } : {}),
  }
}

async function load(page = 1): Promise<void> {
  await store.fetchEmployees(query(page))
}

function fullName(employee: EmployeeUserEntity): string {
  return formatPersonName(employee)
}

function create(): void {
  formMode.value = 'create'
  editEntity.value = null
  formOpen.value = true
}

function edit(employee: EmployeeUserEntity): void {
  formMode.value = 'edit'
  editEntity.value = employee
  formOpen.value = true
}

function openDrawer(row: Record<string, unknown>): void {
  const employee = row as unknown as EmployeeUserEntity
  drawer.value = employee
  roleDraft.value = employee.role
}

async function toggleBlock(employee: EmployeeUserEntity): Promise<void> {
  acting.value = true
  const result = employee.isActive ? await store.blockEmployee(employee.id) : await store.unblockEmployee(employee.id)
  acting.value = false

  if (result) {
    toast.success(employee.isActive ? 'Сотрудник заблокирован' : 'Сотрудник разблокирован')
    drawer.value = result
    await load()
  } else {
    toast.error(store.error.value ?? 'Не удалось изменить статус')
  }
}

async function applyRole(): Promise<void> {
  if (!drawer.value) return
  acting.value = true
  const result = await store.changeEmployeeRole(drawer.value.id, roleDraft.value as Roles)
  acting.value = false

  if (result) {
    toast.success('Роль изменена')
    drawer.value = result
    await load()
  } else {
    toast.error(store.error.value ?? 'Не удалось изменить роль')
  }
}

async function confirmDelete(): Promise<void> {
  if (!deleteTarget.value) return
  acting.value = true
  const ok = await store.deleteEmployee(deleteTarget.value.id)
  acting.value = false

  if (ok) {
    toast.success('Сотрудник удалён')
    deleteTarget.value = null
    drawer.value = null
    await load()
  } else {
    toast.error(store.error.value ?? 'Не удалось удалить сотрудника')
  }
}
</script>

<template>
  <div class="space-y-7">
    <PageHeader eyebrow="рабочее место" title="Сотрудники" description="Учётные записи сотрудников банка и роли доступа.">
      <template #actions>
        <Button v-if="isSuperadmin" size="sm" @click="create">
          <AppIcon name="plus" :size="14" />
          Новый сотрудник
        </Button>
      </template>
    </PageHeader>

    <div class="flex flex-wrap items-center gap-3 border-y border-line py-4">
      <SearchField v-model="search" placeholder="ФИО или email" @search="load(1)" />
      <div class="w-full sm:w-52">
        <Select
          v-model="roleFilter"
          :options="[{ value: '', label: 'все роли' }, ...ROLE_OPTIONS]"
          @update:model-value="load(1)"
        />
      </div>
      <p v-if="store.error.value" class="text-[11px] text-danger">{{ store.error.value }}</p>
    </div>

    <Panel>
      <DataTable
        :columns="columns"
        :rows="employees"
        :loading="store.loading.value"
        clickable
        empty-text="Сотрудники не найдены"
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
        <template #cell-role="{ row }">
          <Badge :tone="roleTone(row.role)" :label="labelOf(ROLE_LABELS, row.role)" />
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
      kind="employee"
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
          <Badge :tone="roleTone(drawer.role)" :label="labelOf(ROLE_LABELS, drawer.role)" />
          <Badge :tone="drawer.isActive ? 'success' : 'danger'" :label="drawer.isActive ? 'активен' : 'заблокирован'" />
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
            <dt class="text-[9px] uppercase tracking-[0.14em] text-muted">адрес</dt>
            <dd class="mt-1 text-ink">{{ drawer.address }}</dd>
          </div>
          <div>
            <dt class="text-[9px] uppercase tracking-[0.14em] text-muted">создан</dt>
            <dd class="mt-1 text-ink">{{ formatDateTime(drawer.createdAt) }}</dd>
          </div>
        </dl>

        <div v-if="isSuperadmin" class="flex flex-wrap items-end gap-2 border border-line bg-paper/60 p-3">
          <div class="min-w-[180px] flex-1">
            <Select v-model="roleDraft" label="роль доступа" :options="ROLE_OPTIONS" />
          </div>
          <Button size="sm" variant="secondary" :loading="acting" @click="applyRole">Применить</Button>
        </div>

        <div class="flex flex-wrap gap-2">
          <Button size="sm" variant="secondary" @click="drawer && edit(drawer)">Редактировать</Button>
          <Button size="sm" variant="secondary" :loading="acting" @click="drawer && toggleBlock(drawer)">
            {{ drawer.isActive ? 'Заблокировать' : 'Разблокировать' }}
          </Button>
          <Button size="sm" variant="secondary" @click="resetTarget = drawer">Сбросить пароль</Button>
        </div>
      </div>

      <template #footer>
        <div class="flex items-center justify-between">
          <Button v-if="isSuperadmin" variant="ghost" size="sm" @click="deleteTarget = drawer">Удалить</Button>
          <span v-else />
          <Button variant="secondary" size="sm" @click="drawer = null">Закрыть</Button>
        </div>
      </template>
    </Drawer>

    <ResetPasswordDialog
      v-if="resetTarget"
      kind="employee"
      :target-id="resetTarget.id"
      :target-name="fullName(resetTarget)"
      @close="resetTarget = null"
    />

    <ConfirmDialog
      :open="deleteTarget !== null"
      title="Удалить сотрудника?"
      message="Учётная запись сотрудника будет удалена без возможности восстановления."
      confirm-label="Удалить"
      :loading="acting"
      @cancel="deleteTarget = null"
      @confirm="confirmDelete"
    />
  </div>
</template>
