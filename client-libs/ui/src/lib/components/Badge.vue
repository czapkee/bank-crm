<script setup lang="ts">
import { computed } from 'vue'

import type { Tone } from '../utils/labels.js'

const props = withDefaults(
  defineProps<{ tone?: Tone; dot?: boolean; soft?: boolean; label?: string }>(),
  { tone: 'neutral', dot: true, soft: false, label: '' },
)

const solid: Record<Tone, string> = {
  neutral: 'bg-[#dedcd5] text-[#3d3c38]',
  success: 'bg-[#5f8b68] text-white',
  warning: 'bg-[#c18a4d] text-white',
  danger: 'bg-[#b05a52] text-white',
  info: 'bg-[#5e7d9e] text-white',
}

const softMap: Record<Tone, string> = {
  neutral: 'bg-[#efeee9] text-[#52514c]',
  success: 'bg-[#e3efe6] text-[#326547]',
  warning: 'bg-[#f6ebda] text-[#85531f]',
  danger: 'bg-[#f7e1df] text-[#8d3a34]',
  info: 'bg-[#e5edf5] text-[#3e5f80]',
}

const classes = computed(() => [
  'inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10.5px] font-medium leading-4 whitespace-nowrap',
  props.soft ? softMap[props.tone] : solid[props.tone],
])
</script>

<template>
  <span :class="classes">
    <span v-if="dot" class="size-1.5 rounded-full bg-current opacity-75" />
    <slot>{{ label }}</slot>
  </span>
</template>
