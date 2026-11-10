<script setup lang="ts">

import { extractApiError, usePayments, useToastStore } from '@org/api-client'
import { Button, Input, Modal, Select, PAYMENT_REFERENCE_OPTIONS, formatMoney, paymentWriteOffSchema } from '@org/ui'
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { computed, ref } from 'vue'

import type { PaymentReference } from '@org/enums'
import type { CardOutput } from '@org/shared-types'

const props = withDefaults(defineProps<{ cards: CardOutput[]; defaultCardId?: string }>(), {
  defaultCardId: '',
})

const emit = defineEmits<{ close: []; created: [] }>()

const payments = usePayments()
const toast = useToastStore()

const error = ref<string | null>(null)
const saving = ref(false)

const { handleSubmit, errors, defineField } = useForm({
  validationSchema: toTypedSchema(paymentWriteOffSchema),
  initialValues: {
    cardId: props.defaultCardId || props.cards[0]?.id || '',
    sum: '',
    service: '',
    reference: 'PAYMENT_FOR_GOODS_AND_SERVICES',
  },
})

const [cardId] = defineField('cardId')
const [sum] = defineField('sum')
const [service] = defineField('service')
const [reference] = defineField('reference')

const cardOptions = computed(() =>
  props.cards.map((card) => ({
    value: card.id,
    label: `${card.cardNumber} · ${formatMoney(card.balance)}`,
  })),
)

const selectedCard = computed(() => props.cards.find((card) => card.id === cardId.value))

async function submit(values: Record<string, unknown>): Promise<void> {
  error.value = null
  saving.value = true

  try {
    const result = await payments.writeOff(String(values.cardId), {
      sum: Number(values.sum).toFixed(2),
      service: String(values.service ?? '').trim(),
      reference: String(values.reference) as PaymentReference,
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
  <Modal open title="Новый платёж" description="Списание средств с выбранной карты." size="md" @close="emit('close')">
    <form class="space-y-4" @submit.prevent="onSubmit">
      <Select v-model="cardId" label="карта" :options="cardOptions" placeholder="выберите карту" :error="errors.cardId" required />
      <p v-if="selectedCard" class="-mt-2 text-[11px] text-muted">
        Доступный остаток: <span class="tabular-nums text-ink">{{ formatMoney(selectedCard.balance) }}</span>
      </p>

      <div class="grid gap-4 sm:grid-cols-2">
        <Input v-model="sum" label="сумма" inputmode="decimal" placeholder="0,00" :error="errors.sum" required />
        <Select v-model="reference" label="назначение" :options="PAYMENT_REFERENCE_OPTIONS" :error="errors.reference" required />
      </div>

      <Input v-model="service" label="сервис" placeholder="например, оплата товаров" :error="errors.service" required />

      <p v-if="error" class="rounded-[4px] border border-danger/25 bg-danger/5 px-3 py-2.5 text-[12px] text-danger">
        {{ error }}
      </p>

      <div class="flex justify-end gap-2 border-t border-line pt-4">
        <Button variant="secondary" type="button" @click="emit('close')">Отмена</Button>
        <Button type="submit" :loading="saving">Списать</Button>
      </div>
    </form>
  </Modal>
</template>
