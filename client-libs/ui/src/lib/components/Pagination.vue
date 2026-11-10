<script setup lang="ts">
import { computed } from 'vue'

import AppIcon from './AppIcon.vue'

import type { Pagination } from '@org/api-client'

const props = defineProps<{ pagination: Pagination | null }>()
const emit = defineEmits<{ change: [page: number] }>()

const from = computed(() => {
  const p = props.pagination
  if (!p || p.total === 0) return 0
  return (p.page - 1) * p.limit + 1
})

const to = computed(() => {
  const p = props.pagination
  if (!p) return 0
  return Math.min(p.page * p.limit, p.total)
})

function step(delta: number): void {
  const p = props.pagination
  if (!p) return
  const next = p.page + delta
  if (next >= 1 && next <= p.totalPages) emit('change', next)
}
</script>

<template>
  <div v-if="pagination" class="flex flex-wrap items-center justify-between gap-3 border-t border-line px-1 py-3">
    <p class="text-[11.5px] text-muted">
      {{ from }}–{{ to }} из {{ pagination.total }}
    </p>
    <div class="flex items-center gap-1">
      <button
        type="button"
        class="flex size-7 items-center justify-center rounded-[4px] border border-line text-muted transition-colors hover:border-blush-300 hover:text-ink disabled:cursor-not-allowed disabled:opacity-40"
        :disabled="!pagination.hasPrev"
        aria-label="Предыдущая страница"
        @click="step(-1)"
      >
        <AppIcon name="chevron-left" :size="14" />
      </button>
      <span class="min-w-16 text-center text-[11.5px] text-muted">
        {{ pagination.page }} / {{ pagination.totalPages || 1 }}
      </span>
      <button
        type="button"
        class="flex size-7 items-center justify-center rounded-[4px] border border-line text-muted transition-colors hover:border-blush-300 hover:text-ink disabled:cursor-not-allowed disabled:opacity-40"
        :disabled="!pagination.hasNext"
        aria-label="Следующая страница"
        @click="step(1)"
      >
        <AppIcon name="chevron-right" :size="14" />
      </button>
    </div>
  </div>
</template>
