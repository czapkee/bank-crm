<script setup lang="ts">
import { computed, useId } from 'vue'

const props = withDefaults(
  defineProps<{
    label?: string
    error?: string | null
    hint?: string
    type?: string
    placeholder?: string
    required?: boolean
    disabled?: boolean
    autocomplete?: string
    inputmode?: 'text' | 'numeric' | 'decimal' | 'email' | 'tel' | 'search' | 'url'
    min?: string | number
    max?: string | number
    step?: string | number
  }>(),
  { type: 'text', required: false, disabled: false },
)

const model = defineModel<string | number>({ default: '' })
const id = useId()

const inputClasses = computed(() => [
  'h-9 w-full rounded-[4px] border bg-surface px-2.5 text-[13px] text-ink outline-none transition-colors placeholder:text-muted/60 disabled:bg-paper disabled:text-muted',
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
    <input
      :id="id"
      v-model="model"
      :type="type"
      :placeholder="placeholder"
      :required="required"
      :disabled="disabled"
      :autocomplete="autocomplete"
      :inputmode="inputmode"
      :min="min"
      :max="max"
      :step="step"
      :class="inputClasses"
    />
    <span v-if="error" class="mt-1 block text-[11px] text-danger">{{ error }}</span>
    <span v-else-if="hint" class="mt-1 block text-[11px] text-muted">{{ hint }}</span>
  </label>
</template>
