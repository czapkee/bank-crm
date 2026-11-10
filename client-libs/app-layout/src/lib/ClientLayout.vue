<script setup lang="ts">
import AppShell from './AppShell.vue'
import { CLIENT_NAV } from './nav.js'
</script>

<template>
  <AppShell :nav="CLIENT_NAV" variant="client" />
</template>
