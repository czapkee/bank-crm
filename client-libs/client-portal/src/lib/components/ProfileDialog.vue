<script setup lang="ts">

import { extractApiError, useAuthStore, useToastStore } from '@org/api-client'
import { Button, Checkbox, Input, Modal } from '@org/ui'
import { reactive, ref } from 'vue'

const auth = useAuthStore()
const toast = useToastStore()

const emit = defineEmits<{ close: []; saved: [] }>()

const profile = auth.profile
const error = ref<string | null>(null)
const saving = ref(false)

const form = reactive({
  name: profile?.name ?? '',
  surname: profile?.surname ?? '',
  fatherName: profile?.fatherName ?? '',
  phoneNumber: profile?.phoneNumber ?? '',
  isResident: profile?.isResident ?? true,
  identifCode: profile?.identifCode ?? '',
  numPass: profile?.numPass ?? '',
  codeWord: profile?.codeWord ?? '',
  address: profile?.address ?? '',
})

async function save(): Promise<void> {
  error.value = null
  saving.value = true

  try {
    await auth.updateProfile({
      name: form.name,
      surname: form.surname,
      fatherName: form.fatherName,
      phoneNumber: form.phoneNumber,
      isResident: form.isResident,
      identifCode: form.identifCode,
      numPass: form.numPass,
      codeWord: form.codeWord,
      address: form.address,
    })
    toast.success('Профиль обновлён')
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
  <Modal open title="Профиль" description="Данные видны сотрудникам банка при работе с обращениями." size="lg" @close="emit('close')">
    <form class="space-y-4" @submit.prevent="save">
      <div class="grid gap-4 sm:grid-cols-3">
        <Input v-model="form.surname" label="фамилия" required />
        <Input v-model="form.name" label="имя" required />
        <Input v-model="form.fatherName" label="отчество" />
      </div>
      <div class="grid gap-4 sm:grid-cols-2">
        <Input v-model="form.phoneNumber" label="телефон" placeholder="+375291234567" required />
        <Input v-model="form.identifCode" label="идентификационный номер" required />
        <Input v-model="form.numPass" label="номер паспорта" required />
        <Input v-model="form.codeWord" label="кодовое слово" required />
      </div>
      <Input v-model="form.address" label="адрес регистрации" required />
      <Checkbox v-model="form.isResident" label="резидент Республики Беларусь" />

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
