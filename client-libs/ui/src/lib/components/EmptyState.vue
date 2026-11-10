<script setup lang="ts">
import AppIcon from './AppIcon.vue'

import type { IconName } from './AppIcon.vue'

withDefaults(defineProps<{ icon?: IconName; title?: string; description?: string }>(), {
  icon: 'file',
  title: 'Пока пусто',
  description: '',
})
</script>

<template>
  <div class="flex flex-col items-center justify-center px-6 py-12 text-center">
    <span class="mb-3 flex size-10 items-center justify-center rounded-full bg-paper text-muted">
      <AppIcon :name="icon" :size="19" />
    </span>
    <p class="text-[13px] font-medium text-ink">{{ title }}</p>
    <p v-if="description" class="mt-1 max-w-sm text-[12px] leading-5 text-muted">{{ description }}</p>
    <slot />
  </div>
</template>
