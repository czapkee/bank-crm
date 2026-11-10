<script setup lang="ts">

import { extractApiError, useReports, useThemes, useToastStore } from '@org/api-client'
import { Button, Input, Modal, Select, Textarea, reportClientSchema } from '@org/ui'
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { computed, onMounted, ref } from 'vue'

import type { ReportFeedback } from '@org/enums'
import type { ReportOutput } from '@org/shared-types'

const props = defineProps<{ report?: ReportOutput | null; initialThemeId?: string }>()
const emit = defineEmits<{ close: []; saved: [] }>()

const reports = useReports()
const themesStore = useThemes()
const toast = useToastStore()

const loading = ref(true)
const saving = ref(false)
const error = ref<string | null>(null)

const parentId = ref<string>(props.report?.themeId ?? props.initialThemeId ?? '')

const { handleSubmit, errors, defineField, setFieldValue } = useForm({
  validationSchema: toTypedSchema(reportClientSchema),
  initialValues: {
    parentId: '',
    themeId: '',
    content: props.report?.content ?? '',
    feedbackType: (props.report?.feedbackType ?? 'NOT_REQUIRED') as string,
    feedbackContact: props.report?.feedbackContact ?? '',
  },
})

const [parentIdField] = defineField('parentId')
const [themeId] = defineField('themeId')
const [content] = defineField('content')
const [feedbackType] = defineField('feedbackType')
const [feedbackContact] = defineField('feedbackContact')

const parentOptions = computed(() =>
  themesStore.themes.value
    .filter((theme) => !theme.parentId)
    .map((theme) => ({ value: theme.id, label: theme.name })),
)

const children = computed(() => themesStore.themes.value.filter((theme) => theme.parentId === parentIdField.value))

const themeOptions = computed(() => children.value.map((theme) => ({ value: theme.id, label: theme.name })))

const feedbackNeedsContact = computed(() => feedbackType.value === 'EMAIL' || feedbackType.value === 'PHONE_NUMBER')

const title = computed(() => {
  if (props.report) return props.report.title
  const selectedParent = themesStore.themes.value.find((theme) => theme.id === parentIdField.value)
  const selectedChild = themesStore.themes.value.find((theme) => theme.id === themeId.value)
  return selectedChild?.name ?? selectedParent?.name ?? 'Обращение'
})

onMounted(async () => {
  await themesStore.fetchThemes()
  loading.value = false

  if (props.report?.themeId) {
    const theme = themesStore.themes.value.find((item) => item.id === props.report?.themeId)
    if (theme?.parentId) {
      setFieldValue('parentId', theme.parentId)
      setFieldValue('themeId', theme.id)
    } else if (theme) {
      setFieldValue('parentId', theme.id)
    }
  } else if (parentId.value) {
    setFieldValue('parentId', parentId.value)
  }
})

function onParentChange(): void {
  const next = children.value[0]?.id ?? ''
  setFieldValue('themeId', next)
}

async function submit(values: Record<string, unknown>): Promise<void> {
  error.value = null
  saving.value = true

  try {
    const effectiveThemeId = String(values.themeId ?? '') || String(values.parentId ?? '')

    const payload = {
      title: title.value,
      content: String(values.content ?? '').trim(),
      themeId: effectiveThemeId,
      feedbackType: String(values.feedbackType) as ReportFeedback,
      feedbackContact: feedbackNeedsContact.value ? String(values.feedbackContact ?? '').trim() : undefined,
    }

    const result = props.report
      ? await reports.updateMyReport(props.report.id, payload)
      : await reports.createReport(payload)

    if (!result) {
      error.value = reports.error.value ?? 'Не удалось сохранить обращение'
      return
    }

    toast.success(props.report ? 'Обращение обновлено' : 'Обращение отправлено')
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
  <Modal
    open
    :title="report ? 'Редактирование обращения' : 'Новое обращение'"
    description="Опишите ситуацию — обращение попадёт в работу к сотруднику банка."
    size="lg"
    @close="emit('close')"
  >
    <form class="space-y-5" @submit.prevent="onSubmit">
      <div v-if="loading" class="py-8 text-center text-[12px] text-muted">Загрузка тем…</div>

      <div v-else class="space-y-3">
        <div class="grid gap-3 sm:grid-cols-[130px_1fr] sm:items-start">
          <span class="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted sm:pt-3">тема</span>
          <Select
            v-model="parentIdField"
            :options="parentOptions"
            placeholder="выберите тему"
            :error="errors.parentId"
            @update:model-value="onParentChange"
          />
        </div>

        <div v-if="themeOptions.length > 0" class="grid gap-3 sm:grid-cols-[130px_1fr] sm:items-start">
          <span class="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted sm:pt-3">подтема</span>
          <Select v-model="themeId" :options="themeOptions" placeholder="выберите подтему" />
        </div>

        <div class="grid gap-3 sm:grid-cols-[130px_1fr] sm:items-start">
          <span class="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted sm:pt-3">обратная связь</span>
          <Select
            v-model="feedbackType"
            :options="[
              { value: 'NOT_REQUIRED', label: 'не требуется' },
              { value: 'PHONE_NUMBER', label: 'телефон' },
              { value: 'EMAIL', label: 'email' },
              { value: 'OTHER', label: 'другое' },
            ]"
            :error="errors.feedbackType"
          />
        </div>

        <div v-if="feedbackNeedsContact" class="grid gap-3 sm:grid-cols-[130px_1fr] sm:items-start">
          <span class="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted sm:pt-3">контакт</span>
          <Input
            v-model="feedbackContact"
            :type="feedbackType === 'EMAIL' ? 'email' : 'text'"
            placeholder="как с вами связаться"
            :error="errors.feedbackContact"
          />
        </div>
      </div>

      <Textarea v-model="content" label="текст обращения" placeholder="текст обращения…" :rows="8" :error="errors.content" required />

      <p v-if="error" class="rounded-[4px] border border-danger/25 bg-danger/5 px-3 py-2.5 text-[12px] text-danger">
        {{ error }}
      </p>

      <div class="flex justify-end gap-2 border-t border-line pt-4">
        <Button variant="secondary" type="button" @click="emit('close')">Отмена</Button>
        <Button type="submit" :loading="saving">{{ report ? 'Сохранить' : 'Отправить' }}</Button>
      </div>
    </form>
  </Modal>
</template>
