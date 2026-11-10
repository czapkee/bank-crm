<script setup lang="ts">
import { computed } from 'vue'

import type { ButtonSize, ButtonVariant } from '../types.js'

const props = withDefaults(
  defineProps<{
    variant?: ButtonVariant
    size?: ButtonSize
    type?: 'button' | 'submit' | 'reset'
    disabled?: boolean
    loading?: boolean
    block?: boolean
  }>(),
  { variant: 'primary', size: 'md', type: 'button', disabled: false, loading: false, block: false },
)

const variants: Record<ButtonVariant, string> = {
  primary: 'bg-blush-500 text-white hover:bg-blush-600 disabled:bg-blush-300',
  secondary: 'border border-line bg-surface text-ink hover:border-blush-300 hover:bg-blush-50',
  ghost: 'text-ink hover:bg-ink/5',
  danger: 'bg-danger text-white hover:bg-danger/90',
  dark: 'bg-ink text-white hover:bg-ink/85',
}

const sizes: Record<ButtonSize, string> = {
  sm: 'h-8 px-3 text-[12px] gap-1.5',
  md: 'h-9 px-4 text-[13px] gap-2',
}

const classes = computed(() => [
  'inline-flex items-center justify-center rounded-[4px] font-medium tracking-[0.01em] transition-colors duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blush-400 disabled:cursor-not-allowed disabled:opacity-70',
  variants[props.variant],
  sizes[props.size],
  props.block ? 'w-full' : '',
])
</script>

<template>
  <button :type="type" :class="classes" :disabled="disabled || loading">
    <span
      v-if="loading"
      class="size-3.5 animate-spin rounded-full border-2 border-current border-r-transparent"
    />
    <slot />
  </button>
</template>
