<script setup lang="ts">

import { useReports, useThemes, useToastStore } from '@org/api-client'
import { AppIcon, Badge, Button, ConfirmDialog, DataTable, PageHeader, Pagination, Panel, SearchField, Select ,
  PRIORITY_LABELS,
  REPORT_STATUS_LABELS,
  REPORT_STATUS_OPTIONS,
  formatDate,
  labelOf,
  priorityTone,
  reportStatusTone,
} from '@org/ui'
import { computed, onMounted, ref } from 'vue'

import ReportDetailDrawer from './components/ReportDetailDrawer.vue'
import ReportFormDialog from './components/ReportFormDialog.vue'

import type { ListQuery } from '@org/api-client'
import type { ReportOutput } from '@org/shared-types'

const reportsStore = useReports()
const themesStore = useThemes()
const toast = useToastStore()

const search = ref('')
const status = ref<string | undefined>(undefined)
const createOpen = ref(false)
const editReport = ref<ReportOutput | null>(null)
const detailId = ref<string | null>(null)
const deleteTarget = ref<ReportOutput | null>(null)
const deleting = ref(false)

const reports = computed(() => reportsStore.reports.value)

const columns = [
  { key: 'title', label: 'обращение' },
  { key: 'themeId', label: 'тема' },
  { key: 'status', label: 'статус' },
  { key: 'priority', label: 'приоритет' },
  { key: 'createdAt', label: 'создано', align: 'right' as const },
]

onMounted(async () => {
  await Promise.all([load(), themesStore.fetchThemes()])
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
  await reportsStore.fetchMyReports(query(page))
}

function themeName(id: string | null): string {
  if (!id) return '—'
  return themesStore.themes.value.find((theme) => theme.id === id)?.name ?? '—'
}

function openDetail(row: Record<string, unknown>): void {
  detailId.value = String(row.id)
}

function startEdit(report: ReportOutput): void {
  detailId.value = null
  editReport.value = report
}

function askDelete(report: ReportOutput): void {
  deleteTarget.value = report
}

async function confirmDelete(): Promise<void> {
  if (!deleteTarget.value) return
  deleting.value = true
  const ok = await reportsStore.deleteMyReport(deleteTarget.value.id)
  deleting.value = false

  if (ok) {
    toast.success('Обращение удалено')
    deleteTarget.value = null
    detailId.value = null
    await load()
  } else {
    toast.error(reportsStore.error.value ?? 'Не удалось удалить обращение')
  }
}

async function onSaved(): Promise<void> {
  await load()
}
</script>

<template>
  <div class="space-y-8">
    <PageHeader
      eyebrow="личный кабинет"
      title="Мои обращения"
      description="Вопросы по картам, платежам и обслуживанию. Статус обновляется сотрудником банка."
    >
      <template #actions>
        <Button size="sm" @click="createOpen = true">
          <AppIcon name="plus" :size="14" />
          Создать обращение
        </Button>
      </template>
    </PageHeader>

    <div class="flex flex-wrap items-center gap-3 border-y border-line py-4">
      <SearchField v-model="search" placeholder="Поиск по обращениям" @search="load(1)" />
      <div class="w-full sm:w-48">
        <Select
          v-model="status"
          :options="[{ value: '', label: 'все статусы' }, ...REPORT_STATUS_OPTIONS]"
          @update:model-value="load(1)"
        />
      </div>
      <p v-if="reportsStore.error.value" class="text-[11px] text-danger">{{ reportsStore.error.value }}</p>
    </div>

    <Panel>
      <DataTable
        :columns="columns"
        :rows="reports"
        :loading="reportsStore.loading.value"
        clickable
        empty-text="Обращений пока нет"
        @row-click="openDetail"
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

      <Pagination :pagination="reportsStore.pagination.value" @change="load" />
    </Panel>

    <ReportFormDialog
      v-if="createOpen"
      @close="createOpen = false"
      @saved="onSaved"
    />
    <ReportFormDialog
      v-if="editReport"
      :report="editReport"
      @close="editReport = null"
      @saved="onSaved"
    />
    <ReportDetailDrawer
      v-if="detailId"
      :report-id="detailId"
      @close="detailId = null"
      @edit="startEdit"
      @delete="askDelete"
    />
    <ConfirmDialog
      :open="deleteTarget !== null"
      title="Удалить обращение?"
      message="Обращение и его история будут удалены без возможности восстановления."
      confirm-label="Удалить"
      :loading="deleting"
      @cancel="deleteTarget = null"
      @confirm="confirmDelete"
    />
  </div>
</template>
