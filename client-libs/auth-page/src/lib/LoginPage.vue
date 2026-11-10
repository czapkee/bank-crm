<script setup lang="ts">
import { extractApiError, useAuthStore, useToastStore } from '@org/api-client'
import { Button, Input, Tabs, loginSchema } from '@org/ui'
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'


import AuthSplit from './components/AuthSplit.vue'

import type { AuthUserType } from '@org/api-client'

const auth = useAuthStore()
const toast = useToastStore()
const router = useRouter()
const route = useRoute()

const mode = ref<AuthUserType>('client')
const error = ref<string | null>(null)
const loading = ref(false)

const { handleSubmit, errors, defineField } = useForm({
  validationSchema: toTypedSchema(loginSchema),
})

const [email] = defineField('email')
const [password] = defineField('password')

const tabs = [
  { value: 'client', label: 'клиент' },
  { value: 'employee', label: 'сотрудник' },
]

onMounted(() => {
  if (auth.isAuthenticated) {
    void router.replace(auth.homeRoute)
  }
})

async function submit(values: Record<string, unknown>): Promise<void> {
  error.value = null
  loading.value = true

  try {
    await auth.login(mode.value, String(values.email ?? '').trim(), String(values.password ?? ''))
    toast.success('Добро пожаловать')

    const redirect = typeof route.query.redirect === 'string' ? route.query.redirect : null
    const allowedPrefix = mode.value === 'employee' ? '/admin' : '/portal'
    await router.replace(redirect?.startsWith(allowedPrefix) ? redirect : auth.homeRoute)
  } catch (cause) {
    error.value = extractApiError(cause)
  } finally {
    loading.value = false
  }
}

const onSubmit = handleSubmit(submit)
</script>

<template>
  <AuthSplit
    title="Спокойный банк для ежедневных решений."
    note="Войдите, чтобы управлять картами, следить за платежами и вести обращения без лишних переходов."
  >
    <p class="mb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-blush-600">добро пожаловать</p>
    <h2 class="text-[28px] font-semibold leading-tight tracking-[-0.03em] text-ink">Вход в кабинет</h2>
    <p class="mt-2 text-[12.5px] leading-5 text-muted">
      Выберите тип учётной записи и введите данные доступа.
    </p>

    <div class="mt-6">
      <Tabs v-model="mode" :items="tabs" />
    </div>

    <form class="mt-6 space-y-4" @submit.prevent="onSubmit">
      <Input
        v-model="email"
        label="email"
        type="email"
        autocomplete="email"
        placeholder="name@bank.local"
        :error="errors.email"
        required
      />
      <Input
        v-model="password"
        label="пароль"
        type="password"
        autocomplete="current-password"
        placeholder="••••••••"
        :error="errors.password"
        required
      />

      <p
        v-if="error"
        class="rounded-[4px] border border-danger/25 bg-danger/5 px-3 py-2.5 text-[12px] leading-5 text-danger"
      >
        {{ error }}
      </p>

      <Button type="submit" block :loading="loading">
        войти
      </Button>
    </form>

    <p v-if="mode === 'client'" class="mt-5 flex items-center gap-1.5 text-[12px] text-muted">
      <span>Ещё нет доступа?</span>
      <RouterLink to="/register" class="font-medium text-ink underline decoration-blush-300 underline-offset-4 hover:decoration-ink">
        Зарегистрироваться
      </RouterLink>
    </p>
    <p v-else class="mt-5 text-[11.5px] leading-5 text-muted">
      Учётную запись сотрудника создаёт администратор. После создания завершите регистрацию по ссылке из письма.
    </p>
  </AuthSplit>
</template>
