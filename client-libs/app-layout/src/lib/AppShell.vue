<script setup lang="ts">
import { useAuthStore } from '@org/api-client'
import { AppIcon, todayLabel } from '@org/ui'
import { ref } from 'vue'
import { RouterView } from 'vue-router'


import AppSidebar from './AppSidebar.vue'

import type { NavItem } from './nav.js'

defineProps<{ nav: NavItem[]; variant: 'client' | 'admin' }>()

const auth = useAuthStore()
const mobileOpen = ref(false)
</script>

<template>
  <div class="min-h-screen bg-paper text-ink">
    <aside class="fixed inset-y-0 left-0 z-30 hidden w-[224px] border-r border-[#e9c9c6] lg:block">
      <AppSidebar :nav="nav" :variant="variant" />
    </aside>

    <Transition
      enter-active-class="transition duration-150"
      enter-from-class="opacity-0"
      leave-active-class="transition duration-100"
      leave-to-class="opacity-0"
    >
      <div v-if="mobileOpen" class="fixed inset-0 z-40 bg-ink/40 lg:hidden" @mousedown.self="mobileOpen = false">
        <aside class="h-full w-[248px]">
          <AppSidebar :nav="nav" :variant="variant" @navigate="mobileOpen = false" />
        </aside>
      </div>
    </Transition>

    <div class="lg:pl-[224px]">
      <header class="sticky top-0 z-20 border-b border-line bg-paper/90 backdrop-blur">
        <div class="flex h-13 items-center justify-between gap-4 px-5 sm:px-8">
          <div class="flex items-center gap-3">
            <button
              type="button"
              class="flex size-8 items-center justify-center rounded-[4px] border border-line text-ink lg:hidden"
              aria-label="Открыть меню"
              @click="mobileOpen = true"
            >
              <AppIcon name="menu" :size="17" />
            </button>
            <p class="text-[10px] font-medium uppercase tracking-[0.18em] text-muted">
              Банк / CRM
              <span class="mx-1.5 text-line">/</span>
              {{ variant === 'admin' ? 'рабочее место' : 'личный кабинет' }}
            </p>
          </div>

          <div class="flex items-center gap-4">
            <p class="hidden text-[11px] text-muted sm:block">{{ todayLabel() }}</p>
            <span class="hidden h-4 w-px bg-line sm:block" />
            <div class="flex items-center gap-2">
              <span class="flex size-7 items-center justify-center rounded-full border border-line bg-surface text-[9px] font-semibold tracking-wide text-ink">
                {{ auth.initials }}
              </span>
              <span class="hidden max-w-[200px] truncate text-[11.5px] font-medium text-ink sm:block">
                {{ auth.displayName }}
              </span>
            </div>
          </div>
        </div>
      </header>

      <main class="mx-auto w-full max-w-[1440px] px-5 py-6 sm:px-8 sm:py-8">
        <RouterView />
      </main>
    </div>
  </div>
</template>
