<script setup lang="ts">
withDefaults(defineProps<{ title?: string; description?: string; padded?: boolean }>(), {
  padded: false,
})
</script>

<template>
  <section class="min-w-0 border border-line bg-surface">
    <header
      v-if="title || $slots.actions"
      class="flex flex-wrap items-center justify-between gap-3 border-b border-line px-4 py-3"
    >
      <div>
        <h2 class="text-[13px] font-semibold tracking-[-0.01em] text-ink">{{ title }}</h2>
        <p v-if="description" class="mt-0.5 text-[11px] text-muted">{{ description }}</p>
      </div>
      <slot name="actions" />
    </header>
    <div :class="padded ? 'p-4' : ''">
      <slot />
    </div>
  </section>
</template>
