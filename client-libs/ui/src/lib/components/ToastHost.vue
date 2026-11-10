<script setup lang="ts">
import { useToastStore } from '@org/api-client'
import { storeToRefs } from 'pinia'


import AppIcon from './AppIcon.vue'

const toast = useToastStore()
const { items } = storeToRefs(toast)

const tones = {
  success: 'border-success/30 bg-[#eef5f0] text-[#2e5c42]',
  error: 'border-danger/30 bg-[#fbf0ef] text-[#8d3a34]',
  info: 'border-info/30 bg-[#eef3f8] text-[#3e5f80]',
}

const icons = {
  success: 'check',
  error: 'alert',
  info: 'eye',
} as const
</script>

<template>
  <Teleport to="body">
    <div class="fixed bottom-4 right-4 z-[100] flex w-[min(92vw,360px)] flex-col gap-2">
      <TransitionGroup
        enter-active-class="transition duration-150 ease-out"
        enter-from-class="translate-y-2 opacity-0"
        leave-active-class="transition duration-100 ease-in"
        leave-to-class="translate-y-1 opacity-0"
      >
        <div
          v-for="item in items"
          :key="item.id"
          :class="['flex items-start gap-2.5 rounded-[4px] border px-3 py-2.5 text-[12px] leading-5 shadow-sm', tones[item.tone]]"
        >
          <AppIcon :name="icons[item.tone]" :size="15" class="mt-0.5 shrink-0" />
          <p class="flex-1">{{ item.message }}</p>
          <button type="button" class="shrink-0 opacity-60 hover:opacity-100" @click="toast.remove(item.id)">
            <AppIcon name="close" :size="13" />
          </button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>
