<script setup lang="ts">

import { extractApiError, useAuthStore, useToastStore } from '@org/api-client'
import { Button, Checkbox, Input, Modal, profileSchema } from '@org/ui'
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { ref } from 'vue'

const auth = useAuthStore()
const toast = useToastStore()

const emit = defineEmits<{ close: []; saved: [] }>()

const profile = auth.profile
const error = ref<string | null>(null)
const saving = ref(false)

const { handleSubmit, errors, defineField } = useForm({
  validationSchema: toTypedSchema(profileSchema),
  initialValues: {
    name: profile?.name ?? '',
    surname: profile?.surname ?? '',
    fatherName: profile?.fatherName ?? '',
    phoneNumber: profile?.phoneNumber ?? '',
    isResident: profile?.isResident ?? true,
    identifCode: profile?.identifCode ?? '',
    numPass: profile?.numPass ?? '',
    codeWord: profile?.codeWord ?? '',
    address: profile?.address ?? '',
  },
})

const [name] = defineField('name')
const [surname] = defineField('surname')
const [fatherName] = defineField('fatherName')
const [phoneNumber] = defineField('phoneNumber')
const [isResident] = defineField('isResident')
const [identifCode] = defineField('identifCode')
const [numPass] = defineField('numPass')
const [codeWord] = defineField('codeWord')
const [address] = defineField('address')

async function save(values: Record<string, unknown>): Promise<void> {
  error.value = null
  saving.value = true

  try {
    await auth.updateProfile({
      name: String(values.name ?? '').trim(),
      surname: String(values.surname ?? '').trim(),
      fatherName: String(values.fatherName ?? '').trim(),
      phoneNumber: String(values.phoneNumber ?? '').trim(),
      isResident: Boolean(values.isResident),
      identifCode: String(values.identifCode ?? '').trim(),
      numPass: String(values.numPass ?? '').trim(),
      codeWord: String(values.codeWord ?? '').trim(),
      address: String(values.address ?? '').trim(),
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

const onSubmit = handleSubmit(save)
</script>

<template>
  <Modal open title="Профиль" description="Данные видны сотрудникам банка при работе с обращениями." size="lg" @close="emit('close')">
    <form class="space-y-4" @submit.prevent="onSubmit">
      <div class="grid gap-4 sm:grid-cols-3">
        <Input v-model="surname" label="фамилия" :error="errors.surname" required />
        <Input v-model="name" label="имя" :error="errors.name" required />
        <Input v-model="fatherName" label="отчество" :error="errors.fatherName" />
      </div>
      <div class="grid gap-4 sm:grid-cols-2">
        <Input v-model="phoneNumber" label="телефон" placeholder="+375291234567" :error="errors.phoneNumber" required />
        <Input v-model="identifCode" label="идентификационный номер" :error="errors.identifCode" required />
        <Input v-model="numPass" label="номер паспорта" :error="errors.numPass" required />
        <Input v-model="codeWord" label="кодовое слово" :error="errors.codeWord" required />
      </div>
      <Input v-model="address" label="адрес регистрации" :error="errors.address" required />
      <Checkbox v-model="isResident" label="резидент Республики Беларусь" />

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
