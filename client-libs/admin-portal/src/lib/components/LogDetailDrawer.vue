<script setup lang="ts">

import { useLogs } from '@org/api-client'
import { Badge, Drawer, EmptyState , formatDateTime } from '@org/ui'
import { computed, onMounted, ref } from 'vue'

import type { LogOutput } from '@org/shared-types'

const props = defineProps<{ logId: string }>()
const emit = defineEmits<{ close: [] }>()

const store = useLogs()
const log = ref<LogOutput | null>(null)
const loading = ref(true)

const prettyData = computed(() => {
  const raw = log.value?.data
  if (!raw) return null

  try {
    return JSON.stringify(JSON.parse(raw), null, 2)
  } catch {
    return raw
  }
})

const methodTone = computed(() => {
  const method = log.value?.method ?? ''
  if (method === 'DELETE') return 'danger'
  if (method === 'POST') return 'success'
  if (method === 'PUT' || method === 'PATCH') return 'warning'
  return 'info'
})

onMounted(async () => {
  log.value = await store.getLog(props.logId)
  loading.value = false
})
</script>

<template>
  <Drawer open title="Запись журнала" :description="log ? `${log.service} · ${log.action}` : undefined" @close="emit('close')">
    <div v-if="loading" class="px-5 py-10 text-center text-[12px] text-muted">Загрузка…</div>

    <EmptyState v-else-if="!log" title="Запись не найдена" description="Возможно, журнал был очищен." />

    <div v-else class="space-y-6 px-5 py-5">
      <div class="flex flex-wrap items-center gap-2">
        <Badge :tone="methodTone" :label="log.method" />
        <span class="font-mono text-[10px] text-muted">ID {{ log.id.slice(0, 8) }}</span>
      </div>

      <dl class="grid grid-cols-2 gap-x-4 gap-y-4 border-y border-line py-4 text-[12px]">
        <div>
          <dt class="text-[9px] uppercase tracking-[0.14em] text-muted">сервис</dt>
          <dd class="mt-1 text-ink">{{ log.service }}</dd>
        </div>
        <div>
          <dt class="text-[9px] uppercase tracking-[0.14em] text-muted">сущность</dt>
          <dd class="mt-1 text-ink">{{ log.entity || '—' }}</dd>
        </div>
        <div>
          <dt class="text-[9px] uppercase tracking-[0.14em] text-muted">действие</dt>
          <dd class="mt-1 text-ink">{{ log.action }}</dd>
        </div>
        <div>
          <dt class="text-[9px] uppercase tracking-[0.14em] text-muted">пользователь</dt>
          <dd class="mt-1 font-mono text-[11px] text-ink">{{ log.userId ? log.userId.slice(0, 8) : 'аноним' }}</dd>
        </div>
        <div class="col-span-2">
          <dt class="text-[9px] uppercase tracking-[0.14em] text-muted">время</dt>
          <dd class="mt-1 text-ink">{{ formatDateTime(log.createdAt) }}</dd>
        </div>
        <div class="col-span-2">
          <dt class="text-[9px] uppercase tracking-[0.14em] text-muted">user agent</dt>
          <dd class="mt-1 break-words text-[11px] leading-5 text-muted">{{ log.userAgent || '—' }}</dd>
        </div>
      </dl>

      <div>
        <p class="mb-2 text-[9px] uppercase tracking-[0.14em] text-muted">данные</p>
        <pre
          v-if="prettyData"
          class="max-h-[420px] overflow-auto rounded-[4px] border border-line bg-[#f5f4f0] p-3 font-mono text-[11px] leading-5 text-ink"
        >{{ prettyData }}</pre>
        <p v-else class="text-[12px] text-muted">Запись не содержит данных.</p>
      </div>
    </div>
  </Drawer>
</template>
