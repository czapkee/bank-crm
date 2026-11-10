<script setup lang="ts">
import AppIcon from './AppIcon.vue'

withDefaults(defineProps<{ placeholder?: string; label?: string }>(), {
  placeholder: 'Поиск',
})

const model = defineModel<string>({ default: '' })
const emit = defineEmits<{ search: [value: string] }>()

function submit(): void {
  emit('search', model.value.trim())
}

function clear(): void {
  model.value = ''
  emit('search', '')
}
</script>

<template>
  <form class="relative w-full sm:w-64" role="search" @submit.prevent="submit">
    <span class="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-muted">
      <AppIcon name="search" :size="15" />
    </span>
    <input
      v-model="model"
      type="search"
      :placeholder="placeholder"
      :aria-label="label ?? placeholder"
      class="h-9 w-full rounded-[4px] border border-line bg-surface pl-8 pr-8 text-[12.5px] text-ink outline-none transition-colors placeholder:text-muted/60 focus:border-blush-400 focus:ring-2 focus:ring-blush-100"
    />
    <button
      v-if="model"
      type="button"
      class="absolute right-2 top-1/2 -translate-y-1/2 text-muted hover:text-ink"
      aria-label="Очистить поиск"
      @click="clear"
    >
      <AppIcon name="close" :size="13" />
    </button>
  </form>
</template>
