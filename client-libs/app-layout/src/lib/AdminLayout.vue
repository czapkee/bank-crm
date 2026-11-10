<script setup lang="ts">
import { useAuthStore } from '@org/api-client'
import { computed } from 'vue'


import AppShell from './AppShell.vue'
import { ADMIN_NAV } from './nav.js'

const auth = useAuthStore()

const items = computed(() =>
  ADMIN_NAV.filter((item) => !item.roles || (auth.role !== null && item.roles.includes(auth.role))),
)
</script>

<template>
  <AppShell :nav="items" variant="admin" />
</template>
