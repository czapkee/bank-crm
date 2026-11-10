<script setup lang="ts">

import { extractApiError, useAuthStore, useToastStore } from '@org/api-client'
import { Badge, Button, Input, PageHeader, Panel , ROLE_LABELS, formatDateTime, labelOf, roleTone } from '@org/ui'
import { computed, reactive, ref } from 'vue'

const auth = useAuthStore()
const toast = useToastStore()

const profile = computed(() => auth.profile)

const profileForm = reactive({
  name: profile.value?.name ?? '',
  surname: profile.value?.surname ?? '',
  fatherName: profile.value?.fatherName ?? '',
  phoneNumber: profile.value?.phoneNumber ?? '',
  codeWord: profile.value?.codeWord ?? '',
  address: profile.value?.address ?? '',
})

const passwordForm = reactive({
  oldPassword: '',
  newPassword: '',
  newPasswordConfirmation: '',
})

const savingProfile = ref(false)
const savingPassword = ref(false)
const profileError = ref<string | null>(null)
const passwordError = ref<string | null>(null)

async function saveProfile(): Promise<void> {
  profileError.value = null
  savingProfile.value = true

  try {
    await auth.updateProfile({
      name: profileForm.name.trim(),
      surname: profileForm.surname.trim(),
      fatherName: profileForm.fatherName.trim() || undefined,
      phoneNumber: profileForm.phoneNumber.trim(),
      codeWord: profileForm.codeWord.trim(),
      address: profileForm.address.trim(),
    })
    toast.success('Профиль обновлён')
  } catch (cause) {
    profileError.value = extractApiError(cause)
  } finally {
    savingProfile.value = false
  }
}

async function savePassword(): Promise<void> {
  passwordError.value = null

  if (passwordForm.newPassword !== passwordForm.newPasswordConfirmation) {
    passwordError.value = 'Новые пароли не совпадают'
    return
  }

  savingPassword.value = true

  try {
    await auth.changePassword({ ...passwordForm })
    toast.success('Пароль изменён')
    passwordForm.oldPassword = ''
    passwordForm.newPassword = ''
    passwordForm.newPasswordConfirmation = ''
  } catch (cause) {
    passwordError.value = extractApiError(cause)
  } finally {
    savingPassword.value = false
  }
}
</script>

<template>
  <div class="space-y-7">
    <PageHeader eyebrow="рабочее место" title="Настройки" description="Профиль сотрудника, контактные данные и пароль доступа." />

    <div class="grid gap-6 xl:grid-cols-[minmax(0,1.5fr)_minmax(280px,0.8fr)]">
      <div class="space-y-6">
        <Panel title="Профиль сотрудника" description="Данные используются в обращениях и журнале операций.">
          <form class="space-y-4 p-4" @submit.prevent="saveProfile">
            <div class="grid gap-4 sm:grid-cols-3">
              <Input v-model="profileForm.surname" label="фамилия" required />
              <Input v-model="profileForm.name" label="имя" required />
              <Input v-model="profileForm.fatherName" label="отчество" />
            </div>

            <div class="grid gap-4 sm:grid-cols-2">
              <Input v-model="profileForm.phoneNumber" label="телефон" placeholder="+375291234567" required />
              <Input v-model="profileForm.codeWord" label="кодовое слово" required />
            </div>

            <Input v-model="profileForm.address" label="адрес" required />

            <p v-if="profileError" class="rounded-[4px] border border-danger/25 bg-danger/5 px-3 py-2.5 text-[12px] text-danger">
              {{ profileError }}
            </p>

            <div class="flex justify-end border-t border-line pt-4">
              <Button type="submit" size="sm" :loading="savingProfile">Сохранить профиль</Button>
            </div>
          </form>
        </Panel>

        <Panel title="Безопасность" description="Смена пароля действует сразу после сохранения.">
          <form class="space-y-4 p-4" @submit.prevent="savePassword">
            <Input v-model="passwordForm.oldPassword" label="текущий пароль" type="password" autocomplete="current-password" required />

            <div class="grid gap-4 sm:grid-cols-2">
              <Input v-model="passwordForm.newPassword" label="новый пароль" type="password" autocomplete="new-password" required />
              <Input
                v-model="passwordForm.newPasswordConfirmation"
                label="повторите пароль"
                type="password"
                autocomplete="new-password"
                required
              />
            </div>

            <p v-if="passwordError" class="rounded-[4px] border border-danger/25 bg-danger/5 px-3 py-2.5 text-[12px] text-danger">
              {{ passwordError }}
            </p>

            <div class="flex justify-end border-t border-line pt-4">
              <Button type="submit" size="sm" variant="secondary" :loading="savingPassword">Изменить пароль</Button>
            </div>
          </form>
        </Panel>
      </div>

      <aside class="space-y-6">
        <Panel title="Учётная запись">
          <dl class="divide-y divide-line">
            <div class="px-4 py-3">
              <dt class="text-[9px] uppercase tracking-[0.14em] text-muted">сотрудник</dt>
              <dd class="mt-1 text-[12.5px] font-medium text-ink">{{ auth.displayName || '—' }}</dd>
            </div>
            <div class="px-4 py-3">
              <dt class="text-[9px] uppercase tracking-[0.14em] text-muted">email</dt>
              <dd class="mt-1 text-[12px] text-ink">{{ profile?.email ?? '—' }}</dd>
            </div>
            <div class="px-4 py-3">
              <dt class="text-[9px] uppercase tracking-[0.14em] text-muted">роль</dt>
              <dd class="mt-1.5">
                <Badge :tone="roleTone(auth.role)" :label="labelOf(ROLE_LABELS, auth.role)" />
              </dd>
            </div>
            <div class="px-4 py-3">
              <dt class="text-[9px] uppercase tracking-[0.14em] text-muted">в системе с</dt>
              <dd class="mt-1 text-[12px] text-ink">{{ profile ? formatDateTime(profile.createdAt) : '—' }}</dd>
            </div>
          </dl>
        </Panel>

        <div class="border-t border-line pt-4 text-[10.5px] leading-5 text-muted">
          <p class="font-mono">ID {{ profile?.id.slice(0, 8) ?? '—' }}</p>
          <p class="mt-1">Изменения профиля фиксируются в журнале операций.</p>
        </div>
      </aside>
    </div>
  </div>
</template>
