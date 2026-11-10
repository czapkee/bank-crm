<script setup lang="ts">

import { extractApiError, useClients, useEmployees, useToastStore } from '@org/api-client'
import { Button, Checkbox, Input, Modal, Select , ROLE_OPTIONS } from '@org/ui'
import { computed, reactive, ref } from 'vue'

import type { ClientOutput, EmployeeUserEntity } from '@org/shared-types'

const props = withDefaults(
  defineProps<{
    kind: 'client' | 'employee'
    mode: 'create' | 'edit'
    entity?: ClientOutput | EmployeeUserEntity | null
  }>(),
  { entity: null },
)

const emit = defineEmits<{ close: []; saved: [] }>()

const clients = useClients()
const employees = useEmployees()
const toast = useToastStore()

const saving = ref(false)
const error = ref<string | null>(null)

const entity = props.entity
const isCreate = props.mode === 'create'

const form = reactive({
  email: entity?.email ?? '',
  password: '',
  confirmationPassword: '',
  surname: entity?.surname ?? '',
  name: entity?.name ?? '',
  fatherName: entity?.fatherName ?? '',
  phoneNumber: entity?.phoneNumber ?? '',
  isResident: entity?.isResident ?? true,
  identifCode: entity?.identifCode ?? '',
  numPass: entity?.numPass ?? '',
  codeWord: entity?.codeWord ?? '',
  address: entity?.address ?? '',
  role: (entity && 'role' in entity ? entity.role : 'EMPLOYEE') as string,
})

const title = computed(() => {
  const who = props.kind === 'client' ? 'клиента' : 'сотрудника'
  return isCreate ? `Новый ${who}` : `Редактирование ${who}`
})

const description = computed(() =>
  props.kind === 'employee' && isCreate
    ? 'Сотрудник получит доступ после регистрации по указанному email.'
    : 'Заполните контактные и паспортные данные.',
)

async function submit(): Promise<void> {
  error.value = null

  if (isCreate && props.kind === 'client' && form.password !== form.confirmationPassword) {
    error.value = 'Пароли не совпадают'
    return
  }

  saving.value = true

  try {
    const base = {
      email: form.email.trim(),
      surname: form.surname.trim(),
      name: form.name.trim(),
      fatherName: form.fatherName.trim() || undefined,
      phoneNumber: form.phoneNumber.trim(),
      isResident: form.isResident,
      identifCode: form.identifCode.trim(),
      numPass: form.numPass.trim(),
      codeWord: form.codeWord.trim(),
      address: form.address.trim(),
    }

    const result =
      props.kind === 'client'
        ? isCreate
          ? await clients.createClient({
              ...base,
              password: form.password,
              confirmationPassword: form.confirmationPassword,
            })
          : await clients.updateClient((entity as ClientOutput).id, base)
        : isCreate
          ? await employees.createEmployee({ ...base, role: form.role })
          : await employees.updateEmployee((entity as EmployeeUserEntity).id, base)

    if (!result) {
      error.value = (props.kind === 'client' ? clients.error.value : employees.error.value) ?? 'Не удалось сохранить данные'
      return
    }

    toast.success(isCreate ? 'Запись создана' : 'Изменения сохранены')
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
  <Modal open :title="title" :description="description" size="lg" @close="emit('close')">
    <form class="space-y-4" @submit.prevent="submit">
      <div class="grid gap-4 sm:grid-cols-3">
        <Input v-model="form.surname" label="фамилия" required />
        <Input v-model="form.name" label="имя" required />
        <Input v-model="form.fatherName" label="отчество" />
      </div>

      <div class="grid gap-4 sm:grid-cols-2">
        <Input v-model="form.email" label="email" type="email" autocomplete="off" required />
        <Input v-model="form.phoneNumber" label="телефон" placeholder="+375291234567" required />
      </div>

      <div v-if="isCreate && kind === 'client'" class="grid gap-4 sm:grid-cols-2">
        <Input v-model="form.password" label="пароль" type="password" autocomplete="new-password" required />
        <Input
          v-model="form.confirmationPassword"
          label="повторите пароль"
          type="password"
          autocomplete="new-password"
          required
        />
      </div>

      <div class="grid gap-4 sm:grid-cols-2">
        <Input v-model="form.identifCode" label="идентификационный номер" required />
        <Input v-model="form.numPass" label="номер паспорта" required />
        <Input v-model="form.codeWord" label="кодовое слово" required />
        <Select v-if="kind === 'employee' && isCreate" v-model="form.role" label="роль" :options="ROLE_OPTIONS" required />
      </div>

      <Input v-model="form.address" label="адрес регистрации" required />
      <Checkbox v-model="form.isResident" label="резидент Республики Беларусь" />

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
