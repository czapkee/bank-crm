<script setup lang="ts">

import { extractApiError, useEmployees, useReports, useThemes, useToastStore } from '@org/api-client'
import { Button, Input, Modal, Select, Textarea ,
  FEEDBACK_OPTIONS,
  PRIORITY_OPTIONS,
  REPORT_STATUS_OPTIONS,
} from '@org/ui'
import { computed, onMounted, reactive, ref } from 'vue'

import type { ReportFeedback, ReportPriority, ReportStatus } from '@org/enums'
import type { ReportOutput } from '@org/shared-types'

const props = defineProps<{ report: ReportOutput; canAssign: boolean }>()
const emit = defineEmits<{ close: []; saved: [] }>()

const store = useReports()
const themes = useThemes()
const employees = useEmployees()
const toast = useToastStore()

const saving = ref(false)
const error = ref<string | null>(null)

const form = reactive({
  title: props.report.title,
  content: props.report.content,
  feedbackContact: props.report.feedbackContact ?? '',
  themeId: props.report.themeId ?? '',
  status: props.report.status as string,
  priority: props.report.priority as string,
  feedbackType: props.report.feedbackType as string,
  assignedToId: props.report.assignedToId ?? '',
})

const themeOptions = computed(() =>
  themes.themes.value.map((theme) => ({
    value: theme.id,
    label: theme.parentId ? `— ${theme.name}` : theme.name,
  })),
)

const employeeOptions = computed(() =>
  employees.employees.value.map((employee) => ({
    value: employee.id,
    label: [employee.surname, employee.name].filter(Boolean).join(' '),
  })),
)

onMounted(async () => {
  await themes.fetchAdminThemes({ limit: 100 })
  if (props.canAssign) {
    try {
      await employees.fetchEmployees({ limit: 100 })
    } catch {
      /* руководитель отдела может не иметь доступа к списку сотрудников */
    }
  }
})

async function submit(): Promise<void> {
  error.value = null

  if (form.title.trim().length < 3) {
    error.value = 'Укажите заголовок обращения'
    return
  }

  if (form.content.trim().length < 3) {
    error.value = 'Добавьте текст обращения'
    return
  }

  saving.value = true

  try {
    const result = await store.updateReport(props.report.id, {
      title: form.title.trim(),
      content: form.content.trim(),
      feedbackContact: form.feedbackContact.trim() || undefined,
      themeId: form.themeId || undefined,
      status: form.status as ReportStatus,
      priority: form.priority as ReportPriority,
      feedbackType: form.feedbackType as ReportFeedback,
      assignedToId: props.canAssign && form.assignedToId ? form.assignedToId : undefined,
    })

    if (!result) {
      error.value = store.error.value ?? 'Не удалось сохранить обращение'
      return
    }

    toast.success('Обращение обновлено')
    emit('saved')
    emit('close')
  } catch (cause) {
    error.value = extractApiError(cause)
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <Modal open title="Редактирование обращения" size="lg" @close="emit('close')">
    <form class="space-y-4" @submit.prevent="submit">
      <Input v-model="form.title" label="заголовок" required />

      <div class="grid gap-4 sm:grid-cols-2">
        <Select v-model="form.themeId" label="тема" :options="themeOptions" placeholder="без темы" />
        <Select v-model="form.feedbackType" label="обратная связь" :options="FEEDBACK_OPTIONS" />
      </div>

      <div class="grid gap-4 sm:grid-cols-2">
        <Input v-model="form.feedbackContact" label="контакт" placeholder="телефон или email" />
        <Select v-if="canAssign" v-model="form.assignedToId" label="исполнитель" :options="employeeOptions" placeholder="не назначен" />
      </div>

      <div class="grid gap-4 sm:grid-cols-2">
        <Select v-model="form.status" label="статус" :options="REPORT_STATUS_OPTIONS" required />
        <Select v-model="form.priority" label="приоритет" :options="PRIORITY_OPTIONS" required />
      </div>

      <Textarea v-model="form.content" label="текст обращения" :rows="7" required />

      <p v-if="error" class="rounded-[4px] border border-danger/25 bg-danger/5 px-3 py-2.5 text-[12px] text-danger">
        {{ error }}
      </p>

      <div class="flex justify-end gap-2 border-t border-line pt-4">
        <Button variant="secondary" type="button" @click="emit('close')">Отмена</Button>
        <Button type="submit" :loading="saving">Сохранить</Button>
      </div>
    </form>
  </Modal>
</template>
