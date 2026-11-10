<script setup lang="ts">
import { AppIcon } from '@org/ui'

withDefaults(defineProps<{ eyebrow?: string; title?: string; note?: string; caption?: string }>(), {
  eyebrow: 'частный банк',
  title: 'Спокойный банк для ежедневных решений.',
  note: 'Карты, платежи и обращения — в одном рабочем пространстве.',
  caption: 'вход в систему',
})
</script>

<template>
  <div class="grid min-h-screen bg-surface lg:grid-cols-[minmax(0,1fr)_minmax(480px,0.82fr)]">
    <section class="relative hidden overflow-hidden bg-gradient-to-br from-[#fbe9e7] via-[#f6d8d5] to-[#edc3bf] p-10 lg:flex lg:flex-col lg:justify-between">
      <div class="absolute inset-x-0 top-0 h-px bg-white/60" />
      <div class="absolute -right-24 top-24 size-[420px] rounded-full border border-white/35" />
      <div class="absolute -right-10 top-40 size-[280px] rounded-full border border-white/25" />

      <div class="relative">
        <div class="flex items-center gap-2.5">
          <span class="flex size-9 items-center justify-center rounded-[3px] bg-ink text-[16px] font-semibold text-white">
            Б
          </span>
          <div class="leading-none">
            <p class="text-[13px] font-semibold uppercase tracking-[0.22em] text-ink">Банк</p>
            <p class="mt-1.5 text-[9px] uppercase tracking-[0.2em] text-ink/45">CRM / личный кабинет</p>
          </div>
        </div>
      </div>

      <div class="relative max-w-[520px] pb-8">
        <p class="mb-5 text-[10px] font-semibold uppercase tracking-[0.22em] text-ink/45">{{ eyebrow }}</p>
        <h1 class="text-[42px] font-semibold leading-[1.04] tracking-[-0.04em] text-ink">
          {{ title }}
        </h1>
        <p class="mt-6 max-w-[380px] text-[13px] leading-6 text-ink/55">{{ note }}</p>
      </div>

      <div class="relative flex items-end justify-between border-t border-ink/10 pt-5 text-[10px] uppercase tracking-[0.16em] text-ink/40">
        <span>Минск · 2026</span>
        <span class="flex items-center gap-1.5">
          <AppIcon name="lock" :size="12" />
          защищённый доступ
        </span>
      </div>
    </section>

    <section class="flex min-h-screen flex-col justify-between px-5 py-7 sm:px-10 lg:px-16">
      <div class="flex items-center justify-between lg:justify-end">
        <div class="flex items-center gap-2 lg:hidden">
          <span class="flex size-8 items-center justify-center rounded-[3px] bg-ink text-[14px] font-semibold text-white">Б</span>
          <span class="text-[12px] font-semibold uppercase tracking-[0.2em] text-ink">Банк</span>
        </div>
        <p class="text-[10px] uppercase tracking-[0.18em] text-muted">{{ caption }}</p>
      </div>

      <div class="mx-auto w-full max-w-[400px] py-10">
        <slot />
      </div>

      <p class="text-center text-[10px] leading-5 text-muted/70 lg:text-left">
        Используя систему, вы подтверждаете согласие с политикой обработки данных.
      </p>
    </section>
  </div>
</template>
