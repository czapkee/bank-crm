<script setup lang="ts">

import { extractApiError, useThemes, useToastStore } from '@org/api-client'
import { Button, Input, Modal, Select, Textarea, themeSchema } from '@org/ui'
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { computed, ref } from 'vue'

import type { ThemeOutput } from '@org/shared-types'

const props = withDefaults(defineProps<{ theme?: ThemeOutput | null }>(), { theme: null })

const emit = defineEmits<{ close: []; saved: [] }>()

const store = useThemes()
const toast = useToastStore()

const theme = props.theme
const isCreate = !theme

const saving = ref(false)
const error = ref<string | null>(null)

const { handleSubmit, errors, defineField } = useForm({
  validationSchema: toTypedSchema(themeSchema),
  initialValues: {
    name: theme?.name ?? '',
    description: theme?.description ?? '',
    parentId: theme?.parentId ?? '',
  },
})

const [name] = defineField('name')
const [description] = defineField('description')
const [parentId] = defineField('parentId')

const parentOptions = computed(() =>
  store.themes.value
    .filter((item) => !item.parentId && item.id !== theme?.id)
    .map((item) => ({ value: item.id, label: item.name })),
)

async function submit(values: Record<string, unknown>): Promise<void> {
  error.value = null
  saving.value = true

  try {
    const payload = {
      name: String(values.name ?? '').trim(),
      description: String(values.description ?? '').trim() || undefined,
      parentId: String(values.parentId ?? '') || undefined,
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

const onSubmit = handleSubmit(submit)
</script>

<template>
  <Modal
    open
    :title="isCreate ? 'Новая тема' : 'Редактирование темы'"
    description="Темы формируют дерево обращений: родительская тема и подтемы."
    size="md"
    @close="emit('close')"
  >
    <form class="space-y-4" @submit.prevent="onSubmit">
      <Input v-model="name" label="название" :error="errors.name" required />
      <Select v-model="parentId" label="родительская тема" :options="parentOptions" placeholder="верхний уровень" />
      <Textarea v-model="description" label="описание" :rows="4" :error="errors.description" />

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
