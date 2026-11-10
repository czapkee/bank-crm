<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted } from 'vue'

import AppIcon from './AppIcon.vue'

const props = withDefaults(
  defineProps<{
    open: boolean
    title?: string
    description?: string
    size?: 'sm' | 'md' | 'lg' | 'xl'
    closeable?: boolean
  }>(),
  { size: 'md', closeable: true },
)

const emit = defineEmits<{ close: [] }>()

const sizes = {
  sm: 'max-w-sm',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
}

const panelClass = computed(() => sizes[props.size])

function onKeydown(event: KeyboardEvent): void {
  if (event.key === 'Escape' && props.open && props.closeable) emit('close')
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
        class="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-ink/45 p-4 backdrop-blur-[1px] sm:p-8"
        @mousedown.self="closeable && emit('close')"
      >
        <div
          :class="['relative my-auto w-full rounded-[6px] border border-line bg-surface shadow-[0_18px_60px_rgba(20,20,18,0.18)]', panelClass]"
          role="dialog"
          aria-modal="true"
        >
          <header
            v-if="title || $slots.header"
            class="flex items-start justify-between gap-4 border-b border-line px-5 py-4"
          >
            <div>
              <slot name="header">
                <h2 class="text-[18px] font-semibold tracking-[-0.01em] text-ink">{{ title }}</h2>
                <p v-if="description" class="mt-1 text-[12px] text-muted">{{ description }}</p>
              </slot>
            </div>
            <button
              v-if="closeable"
              type="button"
              class="-mr-1 -mt-1 rounded-[4px] p-1.5 text-muted transition-colors hover:bg-paper hover:text-ink"
              aria-label="Закрыть"
              @click="emit('close')"
            >
              <AppIcon name="close" :size="17" />
            </button>
          </header>

          <div class="px-5 py-5">
            <slot />
          </div>

          <footer v-if="$slots.footer" class="flex items-center justify-end gap-2 border-t border-line px-5 py-3.5">
            <slot name="footer" />
          </footer>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
