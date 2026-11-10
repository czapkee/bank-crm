<script setup lang="ts">
import { extractApiError, useAuthStore, useToastStore } from '@org/api-client'
import { Button, Input, registerSchema } from '@org/ui'
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { ref } from 'vue'
import { useRouter } from 'vue-router'


import AuthSplit from './components/AuthSplit.vue'

const auth = useAuthStore()
const toast = useToastStore()
const router = useRouter()

const error = ref<string | null>(null)
const loading = ref(false)

const { handleSubmit, errors, defineField } = useForm({
  validationSchema: toTypedSchema(registerSchema),
})

const [email] = defineField('email')
const [password] = defineField('password')
const [confirmationPassword] = defineField('confirmationPassword')

async function submit(values: { email: string; password: string; confirmationPassword: string }): Promise<void> {
  error.value = null
  loading.value = true

  try {
    await auth.register(values.email.trim(), values.password, values.confirmationPassword)
    toast.success('Аккаунт создан')
    await router.replace('/portal')
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
    eyebrow="новый клиент"
    title="Начните с простого. Остальное — по шагам."
    note="Создайте доступ к личному кабинету. Данные профиля можно заполнить после входа."
    caption="регистрация"
  >
    <p class="mb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-blush-600">регистрация</p>
    <h2 class="text-[28px] font-semibold leading-tight tracking-[-0.03em] text-ink">Создать аккаунт</h2>
    <p class="mt-2 text-[12.5px] leading-5 text-muted">
      Для клиентов банка. Сотрудники получают доступ от администратора.
    </p>

    <form class="mt-7 space-y-4" @submit.prevent="onSubmit">
      <Input v-model="email" label="email" type="email" autocomplete="email" placeholder="name@example.com" :error="errors.email" required />
      <Input v-model="password" label="пароль" type="password" autocomplete="new-password" placeholder="••••••••" :error="errors.password" required />
      <Input
        v-model="confirmationPassword"
        label="повторите пароль"
        type="password"
        autocomplete="new-password"
        placeholder="••••••••"
        :error="errors.confirmationPassword"
        required
      />

      <p
        v-if="error"
        class="rounded-[4px] border border-danger/25 bg-danger/5 px-3 py-2.5 text-[12px] leading-5 text-danger"
      >
        {{ error }}
      </p>

      <Button type="submit" block :loading="loading">зарегистрироваться</Button>
    </form>

    <p class="mt-5 flex items-center gap-1.5 text-[12px] text-muted">
      <span>Уже есть аккаунт?</span>
      <RouterLink to="/login" class="font-medium text-ink underline decoration-blush-300 underline-offset-4 hover:decoration-ink">
        Войти
      </RouterLink>
    </p>
  </AuthSplit>
</template>
