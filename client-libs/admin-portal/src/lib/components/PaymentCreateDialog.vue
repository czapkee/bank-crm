<script setup lang="ts">

import { extractApiError, useCards, usePayments, useToastStore } from '@org/api-client'
import { Button, Input, Modal, Select , PAYMENT_REFERENCE_OPTIONS, PAYMENT_STATUS_OPTIONS, formatMoney } from '@org/ui'
import { computed, reactive, ref } from 'vue'

import type { CardPaymentStatus, PaymentReference } from '@org/enums'

const props = withDefaults(defineProps<{ cardId?: string }>(), { cardId: '' })

const emit = defineEmits<{ close: []; created: [] }>()

const cards = useCards()
const payments = usePayments()
const toast = useToastStore()

const now = new Date()
const localNow = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 16)

const form = reactive({
  cardId: props.cardId || '',
  sum: '',
  service: '',
  reference: 'PAYMENT_FOR_GOODS_AND_SERVICES',
  status: 'APPROVED',
  dateAndTime: localNow,
})

const error = ref<string | null>(null)
const saving = ref(false)

const cardOptions = computed(() =>
  cards.cards.value.map((card) => ({
    value: card.id,
    label: `${formatCardNumber(card.cardNumber)} · ${formatMoney(card.balance)}`,
  })),
)

const selectedCard = computed(() => cards.cards.value.find((card) => card.id === form.cardId))

async function submit(): Promise<void> {
  error.value = null

  if (!form.cardId) {
    error.value = 'Выберите карту'
    return
  }

  if (!form.sum || Number(form.sum) <= 0) {
    error.value = 'Укажите сумму платежа'
    return
  }

  if (!form.service.trim()) {
    error.value = 'Укажите сервис'
    return
  }

  saving.value = true

  try {
    const result = await payments.createPayment(form.cardId, {
      sum: Number(form.sum).toFixed(2),
      service: form.service.trim(),
      reference: form.reference as PaymentReference,
      status: form.status as CardPaymentStatus,
      dateAndTime: new Date(form.dateAndTime).toISOString(),
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
</script>

<template>
  <Modal open title="Новый платёж" description="Операция по карте клиента." size="md" @close="emit('close')">
    <form class="space-y-4" @submit.prevent="submit">
      <Select v-model="form.cardId" label="карта" :options="cardOptions" placeholder="выберите карту" required />
      <p v-if="selectedCard" class="-mt-2 text-[11px] text-muted">
        Остаток: <span class="tabular-nums text-ink">{{ formatMoney(selectedCard.balance) }}</span>
      </p>

      <div class="grid gap-4 sm:grid-cols-2">
        <Input v-model="form.sum" label="сумма" inputmode="decimal" placeholder="0,00" required />
        <Select v-model="form.reference" label="назначение" :options="PAYMENT_REFERENCE_OPTIONS" required />
      </div>

      <div class="grid gap-4 sm:grid-cols-2">
        <Input v-model="form.dateAndTime" label="дата и время" type="datetime-local" required />
        <Select v-model="form.status" label="статус" :options="PAYMENT_STATUS_OPTIONS" required />
      </div>

      <Input v-model="form.service" label="сервис" placeholder="например, оплата товаров" required />

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
