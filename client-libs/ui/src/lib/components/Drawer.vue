<script setup lang="ts">
import { onBeforeUnmount, onMounted } from 'vue'

import AppIcon from './AppIcon.vue'

const props = withDefaults(
  defineProps<{ open: boolean; title?: string; description?: string }>(),
  {},
)

const emit = defineEmits<{ close: [] }>()

function onKeydown(event: KeyboardEvent): void {
  if (event.key === 'Escape' && props.open) emit('close')
}

onMounted(() => document.addEventListener('keydown', onKeydown))
onBeforeUnmount(() => document.removeEventListener('keydown', onKeydown))
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-150 ease-out"
      enter-from-class="opacity-0"
      leave-active-class="transition duration-100 ease-in"
      leave-to-class="opacity-0"
    >
      <div
        v-if="open"
        class="fixed inset-0 z-50 flex justify-end bg-ink/40 backdrop-blur-[1px]"
        @mousedown.self="emit('close')"
      >
        <aside class="flex h-full w-full max-w-[520px] flex-col border-l border-line bg-surface shadow-[-24px_0_60px_rgba(20,20,18,0.14)]">
          <header class="flex items-start justify-between gap-4 border-b border-line px-5 py-4">
            <div class="min-w-0">
              <slot name="header">
                <h2 class="truncate text-[18px] font-semibold tracking-[-0.01em] text-ink">{{ title }}</h2>
                <p v-if="description" class="mt-1 text-[12px] text-muted">{{ description }}</p>
              </slot>
            </div>
            <button
              type="button"
              class="-mr-1 rounded-[4px] p-1.5 text-muted transition-colors hover:bg-paper hover:text-ink"
              aria-label="Закрыть"
              @click="emit('close')"
            >
              <AppIcon name="close" :size="17" />
            </button>
          </header>

          <div class="min-h-0 flex-1 overflow-y-auto">
            <slot />
          </div>

          <footer v-if="$slots.footer" class="border-t border-line px-5 py-3.5">
            <slot name="footer" />
          </footer>
        </aside>
      </div>
    </Transition>
  </Teleport>
</template>
