<script setup lang="ts">

import { extractApiError, useReports, useThemes, useToastStore } from '@org/api-client'
import { Button, Input, Modal, Select, Textarea } from '@org/ui'
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

const parentId = ref<string | undefined>(props.report?.themeId ?? props.initialThemeId ?? undefined)
const themeId = ref<string | undefined>(undefined)
const content = ref(props.report?.content ?? '')
const feedbackType = ref<string>(props.report?.feedbackType ?? 'NOT_REQUIRED')
const feedbackContact = ref(props.report?.feedbackContact ?? '')

const parentOptions = computed(() =>
  themesStore.themes.value
    .filter((theme) => !theme.parentId)
    .map((theme) => ({ value: theme.id, label: theme.name })),
)

const children = computed(() => themesStore.themes.value.filter((theme) => theme.parentId === parentId.value))

const themeOptions = computed(() => children.value.map((theme) => ({ value: theme.id, label: theme.name })))

const effectiveThemeId = computed(() => themeId.value ?? parentId.value)

const feedbackNeedsContact = computed(() => feedbackType.value === 'EMAIL' || feedbackType.value === 'PHONE_NUMBER')

const title = computed(() => {
  if (props.report) return props.report.title
  const selectedParent = themesStore.themes.value.find((theme) => theme.id === parentId.value)
  const selectedChild = themesStore.themes.value.find((theme) => theme.id === themeId.value)
  return selectedChild?.name ?? selectedParent?.name ?? 'Обращение'
})

onMounted(async () => {
  await themesStore.fetchThemes()
  loading.value = false

  if (props.report?.themeId) {
    const theme = themesStore.themes.value.find((item) => item.id === props.report?.themeId)
    if (theme?.parentId) {
      parentId.value = theme.parentId
      themeId.value = theme.id
    } else {
      parentId.value = theme?.id
    }
  }
})

function onParentChange(): void {
  themeId.value = children.value[0]?.id
}

async function submit(): Promise<void> {
  error.value = null

  if (!effectiveThemeId.value) {
    error.value = 'Выберите тему обращения'
    return
  }

  if (content.value.trim().length < 3) {
    error.value = 'Опишите ситуацию подробнее'
    return
  }

  if (feedbackNeedsContact.value && feedbackContact.value.trim().length === 0) {
    error.value = 'Укажите контакт для обратной связи'
    return
  }

  saving.value = true

  try {
    const payload = {
      title: title.value,
      content: content.value.trim(),
      themeId: effectiveThemeId.value,
      feedbackType: feedbackType.value as ReportFeedback,
      feedbackContact: feedbackNeedsContact.value ? feedbackContact.value.trim() : undefined,
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
</script>

<template>
  <Modal
    open
    :title="report ? 'Редактирование обращения' : 'Новое обращение'"
    description="Опишите ситуацию — обращение попадёт в работу к сотруднику банка."
    size="lg"
    @close="emit('close')"
  >
    <form class="space-y-5" @submit.prevent="submit">
      <div v-if="loading" class="py-8 text-center text-[12px] text-muted">Загрузка тем…</div>

      <div v-else class="space-y-3">
        <div class="grid gap-3 sm:grid-cols-[130px_1fr] sm:items-center">
          <span class="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted">тема</span>
          <Select
            v-model="parentId"
            :options="parentOptions"
            placeholder="выберите тему"
            @update:model-value="onParentChange"
          />
        </div>

        <div v-if="themeOptions.length > 0" class="grid gap-3 sm:grid-cols-[130px_1fr] sm:items-center">
          <span class="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted">подтема</span>
          <Select v-model="themeId" :options="themeOptions" placeholder="выберите подтему" />
        </div>

        <div class="grid gap-3 sm:grid-cols-[130px_1fr] sm:items-center">
          <span class="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted">обратная связь</span>
          <Select
            v-model="feedbackType"
            :options="[
              { value: 'NOT_REQUIRED', label: 'не требуется' },
              { value: 'PHONE_NUMBER', label: 'телефон' },
              { value: 'EMAIL', label: 'email' },
              { value: 'OTHER', label: 'другое' },
            ]"
          />
        </div>

        <div v-if="feedbackNeedsContact" class="grid gap-3 sm:grid-cols-[130px_1fr] sm:items-center">
          <span class="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted">контакт</span>
          <Input
            v-model="feedbackContact"
            :type="feedbackType === 'EMAIL' ? 'email' : 'text'"
            placeholder="как с вами связаться"
          />
        </div>
      </div>

      <Textarea v-model="content" label="текст обращения" placeholder="текст обращения…" :rows="8" required />

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
