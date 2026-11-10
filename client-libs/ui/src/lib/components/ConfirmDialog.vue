<script setup lang="ts">
import { computed } from 'vue'

import Button from './Button.vue'
import Modal from './Modal.vue'

const props = withDefaults(
  defineProps<{
    open: boolean
    title?: string
    message?: string
    confirmLabel?: string
    cancelLabel?: string
    tone?: 'danger' | 'primary'
    loading?: boolean
  }>(),
  {
    title: 'Подтвердите действие',
    message: 'Данное действие нельзя отменить.',
    confirmLabel: 'Подтвердить',
    cancelLabel: 'Отмена',
    tone: 'danger',
    loading: false,
  },
)

const emit = defineEmits<{ confirm: []; cancel: [] }>()

const buttonVariant = computed(() => (props.tone === 'danger' ? 'danger' : 'primary'))
</script>

<template>
  <Modal :open="open" :title="title" size="sm" @close="emit('cancel')">
    <p class="text-[13px] leading-6 text-muted">{{ message }}</p>
    <template #footer>
      <Button variant="secondary" size="sm" @click="emit('cancel')">{{ cancelLabel }}</Button>
      <Button :variant="buttonVariant" size="sm" :loading="loading" @click="emit('confirm')">
        {{ confirmLabel }}
      </Button>
    </template>
  </Modal>
</template>
