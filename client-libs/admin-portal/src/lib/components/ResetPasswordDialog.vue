<script setup lang="ts">

import { extractApiError, useClients, useEmployees, useToastStore } from '@org/api-client'
import { Button, Input, Modal, resetPasswordSchema } from '@org/ui'
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { ref } from 'vue'

const props = defineProps<{ kind: 'client' | 'employee'; targetId: string; targetName?: string }>()
const emit = defineEmits<{ close: []; done: [] }>()

const clients = useClients()
const employees = useEmployees()
const toast = useToastStore()

const error = ref<string | null>(null)
const saving = ref(false)

const { handleSubmit, errors, defineField } = useForm({
  validationSchema: toTypedSchema(resetPasswordSchema),
})

const [password] = defineField('password')
const [confirmation] = defineField('confirmation')

async function submit(values: Record<string, unknown>): Promise<void> {
  error.value = null
  saving.value = true

  try {
    const ok =
      props.kind === 'client'
        ? await clients.resetClientPassword(props.targetId, String(values.password))
        : await employees.resetEmployeePassword(props.targetId, String(values.password))

    if (!ok) {
      error.value = (props.kind === 'client' ? clients.error.value : employees.error.value) ?? 'Не удалось сбросить пароль'
      return
    }

    toast.success('Пароль сброшен')
    emit('done')
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
  <Modal open title="Сбросить пароль" :description="targetName ? `Новый пароль для ${targetName}` : undefined" size="sm" @close="emit('close')">
    <form class="space-y-4" @submit.prevent="onSubmit">
      <Input v-model="password" label="новый пароль" type="password" autocomplete="new-password" :error="errors.password" required />
      <Input v-model="confirmation" label="повторите пароль" type="password" autocomplete="new-password" :error="errors.confirmation" required />

      <p v-if="error" class="rounded-[4px] border border-danger/25 bg-danger/5 px-3 py-2.5 text-[12px] text-danger">
        {{ error }}
      </p>

      <div class="flex justify-end gap-2 border-t border-line pt-4">
        <Button variant="secondary" type="button" @click="emit('close')">Отмена</Button>
        <Button type="submit" :loading="saving">Сбросить</Button>
      </div>
    </form>
  </Modal>
</template>
