<script setup lang="ts">

import { useLogs } from '@org/api-client'
import { Badge, DataTable, Input, PageHeader, Pagination, Panel, SearchField, Select , formatDateTime } from '@org/ui'
import { computed, onMounted, ref } from 'vue'

import LogDetailDrawer from './components/LogDetailDrawer.vue'

import type { ListQuery } from '@org/api-client'

const store = useLogs()

const search = ref('')
const method = ref<string | undefined>(undefined)
const date = ref('')
const detailId = ref<string | null>(null)

const logs = computed(() => store.logs.value)

const columns = [
  { key: 'createdAt', label: 'время' },
  { key: 'service', label: 'сервис' },
  { key: 'method', label: 'метод' },
  { key: 'action', label: 'действие' },
  { key: 'entity', label: 'сущность' },
  { key: 'userId', label: 'пользователь', align: 'right' as const },
]

const methodTone = (value: string): 'success' | 'warning' | 'danger' | 'info' | 'neutral' => {
  if (value === 'DELETE') return 'danger'
  if (value === 'POST') return 'success'
  if (value === 'PUT' || value === 'PATCH') return 'warning'
  return 'info'
}

onMounted(() => load())

function query(page = 1): ListQuery {
  const result: ListQuery = {
    page,
    limit: 20,
    ...(search.value ? { search: search.value } : {}),
    ...(method.value ? { method: method.value } : {}),
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
  await store.fetchLogs(query(page))
}
</script>

<template>
  <div class="space-y-7">
    <PageHeader eyebrow="рабочее место" title="Журнал операций" description="Действия сотрудников и сервисов: метод, сущность и время." />

    <div class="flex flex-wrap items-end gap-3 border-y border-line py-4">
      <SearchField v-model="search" placeholder="Действие или сервис" @search="load(1)" />
      <div class="w-full sm:w-40">
        <Select
          v-model="method"
          label="метод"
          :options="[
            { value: '', label: 'все' },
            { value: 'GET', label: 'GET' },
            { value: 'QUERY', label: 'QUERY' },
            { value: 'POST', label: 'POST' },
            { value: 'PUT', label: 'PUT' },
            { value: 'PATCH', label: 'PATCH' },
            { value: 'DELETE', label: 'DELETE' },
          ]"
          @update:model-value="load(1)"
        />
      </div>
      <div class="w-full sm:w-40">
        <Input v-model="date" label="дата" type="date" />
      </div>
      <button
        type="button"
        class="h-9 rounded-[4px] border border-line bg-surface px-4 text-[12px] text-ink transition-colors hover:border-blush-300"
        @click="load(1)"
      >
        Применить
      </button>
      <p v-if="store.error.value" class="text-[11px] text-danger">{{ store.error.value }}</p>
    </div>

    <Panel>
      <DataTable
        :columns="columns"
        :rows="logs"
        :loading="store.loading.value"
        clickable
        compact
        empty-text="Записей не найдено"
        @row-click="(row) => (detailId = String(row.id))"
      >
        <template #cell-createdAt="{ row }">
          <span class="whitespace-nowrap font-mono text-[10.5px] text-muted">{{ formatDateTime(row.createdAt) }}</span>
        </template>
        <template #cell-service="{ row }">
          <span class="text-[11.5px]">{{ row.service }}</span>
        </template>
        <template #cell-method="{ row }">
          <Badge :tone="methodTone(row.method)" :label="row.method" soft />
        </template>
        <template #cell-action="{ row }">
          <span class="text-[11.5px]">{{ row.action }}</span>
        </template>
        <template #cell-entity="{ row }">
          <span class="text-[11.5px] text-muted">{{ row.entity || '—' }}</span>
        </template>
        <template #cell-userId="{ row }">
          <span class="font-mono text-[10.5px] text-muted">{{ row.userId ? String(row.userId).slice(0, 8) : 'аноним' }}</span>
        </template>
      </DataTable>
      <Pagination :pagination="store.pagination.value" @change="load" />
    </Panel>

    <LogDetailDrawer v-if="detailId" :log-id="detailId" @close="detailId = null" />
  </div>
</template>
