<script setup lang="ts">

import { useThemes, useToastStore } from '@org/api-client'
import {
  AppIcon,
  Badge,
  Button,
  ConfirmDialog,
  DataTable,
  PageHeader,
  Pagination,
  Panel,
  SearchField,
 formatDate } from '@org/ui'
import { computed, onMounted, ref } from 'vue'

import ThemeFormDialog from './components/ThemeFormDialog.vue'

import type { ListQuery } from '@org/api-client'
import type { ThemeOutput } from '@org/shared-types'

const store = useThemes()
const toast = useToastStore()

const search = ref('')
const formOpen = ref(false)
const editTheme = ref<ThemeOutput | null>(null)
const deleteTarget = ref<ThemeOutput | null>(null)
const acting = ref(false)

const themes = computed(() => store.themes.value)

const columns = [
  { key: 'name', label: 'тема' },
  { key: 'parentId', label: 'уровень' },
  { key: 'description', label: 'описание' },
  { key: 'createdAt', label: 'создана', align: 'right' as const },
  { key: 'actions', label: '', align: 'right' as const, width: '130px' },
]

onMounted(() => load())

function query(page = 1): ListQuery {
  return {
    page,
    limit: 50,
    ...(search.value ? { search: search.value } : {}),
  }
}

async function load(page = 1): Promise<void> {
  await store.fetchAdminThemes(query(page))
}

function parentName(theme: ThemeOutput): string {
  if (!theme.parentId) return 'верхний уровень'
  return store.themes.value.find((item) => item.id === theme.parentId)?.name ?? 'подтема'
}

function create(): void {
  editTheme.value = null
  formOpen.value = true
}

function edit(theme: ThemeOutput): void {
  editTheme.value = theme
  formOpen.value = true
}

async function confirmDelete(): Promise<void> {
  if (!deleteTarget.value) return
  acting.value = true
  const ok = await store.deleteTheme(deleteTarget.value.id)
  acting.value = false

  if (ok) {
    toast.success('Тема удалена')
    deleteTarget.value = null
    await load()
  } else {
    toast.error(store.error.value ?? 'Не удалось удалить тему')
  }
}
</script>

<template>
  <div class="space-y-7">
    <PageHeader eyebrow="рабочее место" title="Темы обращений" description="Справочник тем и подтем, доступных клиентам при создании обращения.">
      <template #actions>
        <Button size="sm" @click="create">
          <AppIcon name="plus" :size="14" />
          Новая тема
        </Button>
      </template>
    </PageHeader>

    <div class="flex flex-wrap items-center gap-3 border-y border-line py-4">
      <SearchField v-model="search" placeholder="Название темы" @search="load(1)" />
      <p class="text-[11px] text-muted">найдено: <span class="tabular-nums text-ink">{{ store.pagination.value?.total ?? 0 }}</span></p>
      <p v-if="store.error.value" class="text-[11px] text-danger">{{ store.error.value }}</p>
    </div>

    <Panel>
      <DataTable
        :columns="columns"
        :rows="themes"
        :loading="store.loading.value"
        empty-text="Темы не найдены"
      >
        <template #cell-name="{ row }">
          <div class="flex items-center gap-2">
            <span v-if="row.parentId" class="text-muted">—</span>
            <span class="text-[12.5px] font-medium text-ink">{{ row.name }}</span>
          </div>
        </template>
        <template #cell-parentId="{ row }">
          <Badge v-if="!row.parentId" tone="neutral" label="верхний уровень" soft />
          <span v-else class="text-[11.5px] text-muted">{{ parentName(row) }}</span>
        </template>
        <template #cell-description="{ row }">
          <span class="text-[11.5px] text-muted">{{ row.description || '—' }}</span>
        </template>
        <template #cell-createdAt="{ row }">
          <span class="whitespace-nowrap text-[11px] text-muted">{{ formatDate(row.createdAt) }}</span>
        </template>
        <template #cell-actions="{ row }">
          <div class="flex items-center justify-end gap-3">
            <button type="button" class="text-[11px] text-muted underline decoration-line underline-offset-4 hover:text-ink" @click="edit(row)">
              изменить
            </button>
            <button type="button" class="text-[11px] text-muted underline decoration-line underline-offset-4 hover:text-danger" @click="deleteTarget = row">
              удалить
            </button>
          </div>
        </template>
      </DataTable>
      <Pagination :pagination="store.pagination.value" @change="load" />
    </Panel>

    <ThemeFormDialog
      v-if="formOpen"
      :theme="editTheme"
      @close="formOpen = false"
      @saved="load()"
    />

    <ConfirmDialog
      :open="deleteTarget !== null"
      title="Удалить тему?"
      message="Если у темы есть подтемы или связанные обращения, удаление может быть отклонено."
      confirm-label="Удалить"
      :loading="acting"
      @cancel="deleteTarget = null"
      @confirm="confirmDelete"
    />
  </div>
</template>
