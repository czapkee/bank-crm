<script setup lang="ts">

import { extractApiError, useCards, useClients, useToastStore } from '@org/api-client'
import { Button, Input, Modal, Select , CARD_STATUS_OPTIONS } from '@org/ui'
import { computed, onMounted, reactive, ref } from 'vue'

import type { CardOutput } from '@org/shared-types'

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

const card = props.card
const isCreate = props.mode === 'create'

const form = reactive({
  cardNumber: card?.cardNumber ?? '',
  accountNumber: card?.accountNumber ?? '',
  dateOfExpire: card?.dateOfExpire ? card.dateOfExpire.slice(0, 10) : '',
  balance: card?.balance ?? '0.00',
  status: (card?.status ?? 'CREATED') as string,
  userId: card?.userId ?? props.userId,
})

const clientOptions = computed(() =>
  clients.clients.value.map((client) => ({
    value: client.id,
    label: `${[client.surname, client.name].filter(Boolean).join(' ')} · ${client.email}`,
  })),
)

const title = computed(() => (isCreate ? 'Новая карта' : 'Редактирование карты'))

onMounted(async () => {
  if (isCreate) await clients.fetchClients({ limit: 100 })
})

async function submit(): Promise<void> {
  error.value = null

  if (!form.cardNumber.trim() || !form.accountNumber.trim() || !form.dateOfExpire) {
    error.value = 'Заполните номер карты, счёт и срок действия'
    return
  }

  if (isCreate && !form.userId) {
    error.value = 'Выберите клиента'
    return
  }

  saving.value = true

  try {
    const base = {
      accountNumber: form.accountNumber.trim(),
      dateOfExpire: new Date(form.dateOfExpire).toISOString(),
      balance: String(form.balance || '0'),
    }

    const result = isCreate
      ? await store.createCard({
          ...base,
          cardNumber: form.cardNumber.trim(),
          status: form.status as never,
          userId: form.userId,
        })
      : await store.updateCard((card as CardOutput).id, {
          ...base,
          status: form.status as never,
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
</script>

<template>
  <Modal open :title="title" description="Номер карты, счёт и срок действия." size="lg" @close="emit('close')">
    <form class="space-y-4" @submit.prevent="submit">
      <div class="grid gap-4 sm:grid-cols-2">
        <Input v-model="form.cardNumber" label="номер карты" placeholder="0000 0000 0000 0000" :disabled="!isCreate" required />
        <Input v-model="form.accountNumber" label="номер счета" placeholder="BY00 XXXX" required />
      </div>

      <div class="grid gap-4 sm:grid-cols-3">
        <Input v-model="form.dateOfExpire" label="срок действия" type="date" required />
        <Input v-model="form.balance" label="баланс" inputmode="decimal" required />
        <Select v-model="form.status" label="статус" :options="CARD_STATUS_OPTIONS" required />
      </div>

      <Select
        v-if="isCreate && clientOptions.length > 0"
        v-model="form.userId"
        label="клиент"
        :options="clientOptions"
        placeholder="выберите клиента"
        required
      />
      <Input
        v-else-if="isCreate"
        v-model="form.userId"
        label="идентификатор клиента"
        hint="Список клиентов недоступен для вашей роли — укажите UUID клиента вручную."
        required
      />

      <p v-if="error" class="rounded-[4px] border border-danger/25 bg-danger/5 px-3 py-2.5 text-[12px] text-danger">
        {{ error }}
      </p>

      <div class="flex justify-end gap-2 border-t border-line pt-4">
        <Button variant="secondary" type="button" @click="emit('close')">Отмена</Button>
        <Button type="submit" :loading="saving">{{ isCreate ? 'Выпустить' : 'Сохранить' }}</Button>
      </div>
    </form>
  </Modal>
</template>
