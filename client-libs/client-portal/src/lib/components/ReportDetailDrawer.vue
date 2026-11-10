<script setup lang="ts">

import { useReports, useThemes } from '@org/api-client'
import { Badge, Button, Drawer, EmptyState ,
  FEEDBACK_LABELS,
  PRIORITY_LABELS,
  REPORT_STATUS_LABELS,
  formatDateTime,
  labelOf,
  priorityTone,
  reportStatusTone,
} from '@org/ui'
import { computed, onMounted, ref } from 'vue'

import type { ReportOutput } from '@org/shared-types'

const props = defineProps<{ reportId: string }>()
const emit = defineEmits<{ close: []; edit: [report: ReportOutput]; delete: [report: ReportOutput] }>()

const reports = useReports()
const themes = useThemes()
const report = ref<ReportOutput | null>(null)
const loading = ref(true)

const themeName = computed(() => {
  if (!report.value?.themeId) return '—'
  return themes.themes.find((theme) => theme.id === report.value?.themeId)?.name ?? '—'
})

const isClosed = computed(() => report.value?.status === 'CLOSED')

onMounted(async () => {
  const [detail] = await Promise.all([reports.getMyReport(props.reportId), themes.fetchThemes()])
  report.value = detail
  loading.value = false
})
</script>

<template>
  <Drawer open title="Обращение" :description="report?.title" @close="emit('close')">
    <div v-if="loading" class="px-5 py-10 text-center text-[12px] text-muted">Загрузка…</div>

    <EmptyState v-else-if="!report" title="Обращение не найдено" description="Возможно, оно было удалено." />

    <div v-else class="space-y-6 px-5 py-5">
      <div class="flex flex-wrap items-center gap-2">
        <Badge :tone="reportStatusTone(report.status)" :label="labelOf(REPORT_STATUS_LABELS, report.status)" />
        <Badge :tone="priorityTone(report.priority)" :label="labelOf(PRIORITY_LABELS, report.priority)" />
        <span class="text-[11px] text-muted">№ {{ report.id.slice(0, 8) }}</span>
      </div>

      <div class="grid grid-cols-2 gap-x-4 gap-y-3 border-y border-line py-4 text-[12px]">
        <div>
          <p class="text-[9px] uppercase tracking-[0.14em] text-muted">тема</p>
          <p class="mt-1 text-ink">{{ themeName }}</p>
        </div>
        <div>
          <p class="text-[9px] uppercase tracking-[0.14em] text-muted">обратная связь</p>
          <p class="mt-1 text-ink">{{ labelOf(FEEDBACK_LABELS, report.feedbackType) }}</p>
        </div>
        <div>
          <p class="text-[9px] uppercase tracking-[0.14em] text-muted">создано</p>
          <p class="mt-1 text-ink">{{ formatDateTime(report.createdAt) }}</p>
        </div>
        <div>
          <p class="text-[9px] uppercase tracking-[0.14em] text-muted">закрыто</p>
          <p class="mt-1 text-ink">{{ report.resolvedAt ? formatDateTime(report.resolvedAt) : '—' }}</p>
        </div>
      </div>

      <div>
        <p class="mb-2 text-[9px] uppercase tracking-[0.14em] text-muted">содержание</p>
        <p class="whitespace-pre-line text-[13px] leading-6 text-ink">{{ report.content }}</p>
      </div>

      <div v-if="report.feedbackContact" class="text-[12px] text-muted">
        Контакт: <span class="text-ink">{{ report.feedbackContact }}</span>
      </div>
    </div>

    <template v-if="report" #footer>
      <div class="flex items-center justify-between gap-2">
        <Button variant="ghost" size="sm" @click="emit('delete', report)">Удалить</Button>
        <div class="flex items-center gap-2">
          <Button variant="secondary" size="sm" @click="emit('close')">Закрыть</Button>
          <Button v-if="!isClosed" size="sm" @click="emit('edit', report)">Редактировать</Button>
        </div>
      </div>
    </template>
  </Drawer>
</template>
