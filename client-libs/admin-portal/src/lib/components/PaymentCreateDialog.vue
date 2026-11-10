<script setup lang="ts">

import { extractApiError, useCards, usePayments, useToastStore } from '@org/api-client'
import {
  Button,
  Input,
  Modal,
  Select,
  PAYMENT_REFERENCE_OPTIONS,
  PAYMENT_STATUS_OPTIONS,
  formatCardNumber,
  formatMoney,
  paymentSchema,
} from '@org/ui'
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { computed, ref } from 'vue'

import type { CardPaymentStatus, PaymentReference } from '@org/enums'

const props = withDefaults(defineProps<{ cardId?: string }>(), { cardId: '' })

const emit = defineEmits<{ close: []; created: [] }>()

const cards = useCards()
const payments = usePayments()
const toast = useToastStore()

const now = new Date()
const localNow = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 16)
const initialCardId = props.cardId || cards.cards.value[0]?.id || ''

const error = ref<string | null>(null)
const saving = ref(false)

const { handleSubmit, errors, defineField } = useForm({
  validationSchema: toTypedSchema(paymentSchema),
  initialValues: {
    cardId: initialCardId,
    sum: '',
    service: '',
    reference: 'PAYMENT_FOR_GOODS_AND_SERVICES',
    status: 'APPROVED',
    dateAndTime: localNow,
  },
})

const [cardIdField] = defineField('cardId')
const [sum] = defineField('sum')
const [service] = defineField('service')
const [reference] = defineField('reference')
const [status] = defineField('status')
const [dateAndTime] = defineField('dateAndTime')

const cardOptions = computed(() =>
  cards.cards.value.map((card) => ({
    value: card.id,
    label: `${formatCardNumber(card.cardNumber)} · ${formatMoney(card.balance)}`,
  })),
)

const selectedCard = computed(() => cards.cards.value.find((card) => card.id === cardIdField.value))

async function submit(values: Record<string, unknown>): Promise<void> {
  error.value = null
  saving.value = true

  try {
    const result = await payments.createPayment(String(values.cardId), {
      sum: Number(values.sum).toFixed(2),
      service: String(values.service ?? '').trim(),
      reference: String(values.reference) as PaymentReference,
      status: String(values.status) as CardPaymentStatus,
      dateAndTime: new Date(String(values.dateAndTime)).toISOString(),
    })

    if (!result) {
      error.value = payments.error.value ?? 'Не удалось создать платёж'
      return
    }

    toast.success('Платёж создан')
    emit('created')
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
  <Modal open title="Новый платёж" description="Операция по карте клиента." size="md" @close="emit('close')">
    <form class="space-y-4" @submit.prevent="onSubmit">
      <Select v-model="cardIdField" label="карта" :options="cardOptions" placeholder="выберите карту" :error="errors.cardId" required />
      <p v-if="selectedCard" class="-mt-2 text-[11px] text-muted">
        Остаток: <span class="tabular-nums text-ink">{{ formatMoney(selectedCard.balance) }}</span>
      </p>

      <div class="grid gap-4 sm:grid-cols-2">
        <Input v-model="sum" label="сумма" inputmode="decimal" placeholder="0,00" :error="errors.sum" required />
        <Select v-model="reference" label="назначение" :options="PAYMENT_REFERENCE_OPTIONS" :error="errors.reference" required />
      </div>

      <div class="grid gap-4 sm:grid-cols-2">
        <Input v-model="dateAndTime" label="дата и время" type="datetime-local" :error="errors.dateAndTime" required />
        <Select v-model="status" label="статус" :options="PAYMENT_STATUS_OPTIONS" :error="errors.status" required />
      </div>

      <Input v-model="service" label="сервис" placeholder="например, оплата товаров" :error="errors.service" required />

      <p v-if="error" class="rounded-[4px] border border-danger/25 bg-danger/5 px-3 py-2.5 text-[12px] text-danger">
        {{ error }}
      </p>

      <div class="flex justify-end gap-2 border-t border-line pt-4">
        <Button variant="secondary" type="button" @click="emit('close')">Отмена</Button>
        <Button type="submit" :loading="saving">Создать</Button>
      </div>
    </form>
  </Modal>
</template>
