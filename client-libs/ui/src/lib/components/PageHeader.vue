<script setup lang="ts">
withDefaults(defineProps<{ title: string; eyebrow?: string; description?: string }>(), {})
</script>

<template>
  <header class="flex flex-col gap-4 border-b border-line pb-5 sm:flex-row sm:items-end sm:justify-between">
    <div class="min-w-0">
      <p v-if="eyebrow" class="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted">
        {{ eyebrow }}
      </p>
      <h1 class="text-[26px] font-semibold leading-tight tracking-[-0.025em] text-ink">{{ title }}</h1>
      <p v-if="description" class="mt-2 max-w-2xl text-[12.5px] leading-5 text-muted">{{ description }}</p>
    </div>
    <div v-if="$slots.actions" class="flex flex-wrap items-center gap-2">
      <slot name="actions" />
    </div>
  </header>
</template>
