<script setup lang="ts">

import { useAuthStore, useReports, useThemes, useToastStore } from '@org/api-client'
import {
  Badge,
  ConfirmDialog,
  DataTable,
  PageHeader,
  Pagination,
  Panel,
  SearchField,
  Select,

  PRIORITY_LABELS,
  PRIORITY_OPTIONS,
  REPORT_STATUS_LABELS,
  REPORT_STATUS_OPTIONS,
  formatDate,
  labelOf,
  priorityTone,
  reportStatusTone} from '@org/ui'
import { computed, onMounted, ref } from 'vue'

import AdminReportDrawer from './components/AdminReportDrawer.vue'
import ReportEditDialog from './components/ReportEditDialog.vue'

import type { ListQuery } from '@org/api-client'
import type { ReportOutput } from '@org/shared-types'

const auth = useAuthStore()
const store = useReports()
const themes = useThemes()
const toast = useToastStore()

const search = ref('')
const status = ref<string | undefined>(undefined)
const priority = ref<string | undefined>(undefined)
const detailId = ref<string | null>(null)
const editReport = ref<ReportOutput | null>(null)
const deleteTarget = ref<ReportOutput | null>(null)
const acting = ref(false)

const reports = computed(() => store.reports.value)

const columns = [
  { key: 'title', label: 'обращение' },
  { key: 'themeId', label: 'тема' },
  { key: 'status', label: 'статус' },
  { key: 'priority', label: 'приоритет' },
  { key: 'createdAt', label: 'создано', align: 'right' as const },
]

onMounted(async () => {
  await Promise.all([load(), themes.fetchAdminThemes({ limit: 100 })])
})

function query(page = 1): ListQuery {
  return {
    page,
    limit: 10,
    ...(search.value ? { search: search.value } : {}),
    ...(status.value ? { status: status.value } : {}),
    ...(priority.value ? { priority: priority.value } : {}),
  }
}

async function load(page = 1): Promise<void> {
  await store.fetchReports(query(page))
}

function themeName(id: string | null): string {
  if (!id) return '—'
  return themes.themes.value.find((theme) => theme.id === id)?.name ?? '—'
}

function startEdit(report: ReportOutput): void {
  detailId.value = null
  editReport.value = report
}

async function confirmDelete(): Promise<void> {
  if (!deleteTarget.value) return
  acting.value = true
  const ok = await store.deleteReport(deleteTarget.value.id)
  acting.value = false

  if (ok) {
    toast.success('Обращение удалено')
    deleteTarget.value = null
    detailId.value = null
    await load()
  } else {
    toast.error(store.error.value ?? 'Не удалось удалить обращение')
  }
}
</script>

<template>
  <div class="space-y-7">
    <PageHeader
      eyebrow="рабочее место"
      title="Обращения"
      description="Очередь обращений клиентов: назначение, приоритеты и закрытие."
    />

    <div class="flex flex-wrap items-center gap-3 border-y border-line py-4">
      <SearchField v-model="search" placeholder="Поиск по обращениям" @search="load(1)" />
      <div class="w-full sm:w-44">
        <Select
          v-model="status"
          :options="[{ value: '', label: 'все статусы' }, ...REPORT_STATUS_OPTIONS]"
          @update:model-value="load(1)"
        />
      </div>
      <div class="w-full sm:w-40">
        <Select
          v-model="priority"
          :options="[{ value: '', label: 'все приоритеты' }, ...PRIORITY_OPTIONS]"
          @update:model-value="load(1)"
        />
      </div>
      <p v-if="store.error.value" class="text-[11px] text-danger">{{ store.error.value }}</p>
    </div>

    <Panel>
      <DataTable
        :columns="columns"
        :rows="reports"
        :loading="store.loading.value"
        clickable
        empty-text="Обращений не найдено"
        @row-click="(row) => (detailId = String(row.id))"
      >
        <template #cell-title="{ row }">
          <div class="min-w-0">
            <p class="truncate text-[12.5px] font-medium text-ink">{{ row.title }}</p>
            <p class="mt-0.5 font-mono text-[10px] text-muted">№ {{ String(row.id).slice(0, 8) }}</p>
          </div>
        </template>
        <template #cell-themeId="{ row }">
          {{ themeName(row.themeId) }}
        </template>
        <template #cell-status="{ row }">
          <Badge :tone="reportStatusTone(row.status)" :label="labelOf(REPORT_STATUS_LABELS, row.status)" />
        </template>
        <template #cell-priority="{ row }">
          <Badge :tone="priorityTone(row.priority)" :label="labelOf(PRIORITY_LABELS, row.priority)" soft />
        </template>
        <template #cell-createdAt="{ row }">
          <span class="whitespace-nowrap text-[11.5px] text-muted">{{ formatDate(row.createdAt) }}</span>
        </template>
      </DataTable>
      <Pagination :pagination="store.pagination.value" @change="load" />
    </Panel>

    <AdminReportDrawer
      v-if="detailId"
      :report-id="detailId"
      :can-edit="auth.role === 'HEAD_OF_DEPARTMENT' || auth.role === 'SUPERADMIN'"
      @close="detailId = null"
      @edit="startEdit"
      @delete="(report) => (deleteTarget = report)"
      @updated="load(store.pagination.value?.page ?? 1)"
    />

    <ReportEditDialog
      v-if="editReport"
      :report="editReport"
      :can-assign="auth.role === 'SUPERADMIN'"
      @close="editReport = null"
      @saved="load()"
    />

    <ConfirmDialog
      :open="deleteTarget !== null"
      title="Удалить обращение?"
      message="Обращение будет удалено вместе с историей обработки."
      confirm-label="Удалить"
      :loading="acting"
      @cancel="deleteTarget = null"
      @confirm="confirmDelete"
    />
  </div>
</template>
