<script setup lang="ts">

import { extractApiError, usePayments, useToastStore } from '@org/api-client'
import { Button, Input, Modal, Select , PAYMENT_REFERENCE_OPTIONS, formatMoney } from '@org/ui'
import { computed, reactive, ref } from 'vue'

import type { PaymentReference } from '@org/enums'
import type { CardOutput } from '@org/shared-types'

const props = withDefaults(defineProps<{ cards: CardOutput[]; defaultCardId?: string }>(), {
  defaultCardId: '',
})

const emit = defineEmits<{ close: []; created: [] }>()

const payments = usePayments()
const toast = useToastStore()

const form = reactive({
  cardId: (props.defaultCardId || props.cards[0]?.id) as string | undefined,
  sum: '',
  service: '',
  reference: 'PAYMENT_FOR_GOODS_AND_SERVICES',
})

const error = ref<string | null>(null)
const saving = ref(false)

const cardOptions = computed(() =>
  props.cards.map((card) => ({
    value: card.id,
    label: `${card.cardNumber} · ${formatMoney(card.balance)}`,
  })),
)

const selectedCard = computed(() => props.cards.find((card) => card.id === form.cardId))

async function submit(): Promise<void> {
  error.value = null

  if (!form.cardId) {
    error.value = 'Выберите карту'
    return
  }

  if (!form.sum || Number(form.sum) <= 0) {
    error.value = 'Укажите сумму списания'
    return
  }

  if (!form.service.trim()) {
    error.value = 'Укажите назначение платежа'
    return
  }

  saving.value = true

  try {
    const result = await payments.writeOff(form.cardId, {
      sum: Number(form.sum).toFixed(2),
      service: form.service.trim(),
      reference: form.reference as PaymentReference,
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
  <Modal open title="Новый платёж" description="Списание средств с выбранной карты." size="md" @close="emit('close')">
    <form class="space-y-4" @submit.prevent="submit">
      <Select v-model="form.cardId" label="карта" :options="cardOptions" placeholder="выберите карту" required />
      <p v-if="selectedCard" class="-mt-2 text-[11px] text-muted">
        Доступный остаток: <span class="tabular-nums text-ink">{{ formatMoney(selectedCard.balance) }}</span>
      </p>

      <div class="grid gap-4 sm:grid-cols-2">
        <Input v-model="form.sum" label="сумма" inputmode="decimal" placeholder="0,00" required />
        <Select v-model="form.reference" label="назначение" :options="PAYMENT_REFERENCE_OPTIONS" required />
      </div>

      <Input v-model="form.service" label="сервис" placeholder="например, оплата товаров" required />

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
