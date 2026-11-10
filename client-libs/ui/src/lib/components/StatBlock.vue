<script setup lang="ts">
withDefaults(
  defineProps<{ label: string; value: string | number; hint?: string; accent?: boolean }>(),
  { hint: '', accent: false },
)
</script>

<template>
  <div class="border-l border-line pl-4 first:border-l-0 first:pl-0">
    <p class="text-[10px] font-medium uppercase tracking-[0.14em] text-muted">{{ label }}</p>
    <p
      :class="[
        'mt-2 text-[28px] font-semibold leading-none tracking-[-0.03em] tabular-nums',
        accent ? 'text-blush-600' : 'text-ink',
      ]"
    >
      {{ value }}
    </p>
    <p v-if="hint" class="mt-1.5 text-[11px] text-muted">{{ hint }}</p>
  </div>
</template>
