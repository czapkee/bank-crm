<script setup lang="ts">
import type { TabItem } from '../types.js'

defineProps<{ items: TabItem[] }>()
const model = defineModel<string>({ required: true })
</script>

<template>
  <div class="flex items-center gap-5 border-b border-line">
    <button
      v-for="item in items"
      :key="item.value"
      type="button"
      :class="[
        '-mb-px border-b-2 pb-2 text-[12.5px] font-medium transition-colors',
        model === item.value
          ? 'border-blush-500 text-ink'
          : 'border-transparent text-muted hover:text-ink',
      ]"
      @click="model = item.value"
    >
      {{ item.label }}
    </button>
  </div>
</template>
