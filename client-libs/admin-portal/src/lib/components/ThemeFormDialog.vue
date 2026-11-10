<script setup lang="ts">

import { extractApiError, useThemes, useToastStore } from '@org/api-client'
import { Button, Input, Modal, Select, Textarea } from '@org/ui'
import { computed, reactive, ref } from 'vue'

import type { ThemeOutput } from '@org/shared-types'

const props = withDefaults(defineProps<{ theme?: ThemeOutput | null }>(), { theme: null })

const emit = defineEmits<{ close: []; saved: [] }>()

const store = useThemes()
const toast = useToastStore()

const theme = props.theme
const isCreate = !theme

const form = reactive({
  name: theme?.name ?? '',
  description: theme?.description ?? '',
  parentId: theme?.parentId ?? '',
})

const saving = ref(false)
const error = ref<string | null>(null)

const parentOptions = computed(() =>
  store.themes.value
    .filter((item) => !item.parentId && item.id !== theme?.id)
    .map((item) => ({ value: item.id, label: item.name })),
)

async function submit(): Promise<void> {
  error.value = null

  if (form.name.trim().length < 2) {
    error.value = 'Укажите название темы'
    return
  }

  saving.value = true

  try {
    const payload = {
      name: form.name.trim(),
      description: form.description.trim() || undefined,
      parentId: form.parentId || undefined,
    }

    const result = isCreate
      ? await store.createTheme(payload)
      : await store.updateTheme((theme as ThemeOutput).id, payload)

    if (!result) {
      error.value = store.error.value ?? 'Не удалось сохранить тему'
      return
    }

    toast.success(isCreate ? 'Тема создана' : 'Тема обновлена')
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
    :title="isCreate ? 'Новая тема' : 'Редактирование темы'"
    description="Темы формируют дерево обращений: родительская тема и подтемы."
    size="md"
    @close="emit('close')"
  >
    <form class="space-y-4" @submit.prevent="submit">
      <Input v-model="form.name" label="название" required />
      <Select v-model="form.parentId" label="родительская тема" :options="parentOptions" placeholder="верхний уровень" />
      <Textarea v-model="form.description" label="описание" :rows="4" />

      <p v-if="error" class="rounded-[4px] border border-danger/25 bg-danger/5 px-3 py-2.5 text-[12px] text-danger">
        {{ error }}
      </p>

      <div class="flex justify-end gap-2 border-t border-line pt-4">
        <Button variant="secondary" type="button" @click="emit('close')">Отмена</Button>
        <Button type="submit" :loading="saving">{{ isCreate ? 'Создать' : 'Сохранить' }}</Button>
      </div>
    </form>
  </Modal>
</template>
