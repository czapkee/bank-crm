<script setup lang="ts">
import { computed } from 'vue'

import AppIcon from './AppIcon.vue'

import type { SelectOption } from '../types.js'

const props = withDefaults(
  defineProps<{
    label?: string
    error?: string | null
    hint?: string
    options: SelectOption[]
    placeholder?: string
    required?: boolean
    disabled?: boolean
  }>(),
  { required: false, disabled: false, placeholder: '' },
)

const model = defineModel<string | number | undefined>({ default: undefined })

const current = computed(() => (model.value === undefined || model.value === null ? '' : String(model.value)))

function onChange(event: Event): void {
  const raw = (event.target as HTMLSelectElement).value
  const match = props.options.find((option) => String(option.value) === raw)

  model.value = match ? match.value : raw === '' ? undefined : raw
}

const classes = computed(() => [
  'h-9 w-full appearance-none rounded-[4px] border bg-surface px-2.5 pr-8 text-[13px] text-ink outline-none transition-colors disabled:bg-paper disabled:text-muted',
  props.error
    ? 'border-danger/60 focus:border-danger'
    : 'border-line focus:border-blush-400 focus:ring-2 focus:ring-blush-100',
])
</script>

<template>
  <label class="block">
    <span v-if="label" class="mb-1.5 block text-[10px] font-medium uppercase tracking-[0.12em] text-muted">
      {{ label }}<span v-if="required" class="ml-0.5 text-blush-600">*</span>
    </span>
    <span class="relative block">
      <select :value="current" :required="required" :disabled="disabled" :class="classes" @change="onChange">
        <option v-if="placeholder" value="">{{ placeholder }}</option>
        <option v-for="option in options" :key="option.value" :value="option.value">
          {{ option.label }}
        </option>
      </select>
      <AppIcon
        name="chevron-down"
        :size="14"
        class="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-muted"
      />
    </span>
    <span v-if="error" class="mt-1 block text-[11px] text-danger">{{ error }}</span>
    <span v-else-if="hint" class="mt-1 block text-[11px] text-muted">{{ hint }}</span>
  </label>
</template>
