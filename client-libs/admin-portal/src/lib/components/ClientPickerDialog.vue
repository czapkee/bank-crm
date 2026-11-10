<script setup lang="ts">

import { useClients } from '@org/api-client'
import {
  Badge,
  Button,
  Modal,
  Pagination,
  SearchField,
  formatPersonName,
} from '@org/ui'
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'

import type { ClientOutput } from '@org/shared-types'

const props = withDefaults(defineProps<{ selectedId?: string }>(), { selectedId: '' })
const emit = defineEmits<{ close: []; select: [client: ClientOutput] }>()

const store = useClients()
const search = ref('')
const page = ref(1)
const selected = ref<ClientOutput | null>(null)

let timer: ReturnType<typeof setTimeout> | null = null

const clients = computed(() => store.clients.value)

onMounted(() => load())

onBeforeUnmount(() => {
  if (timer) clearTimeout(timer)
})

watch(search, () => {
  if (timer) clearTimeout(timer)

  timer = setTimeout(() => {
    page.value = 1
    void load()
  }, 300)
})

async function load(target = page.value): Promise<void> {
  page.value = target
  await store.fetchClients({
    page: target,
    limit: 20,
    ...(search.value ? { search: search.value } : {}),
  })
}

function choose(client: ClientOutput): void {
  selected.value = client
}

function confirm(): void {
  if (selected.value) emit('select', selected.value)
}
</script>

<template>
  <Modal open title="Выбор клиента" description="Найдите клиента по ФИО, email или телефону." size="lg" @close="emit('close')">
    <div class="space-y-4">
      <SearchField v-model="search" placeholder="ФИО, email или телефон" />

      <div class="max-h-[420px] overflow-y-auto border-y border-line">
        <p v-if="store.loading.value" class="px-3 py-10 text-center text-[12px] text-muted">Загрузка…</p>
        <p v-else-if="clients.length === 0" class="px-3 py-10 text-center text-[12px] text-muted">Клиенты не найдены</p>
        <div v-else>
          <button
            v-for="client in clients"
            :key="client.id"
            type="button"
            :class="[
              'flex w-full items-center justify-between gap-4 border-b border-line px-3 py-3 text-left transition-colors last:border-0',
              selected?.id === client.id || props.selectedId === client.id ? 'bg-blush-100/70' : 'hover:bg-paper',
            ]"
            @click="choose(client)"
          >
            <span class="min-w-0">
              <span class="block truncate text-[12.5px] font-medium text-ink">{{ formatPersonName(client) }}</span>
              <span class="mt-0.5 block truncate text-[11px] text-muted">
                {{ client.email }}<template v-if="client.phoneNumber"> · {{ client.phoneNumber }}</template>
              </span>
            </span>
            <Badge :tone="client.isActive ? 'success' : 'danger'" :label="client.isActive ? 'активен' : 'заблокирован'" />
          </button>
        </div>
      </div>

      <Pagination :pagination="store.pagination.value" @change="load" />

      <p v-if="store.error.value" class="text-[11px] text-danger">{{ store.error.value }}</p>
    </div>

    <template #footer>
      <Button variant="secondary" size="sm" @click="emit('close')">Отмена</Button>
      <Button size="sm" :disabled="!selected && !props.selectedId" @click="confirm">Выбрать</Button>
    </template>
  </Modal>
</template>
