<script setup lang="ts">

import { extractApiError, useClients, useEmployees, useToastStore } from '@org/api-client'
import { Button, Input, Modal } from '@org/ui'
import { ref } from 'vue'

const props = defineProps<{ kind: 'client' | 'employee'; targetId: string; targetName?: string }>()
const emit = defineEmits<{ close: []; done: [] }>()

const clients = useClients()
const employees = useEmployees()
const toast = useToastStore()

const password = ref('')
const confirmation = ref('')
const error = ref<string | null>(null)
const saving = ref(false)

async function submit(): Promise<void> {
  error.value = null

  if (password.value.length < 8) {
    error.value = 'Пароль должен содержать не менее 8 символов'
    return
  }

  if (password.value !== confirmation.value) {
    error.value = 'Пароли не совпадают'
    return
  }

  saving.value = true

  try {
    const ok =
      props.kind === 'client'
        ? await clients.resetClientPassword(props.targetId, password.value)
        : await employees.resetEmployeePassword(props.targetId, password.value)

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
</script>

<template>
  <Modal open title="Сбросить пароль" :description="targetName ? `Новый пароль для ${targetName}` : undefined" size="sm" @close="emit('close')">
    <form class="space-y-4" @submit.prevent="submit">
      <Input v-model="password" label="новый пароль" type="password" autocomplete="new-password" required />
      <Input v-model="confirmation" label="повторите пароль" type="password" autocomplete="new-password" required />

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
