<script setup lang="ts">

import { extractApiError, useEmployees, useReports, useThemes, useToastStore } from '@org/api-client'
import { Button, Input, Modal, Select, Textarea,
  FEEDBACK_OPTIONS,
  PRIORITY_OPTIONS,
  REPORT_STATUS_OPTIONS,
  reportEditSchema,
} from '@org/ui'
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { computed, onMounted, ref } from 'vue'

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

const { handleSubmit, errors, defineField } = useForm({
  validationSchema: toTypedSchema(reportEditSchema),
  initialValues: {
    title: props.report.title,
    content: props.report.content,
    feedbackContact: props.report.feedbackContact ?? '',
    themeId: props.report.themeId ?? '',
    status: props.report.status as string,
    priority: props.report.priority as string,
    feedbackType: props.report.feedbackType as string,
    assignedToId: props.report.assignedToId ?? '',
  },
})

const [title] = defineField('title')
const [content] = defineField('content')
const [feedbackContact] = defineField('feedbackContact')
const [themeId] = defineField('themeId')
const [status] = defineField('status')
const [priority] = defineField('priority')
const [feedbackType] = defineField('feedbackType')
const [assignedToId] = defineField('assignedToId')

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

async function submit(values: Record<string, unknown>): Promise<void> {
  error.value = null
  saving.value = true

  try {
    const result = await store.updateReport(props.report.id, {
      title: String(values.title ?? '').trim(),
      content: String(values.content ?? '').trim(),
      feedbackContact: String(values.feedbackContact ?? '').trim() || undefined,
      themeId: String(values.themeId ?? '') || undefined,
      status: String(values.status) as ReportStatus,
      priority: String(values.priority) as ReportPriority,
      feedbackType: String(values.feedbackType) as ReportFeedback,
      assignedToId: props.canAssign && values.assignedToId ? String(values.assignedToId) : undefined,
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

const onSubmit = handleSubmit(submit)
</script>

<template>
  <Modal open title="Редактирование обращения" size="lg" @close="emit('close')">
    <form class="space-y-4" @submit.prevent="onSubmit">
      <Input v-model="title" label="заголовок" :error="errors.title" required />

      <div class="grid gap-4 sm:grid-cols-2">
        <Select v-model="themeId" label="тема" :options="themeOptions" placeholder="без темы" />
        <Select v-model="feedbackType" label="обратная связь" :options="FEEDBACK_OPTIONS" :error="errors.feedbackType" />
      </div>

      <div class="grid gap-4 sm:grid-cols-2">
        <Input v-model="feedbackContact" label="контакт" placeholder="телефон или email" :error="errors.feedbackContact" />
        <Select v-if="canAssign" v-model="assignedToId" label="исполнитель" :options="employeeOptions" placeholder="не назначен" />
      </div>

      <div class="grid gap-4 sm:grid-cols-2">
        <Select v-model="status" label="статус" :options="REPORT_STATUS_OPTIONS" :error="errors.status" required />
        <Select v-model="priority" label="приоритет" :options="PRIORITY_OPTIONS" :error="errors.priority" required />
      </div>

      <Textarea v-model="content" label="текст обращения" :rows="7" :error="errors.content" required />

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
