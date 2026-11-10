<script setup lang="ts">

import { extractApiError, useClients, useEmployees, useToastStore } from '@org/api-client'
import {
  Button,
  Checkbox,
  Input,
  Modal,
  Select,
  ROLE_OPTIONS,
  employeeCreateSchema,
  personCreateSchema,
  personEditSchema,
} from '@org/ui'
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { computed, ref } from 'vue'

import type { ClientOutput, EmployeeUserEntity } from '@org/shared-types'
import type { PersonFormValues } from '@org/ui'
import type { z } from 'zod'

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

const schema = (
  props.kind === 'client'
    ? isCreate
      ? personCreateSchema
      : personEditSchema
    : isCreate
      ? employeeCreateSchema
      : personEditSchema
) as unknown as z.ZodType<PersonFormValues>

const { handleSubmit, errors, defineField } = useForm<PersonFormValues>({
  validationSchema: toTypedSchema(schema),
  initialValues: {
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
  },
})

const [email] = defineField('email')
const [password] = defineField('password')
const [confirmationPassword] = defineField('confirmationPassword')
const [surname] = defineField('surname')
const [name] = defineField('name')
const [fatherName] = defineField('fatherName')
const [phoneNumber] = defineField('phoneNumber')
const [isResident] = defineField('isResident')
const [identifCode] = defineField('identifCode')
const [numPass] = defineField('numPass')
const [codeWord] = defineField('codeWord')
const [address] = defineField('address')
const [role] = defineField('role')

const title = computed(() => {
  const who = props.kind === 'client' ? 'клиента' : 'сотрудника'
  return isCreate ? `Новый ${who}` : `Редактирование ${who}`
})

const description = computed(() =>
  props.kind === 'employee' && isCreate
    ? 'Сотрудник получит доступ после регистрации по указанному email.'
    : 'Заполните контактные и паспортные данные.',
)

async function submit(values: Record<string, unknown>): Promise<void> {
  error.value = null
  saving.value = true

  try {
    const base = {
      email: String(values.email ?? '').trim(),
      surname: String(values.surname ?? '').trim(),
      name: String(values.name ?? '').trim(),
      fatherName: String(values.fatherName ?? '').trim() || undefined,
      phoneNumber: String(values.phoneNumber ?? '').trim(),
      isResident: Boolean(values.isResident),
      identifCode: String(values.identifCode ?? '').trim(),
      numPass: String(values.numPass ?? '').trim(),
      codeWord: String(values.codeWord ?? '').trim(),
      address: String(values.address ?? '').trim(),
    }

    const result =
      props.kind === 'client'
        ? isCreate
          ? await clients.createClient({
              ...base,
              password: String(values.password ?? ''),
              confirmationPassword: String(values.confirmationPassword ?? ''),
            })
          : await clients.updateClient((entity as ClientOutput).id, base)
        : isCreate
          ? await employees.createEmployee({ ...base, role: String(values.role ?? 'EMPLOYEE') as never })
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

const onSubmit = handleSubmit(submit)
</script>

<template>
  <Modal open :title="title" :description="description" size="lg" @close="emit('close')">
    <form class="space-y-4" @submit.prevent="onSubmit">
      <div class="grid gap-4 sm:grid-cols-3">
        <Input v-model="surname" label="фамилия" :error="errors.surname" required />
        <Input v-model="name" label="имя" :error="errors.name" required />
        <Input v-model="fatherName" label="отчество" :error="errors.fatherName" />
      </div>

      <div class="grid gap-4 sm:grid-cols-2">
        <Input v-model="email" label="email" type="email" autocomplete="off" :error="errors.email" required />
        <Input v-model="phoneNumber" label="телефон" placeholder="+375291234567" :error="errors.phoneNumber" required />
      </div>

      <div v-if="isCreate && kind === 'client'" class="grid gap-4 sm:grid-cols-2">
        <Input
          v-model="password"
          label="пароль"
          type="password"
          autocomplete="new-password"
          :error="errors.password"
          required
        />
        <Input
          v-model="confirmationPassword"
          label="повторите пароль"
          type="password"
          autocomplete="new-password"
          :error="errors.confirmationPassword"
          required
        />
      </div>

      <div class="grid gap-4 sm:grid-cols-2">
        <Input v-model="identifCode" label="идентификационный номер" :error="errors.identifCode" required />
        <Input v-model="numPass" label="номер паспорта" :error="errors.numPass" required />
        <Input v-model="codeWord" label="кодовое слово" :error="errors.codeWord" required />
        <Select
          v-if="kind === 'employee' && isCreate"
          v-model="role"
          label="роль"
          :options="ROLE_OPTIONS"
          :error="errors.role"
          required
        />
      </div>

      <Input v-model="address" label="адрес регистрации" :error="errors.address" required />
      <Checkbox v-model="isResident" label="резидент Республики Беларусь" />

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
