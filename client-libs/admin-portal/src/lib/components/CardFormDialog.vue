<script setup lang="ts">

import { extractApiError, useCards, useClients, useToastStore } from '@org/api-client'
import {
  Button,
  Input,
  Modal,
  Select,
  CARD_STATUS_OPTIONS,
  cardCreateSchema,
  formatPersonName,
} from '@org/ui'
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { onMounted, ref } from 'vue'

import ClientPickerDialog from './ClientPickerDialog.vue'

import type { CardOutput, ClientOutput } from '@org/shared-types'
import type { CardFormValues } from '@org/ui'

const props = withDefaults(
  defineProps<{ mode: 'create' | 'edit'; card?: CardOutput | null; userId?: string }>(),
  { card: null, userId: '' },
)

const emit = defineEmits<{ close: []; saved: [] }>()

const store = useCards()
const clients = useClients()
const toast = useToastStore()

const saving = ref(false)
const error = ref<string | null>(null)
const pickerOpen = ref(false)
const selectedClient = ref<ClientOutput | null>(null)

const card = props.card
const isCreate = props.mode === 'create'

const { handleSubmit, errors, defineField, setFieldValue } = useForm<CardFormValues>({
  validationSchema: toTypedSchema(cardCreateSchema),
  initialValues: {
    cardNumber: card?.cardNumber ?? '',
    accountNumber: card?.accountNumber ?? '',
    dateOfExpire: card?.dateOfExpire ? card.dateOfExpire.slice(0, 10) : '',
    balance: card?.balance ?? '0.00',
    status: (card?.status ?? 'CREATED') as string,
    userId: card?.userId ?? props.userId,
  },
})

const [cardNumber] = defineField('cardNumber')
const [accountNumber] = defineField('accountNumber')
const [dateOfExpire] = defineField('dateOfExpire')
const [balance] = defineField('balance')
const [status] = defineField('status')
const [userIdField] = defineField('userId')

const title = isCreate ? 'Новая карта' : 'Редактирование карты'

onMounted(async () => {
  if (!isCreate || !props.userId) return

  const client = await clients.getClient(props.userId)

  if (client) selectedClient.value = client
})

function chooseClient(client: ClientOutput): void {
  selectedClient.value = client
  setFieldValue('userId', client.id)
  pickerOpen.value = false
}

async function submit(values: Record<string, unknown>): Promise<void> {
  error.value = null
  saving.value = true

  try {
    const base = {
      accountNumber: String(values.accountNumber ?? '').trim(),
      dateOfExpire: new Date(String(values.dateOfExpire)).toISOString(),
      balance: String(values.balance || '0'),
    }

    const result = isCreate
      ? await store.createCard({
          ...base,
          cardNumber: String(values.cardNumber ?? '').trim(),
          status: String(values.status) as never,
          userId: String(values.userId ?? ''),
        })
      : await store.updateCard((card as CardOutput).id, {
          ...base,
          status: String(values.status) as never,
        })

    if (!result) {
      error.value = store.error.value ?? 'Не удалось сохранить карту'
      return
    }

    toast.success(isCreate ? 'Карта выпущена' : 'Карта обновлена')
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
  <Modal open :title="title" description="Номер карты, счёт и срок действия." size="lg" @close="emit('close')">
    <form class="space-y-4" @submit.prevent="onSubmit">
      <div class="grid gap-4 sm:grid-cols-2">
        <Input
          v-model="cardNumber"
          label="номер карты"
          placeholder="0000 0000 0000 0000"
          :disabled="!isCreate"
          :error="errors.cardNumber"
          required
        />
        <Input v-model="accountNumber" label="номер счета" placeholder="BY00 XXXX" :error="errors.accountNumber" required />
      </div>

      <div class="grid gap-4 sm:grid-cols-3">
        <Input v-model="dateOfExpire" label="срок действия" type="date" :error="errors.dateOfExpire" required />
        <Input v-model="balance" label="баланс" inputmode="decimal" :error="errors.balance" required />
        <Select v-model="status" label="статус" :options="CARD_STATUS_OPTIONS" :error="errors.status" required />
      </div>

      <div v-if="isCreate">
        <span class="mb-1.5 block text-[10px] font-medium uppercase tracking-[0.12em] text-muted">
          клиент<span class="ml-0.5 text-blush-600">*</span>
        </span>
        <div class="flex items-center justify-between gap-3 border border-line bg-surface px-3 py-2.5">
          <div v-if="selectedClient" class="min-w-0">
            <p class="truncate text-[12.5px] font-medium text-ink">{{ formatPersonName(selectedClient) }}</p>
            <p class="mt-0.5 truncate text-[11px] text-muted">{{ selectedClient.email }}</p>
          </div>
          <div v-else class="min-w-0">
            <p class="text-[12.5px] text-muted">Клиент не выбран</p>
            <p class="mt-0.5 font-mono text-[10px] text-muted">{{ userIdField || 'выберите из списка' }}</p>
          </div>
          <Button type="button" variant="secondary" size="sm" @click="pickerOpen = true">
            {{ selectedClient ? 'Изменить' : 'Выбрать' }}
          </Button>
        </div>
        <span v-if="errors.userId" class="mt-1 block text-[11px] text-danger">{{ errors.userId }}</span>
      </div>

      <p v-if="error" class="rounded-[4px] border border-danger/25 bg-danger/5 px-3 py-2.5 text-[12px] text-danger">
        {{ error }}
      </p>

      <div class="flex justify-end gap-2 border-t border-line pt-4">
        <Button variant="secondary" type="button" @click="emit('close')">Отмена</Button>
        <Button type="submit" :loading="saving">{{ isCreate ? 'Выпустить' : 'Сохранить' }}</Button>
      </div>
    </form>

    <ClientPickerDialog
      v-if="pickerOpen"
      :selected-id="userIdField"
      @close="pickerOpen = false"
      @select="chooseClient"
    />
  </Modal>
</template>
