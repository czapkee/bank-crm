<script setup lang="ts">
defineProps<{ label?: string; disabled?: boolean }>()
const model = defineModel<boolean>({ default: false })
</script>

<template>
  <label class="inline-flex cursor-pointer items-center gap-2 text-[13px] text-ink">
    <input
      v-model="model"
      type="checkbox"
      :disabled="disabled"
      class="size-4 rounded-[3px] border border-line accent-blush-500"
    />
    <span v-if="label">{{ label }}</span>
  </label>
</template>
