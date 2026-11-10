<script setup lang="ts">
import { computed } from 'vue'

import type { IconName } from '../types.js'

const props = withDefaults(defineProps<{ name: IconName; size?: number; stroke?: number }>(), {
  size: 18,
  stroke: 1.6,
})

const paths: Record<IconName, string[]> = {
  dashboard: ['M4 4h6v6H4z', 'M14 4h6v3h-6z', 'M14 11h6v9h-6z', 'M4 14h6v6H4z'],
  users: ['M16 20v-1.5a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4V20', 'M9.5 10.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z', 'M17 11a3 3 0 0 0 0-6', 'M21 20v-1.5a4 4 0 0 0-3-3.87'],
  card: ['M3 6.5h18v11H3z', 'M3 10h18', 'M7 14.5h3'],
  wallet: ['M4 6.5h14a2 2 0 0 1 2 2V18H4a1 1 0 0 1-1-1V7.5a1 1 0 0 1 1-1Z', 'M3 9h17', 'M16.5 13.5h.01'],
  message: ['M4 5h16v11H9l-5 4V5Z', 'M8 9h8', 'M8 12h5'],
  tag: ['M4 4h7l9 9-7 7-9-9V4Z', 'M8 8h.01'],
  activity: ['M3 12h4l2.5-6 5 12 2.5-6h4'],
  settings: ['M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z', 'M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9c.14.61.66 1.09 1.29 1.18H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z'],
  logout: ['M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4', 'M16 17l5-5-5-5', 'M21 12H9'],
  plus: ['M12 5v14', 'M5 12h14'],
  search: ['M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z', 'm21 21-4.35-4.35'],
  'chevron-down': ['m6 9 6 6 6-6'],
  'chevron-left': ['m15 18-6-6 6-6'],
  'chevron-right': ['m9 18 6-6-6-6'],
  close: ['M6 6l12 12', 'M18 6 6 18'],
  edit: ['M12 20h9', 'M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z'],
  trash: ['M3 6h18', 'M8 6V4h8v2', 'M19 6l-1 15H6L5 6', 'M10 11v6', 'M14 11v6'],
  lock: ['M5 11h14v10H5z', 'M8 11V7a4 4 0 0 1 8 0v4'],
  unlock: ['M5 11h14v10H5z', 'M8 11V7a4 4 0 0 1 7.5-2'],
  eye: ['M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z', 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z'],
  'arrow-up-right': ['M7 17 17 7', 'M8 7h9v9'],
  check: ['m5 12 4 4L19 6'],
  alert: ['M12 3 2 21h20L12 3Z', 'M12 9v5', 'M12 17h.01'],
  refresh: ['M20 11a8 8 0 1 0-2.3 5.7', 'M20 4v7h-7'],
  building: ['M4 21V5l8-3 8 3v16', 'M9 21v-5h6v5', 'M8 8h.01', 'M12 8h.01', 'M16 8h.01', 'M8 12h.01', 'M12 12h.01', 'M16 12h.01'],
  user: ['M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2', 'M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z'],
  filter: ['M3 5h18', 'M6 12h12', 'M10 19h4'],
  calendar: ['M4 5h16v16H4z', 'M8 3v4', 'M16 3v4', 'M4 10h16'],
  menu: ['M4 6h16', 'M4 12h16', 'M4 18h16'],
  mail: ['M3 5h18v14H3z', 'm3 6 9 7 9-7'],
  phone: ['M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.9a2 2 0 0 1-.4 2.1L8.1 9.9a16 16 0 0 0 6 6l1.2-1.3a2 2 0 0 1 2.1-.4c.9.3 1.9.6 2.9.7a2 2 0 0 1 1.7 2Z'],
  file: ['M6 2h8l4 4v16H6z', 'M14 2v5h5', 'M9 13h6', 'M9 17h6'],
  'arrow-left': ['M19 12H5', 'm12 19-7-7 7-7'],
}

const d = computed(() => paths[props.name] ?? [])
</script>

<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    fill="none"
    :stroke-width="stroke"
    stroke="currentColor"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    <path v-for="(path, index) in d" :key="index" :d="path" />
  </svg>
</template>
