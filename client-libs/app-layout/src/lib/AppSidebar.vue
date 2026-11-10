<script setup lang="ts">

import { useAuthStore } from '@org/api-client'
import { AppIcon, roleLabel } from '@org/ui'
import { useRouter } from 'vue-router'

import type { NavItem } from './nav.js'

const props = withDefaults(defineProps<{ nav: NavItem[]; variant: 'client' | 'admin' }>(), {})

const emit = defineEmits<{ navigate: [] }>()

const auth = useAuthStore()
const router = useRouter()

function isActive(item: NavItem): boolean {
  const base = props.variant === 'admin' ? '/admin' : '/portal'
  if (item.to === base) return router.currentRoute.value.path === base
  return router.currentRoute.value.path.startsWith(item.to)
}

async function logout(): Promise<void> {
  await auth.logout()
  await router.push('/login')
}
</script>

<template>
  <div class="flex h-full flex-col bg-gradient-to-b from-[#fceceb] via-[#f9e2e0] to-[#f4d6d3]">
    <div class="px-5 pb-7 pt-6">
      <RouterLink
        :to="variant === 'admin' ? '/admin' : '/portal'"
        class="flex items-center gap-2.5"
        @click="emit('navigate')"
      >
        <span class="flex size-8 items-center justify-center rounded-[3px] bg-ink text-[15px] font-semibold text-white">
          Б
        </span>
        <span class="flex flex-col leading-none">
          <span class="text-[13px] font-semibold uppercase tracking-[0.2em] text-ink">Банк</span>
          <span class="mt-1 text-[9px] uppercase tracking-[0.18em] text-ink/45">
            {{ variant === 'admin' ? 'CRM / admin' : 'личный кабинет' }}
          </span>
        </span>
      </RouterLink>
    </div>

    <nav class="flex-1 px-3">
      <p class="mb-2 px-3 text-[9px] font-semibold uppercase tracking-[0.2em] text-ink/35">
        {{ variant === 'admin' ? 'рабочее пространство' : 'разделы' }}
      </p>
      <RouterLink
        v-for="item in nav"
        :key="item.to"
        :to="item.to"
        :class="[
          'group mb-0.5 flex items-center gap-2.5 border-l-2 py-2.5 pl-3 pr-2 text-[13px] transition-colors',
          isActive(item)
            ? 'border-ink bg-white/30 font-semibold text-ink'
            : 'border-transparent font-medium text-ink/55 hover:border-ink/20 hover:text-ink',
        ]"
        @click="emit('navigate')"
      >
        <AppIcon :name="item.icon" :size="16" :stroke="1.7" />
        <span>{{ item.label }}</span>
      </RouterLink>
    </nav>

    <div class="border-t border-ink/10 p-4">
      <div class="mb-3 flex items-center gap-2.5">
        <span class="flex size-8 shrink-0 items-center justify-center rounded-full bg-ink text-[10px] font-semibold tracking-wide text-white">
          {{ auth.initials }}
        </span>
        <div class="min-w-0">
          <p class="truncate text-[11.5px] font-semibold text-ink">{{ auth.displayName || 'Пользователь' }}</p>
          <p class="mt-0.5 truncate text-[10px] text-ink/50">
            {{ auth.isEmployee ? roleLabel(auth.role) : 'клиент банка' }}
          </p>
        </div>
      </div>
      <button
        type="button"
        class="flex w-full items-center justify-between border-t border-ink/10 pt-3 text-[11px] text-ink/50 transition-colors hover:text-ink"
        @click="logout"
      >
        <span>выйти из аккаунта</span>
        <AppIcon name="logout" :size="14" />
      </button>
    </div>
  </div>
</template>
