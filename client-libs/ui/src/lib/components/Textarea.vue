<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    label?: string
    error?: string | null
    hint?: string
    placeholder?: string
    rows?: number
    required?: boolean
    disabled?: boolean
  }>(),
  { rows: 5, required: false, disabled: false },
)

const model = defineModel<string>({ default: '' })

const classes = computed(() => [
  'w-full resize-y rounded-[4px] border bg-surface px-3 py-2.5 text-[13px] leading-6 text-ink outline-none transition-colors placeholder:text-muted/60 disabled:bg-paper',
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
    <textarea
      v-model="model"
      :rows="rows"
      :placeholder="placeholder"
      :required="required"
      :disabled="disabled"
      :class="classes"
    />
    <span v-if="error" class="mt-1 block text-[11px] text-danger">{{ error }}</span>
    <span v-else-if="hint" class="mt-1 block text-[11px] text-muted">{{ hint }}</span>
  </label>
</template>
