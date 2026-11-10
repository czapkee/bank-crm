<script setup lang="ts">
import type { TableColumn } from '../types.js'

const props = withDefaults(
  defineProps<{
    columns: TableColumn[]
    rows: any[]
    rowKey?: string
    loading?: boolean
    emptyText?: string
    clickable?: boolean
    selectedKey?: string | null
    compact?: boolean
  }>(),
  { rowKey: 'id', loading: false, emptyText: 'Нет данных', clickable: false, selectedKey: null, compact: false },
)

const emit = defineEmits<{ rowClick: [row: any] }>()

function rowValue(row: any, key: string): any {
  return row[key]
}

function rowId(row: any): string {
  return String(row[props.rowKey] ?? '')
}

function alignClass(align?: string): string {
  return align === 'right' ? 'text-right' : align === 'center' ? 'text-center' : 'text-left'
}
</script>

<template>
  <div class="w-full">
    <div class="w-full overflow-x-auto">
      <table class="w-full min-w-[640px] border-collapse">
        <thead>
          <tr class="border-y border-line bg-[#f1f0ec]">
            <th
              v-for="column in columns"
              :key="column.key"
              :style="column.width ? { width: column.width } : undefined"
              :class="[
                'px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.1em] text-muted',
                alignClass(column.align),
                column.class,
              ]"
            >
              {{ column.label }}
            </th>
          </tr>
        </thead>
        <tbody v-if="rows.length > 0 && !loading">
          <tr
            v-for="row in rows"
            :key="rowId(row)"
            :class="[
              'border-b border-line/80 transition-colors last:border-0',
              clickable ? 'cursor-pointer hover:bg-blush-50' : '',
              selectedKey === rowId(row) ? 'bg-blush-200/70 hover:bg-blush-200/70' : '',
            ]"
            @click="clickable && emit('rowClick', row)"
          >
            <td
              v-for="column in columns"
              :key="column.key"
              :class="[
                compact ? 'px-3 py-1.5' : 'px-3 py-2.5',
                'text-[12.5px] text-ink',
                alignClass(column.align),
                column.class,
              ]"
            >
              <slot :name="`cell-${column.key}`" :row="row" :value="rowValue(row, column.key)">
                {{ rowValue(row, column.key) ?? '—' }}
              </slot>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <p v-if="loading" class="border-t border-line px-3 py-10 text-center text-[12px] text-muted">
      Загрузка…
    </p>
    <p v-else-if="rows.length === 0" class="border-t border-line px-3 py-10 text-center text-[12px] text-muted">
      {{ emptyText }}
    </p>
  </div>
</template>
