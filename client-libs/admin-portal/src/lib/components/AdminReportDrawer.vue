<script setup lang="ts">

import { useReports, useThemes, useToastStore } from '@org/api-client'
import { Badge, Button, Drawer, EmptyState ,
  FEEDBACK_LABELS,
  PRIORITY_LABELS,
  REPORT_STATUS_LABELS,
  REPORT_STATUS_OPTIONS,
  formatDateTime,
  labelOf,
  priorityTone,
  reportStatusTone,
} from '@org/ui'
import { computed, onMounted, ref } from 'vue'

import type { ReportOutput } from '@org/shared-types'

const props = defineProps<{ reportId: string; canEdit: boolean }>()
const emit = defineEmits<{
  close: []
  edit: [report: ReportOutput]
  delete: [report: ReportOutput]
  updated: []
}>()

const store = useReports()
const themes = useThemes()
const toast = useToastStore()

const report = ref<ReportOutput | null>(null)
const loading = ref(true)
const acting = ref(false)

const themeName = computed(() => {
  if (!report.value?.themeId) return '—'
  return themes.themes.value.find((theme) => theme.id === report.value?.themeId)?.name ?? '—'
})

const isClosed = computed(() => report.value?.status === 'CLOSED')

async function reload(): Promise<void> {
  report.value = await store.getReport(props.reportId)
}

onMounted(async () => {
  await Promise.all([reload(), themes.fetchAdminThemes({ limit: 100 })])
  loading.value = false
})

async function changeStatus(next: string): Promise<void> {
  if (!report.value) return
  acting.value = true
  const result = await store.changeReportStatus(report.value.id, next as never)
  acting.value = false

  if (result) {
    toast.success('Статус обновлён')
    report.value = result
    emit('updated')
  } else {
    toast.error(store.error.value ?? 'Не удалось изменить статус')
  }
}

async function resolve(): Promise<void> {
  if (!report.value) return
  acting.value = true
  const result = await store.resolveReport(report.value.id)
  acting.value = false

  if (result) {
    toast.success('Обращение закрыто')
    report.value = result
    emit('updated')
  } else {
    toast.error(store.error.value ?? 'Не удалось закрыть обращение')
  }
}
</script>

<template>
  <Drawer open title="Обращение" :description="report?.title" @close="emit('close')">
    <div v-if="loading" class="px-5 py-10 text-center text-[12px] text-muted">Загрузка…</div>

    <EmptyState v-else-if="!report" title="Обращение не найдено" description="Возможно, оно было удалено." />

    <div v-else class="space-y-6 px-5 py-5">
      <div class="flex flex-wrap items-center gap-2">
        <Badge :tone="reportStatusTone(report.status)" :label="labelOf(REPORT_STATUS_LABELS, report.status)" />
        <Badge :tone="priorityTone(report.priority)" :label="labelOf(PRIORITY_LABELS, report.priority)" soft />
        <span class="font-mono text-[10px] text-muted">№ {{ report.id.slice(0, 8) }}</span>
      </div>

      <dl class="grid grid-cols-2 gap-x-4 gap-y-4 border-y border-line py-4 text-[12px]">
        <div>
          <dt class="text-[9px] uppercase tracking-[0.14em] text-muted">тема</dt>
          <dd class="mt-1 text-ink">{{ themeName }}</dd>
        </div>
        <div>
          <dt class="text-[9px] uppercase tracking-[0.14em] text-muted">обратная связь</dt>
          <dd class="mt-1 text-ink">{{ labelOf(FEEDBACK_LABELS, report.feedbackType) }}</dd>
        </div>
        <div>
          <dt class="text-[9px] uppercase tracking-[0.14em] text-muted">создано</dt>
          <dd class="mt-1 text-ink">{{ formatDateTime(report.createdAt) }}</dd>
        </div>
        <div>
          <dt class="text-[9px] uppercase tracking-[0.14em] text-muted">закрыто</dt>
          <dd class="mt-1 text-ink">{{ report.resolvedAt ? formatDateTime(report.resolvedAt) : '—' }}</dd>
        </div>
        <div class="col-span-2">
          <dt class="text-[9px] uppercase tracking-[0.14em] text-muted">контакт</dt>
          <dd class="mt-1 text-ink">{{ report.feedbackContact || '—' }}</dd>
        </div>
        <div class="col-span-2">
          <dt class="text-[9px] uppercase tracking-[0.14em] text-muted">исполнитель</dt>
          <dd class="mt-1 font-mono text-[11px] text-ink">{{ report.assignedToId ? report.assignedToId.slice(0, 8) : 'не назначен' }}</dd>
        </div>
      </dl>

      <div>
        <p class="mb-2 text-[9px] uppercase tracking-[0.14em] text-muted">содержание</p>
        <p class="whitespace-pre-line text-[13px] leading-6 text-ink">{{ report.content }}</p>
      </div>

      <div v-if="canEdit" class="space-y-2 border border-line bg-paper/60 p-3">
        <p class="text-[9px] uppercase tracking-[0.14em] text-muted">сменить статус</p>
        <div class="flex flex-wrap gap-1.5">
          <button
            v-for="option in REPORT_STATUS_OPTIONS"
            :key="option.value"
            type="button"
            :disabled="acting || option.value === report.status"
            class="rounded-[3px] border px-2 py-1 text-[10.5px] transition-colors disabled:opacity-40"
            :class="option.value === report.status ? 'border-ink bg-ink text-white' : 'border-line bg-surface text-ink hover:border-blush-300'"
            @click="changeStatus(option.value)"
          >
            {{ option.label }}
          </button>
        </div>
        <Button v-if="!isClosed" size="sm" variant="secondary" class="mt-1" :loading="acting" @click="resolve">
          Закрыть обращение
        </Button>
      </div>
    </div>

    <template v-if="report" #footer>
      <div class="flex items-center justify-between gap-2">
        <Button v-if="canEdit" variant="ghost" size="sm" @click="emit('delete', report)">Удалить</Button>
        <span v-else />
        <div class="flex items-center gap-2">
          <Button variant="secondary" size="sm" @click="emit('close')">Закрыть</Button>
          <Button v-if="canEdit" size="sm" @click="emit('edit', report)">Редактировать</Button>
        </div>
      </div>
    </template>
  </Drawer>
</template>
