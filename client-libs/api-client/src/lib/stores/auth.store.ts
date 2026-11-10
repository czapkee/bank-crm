import { Roles } from '@org/enums'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

import { useAccessToken } from '../composables/use-access-token.js'
import { request } from '../request.js'


import type { ClientUserEntity, EmployeeUserEntity } from '@org/shared-types'


export type AuthUserType = 'client' | 'employee'

export interface AuthProfile {
  id: string
  email: string
  name: string
  surname: string
  fatherName: string | null
  phoneNumber: string
  isResident: boolean
  identifCode: string
  numPass: string
  codeWord: string
  address: string
  isActive: boolean
  createdAt: string
  updatedAt: string
  role?: Roles
}

interface AuthResponse {
  accessToken: string
}

interface ProfilePayload {
  name?: string
  surname?: string
  fatherName?: string
  phoneNumber?: string
  isResident?: boolean
  identifCode?: string
  numPass?: string
  codeWord?: string
  address?: string
}

interface PasswordPayload {
  oldPassword: string
  newPassword: string
  newPasswordConfirmation: string
}

const AUTH_TYPE_KEY = 'bank-crm.auth-type'

function storedType(): AuthUserType | null {
  const value = localStorage.getItem(AUTH_TYPE_KEY)
  return value === 'client' || value === 'employee' ? value : null
}

export const useAuthStore = defineStore('auth', () => {
  const { accessToken, setAccessToken, clearAccessToken } = useAccessToken()

  const userType = ref<AuthUserType | null>(storedType())
  const profile = ref<AuthProfile | null>(null)
  const initialized = ref(false)

  let initPromise: Promise<void> | null = null
  let refreshPromise: Promise<boolean> | null = null

  const isAuthenticated = computed(() => accessToken.value !== null && profile.value !== null)
  const isEmployee = computed(() => userType.value === 'employee')
  const role = computed<Roles | null>(() => {
    if (userType.value !== 'employee') return null
    return profile.value?.role ?? null
  })

  const displayName = computed(() => {
    const current = profile.value
    if (!current) return ''

    const full = [current.surname, current.name, current.fatherName].filter(Boolean).join(' ')
    return full || current.email
  })

  const initials = computed(() => {
    const current = profile.value
    if (!current) return '—'

    const letters = `${current.name.charAt(0)}${current.surname.charAt(0)}`.toUpperCase()
    return letters || current.email.charAt(0).toUpperCase() || '—'
  })

  const homeRoute = computed(() => {
    if (!isAuthenticated.value) return '/login'
    if (userType.value === 'client') return '/portal'
    if (role.value === Roles.OPERATIONIST) return '/admin/cards'
    if (role.value === Roles.HEAD_OF_DEPARTMENT || role.value === Roles.SUPERADMIN) return '/admin'
    return '/admin/settings'
  })

  function setSession(type: AuthUserType, token: string): void {
    userType.value = type
    localStorage.setItem(AUTH_TYPE_KEY, type)
    setAccessToken(token)
  }

  function clearSession(): void {
    clearAccessToken()
    profile.value = null
    userType.value = null
    localStorage.removeItem(AUTH_TYPE_KEY)
  }

  async function loadProfile(): Promise<boolean> {
    if (!userType.value) return false

    try {
      const data = await request<ClientUserEntity | EmployeeUserEntity>(`/user/${userType.value}/me`)
      profile.value = data as AuthProfile
      return true
    } catch {
      clearSession()
      return false
    }
  }

  function refresh(): Promise<boolean> {
    if (refreshPromise) return refreshPromise

    refreshPromise = (async (): Promise<boolean> => {
      const type = userType.value ?? storedType()

      if (!type) return false

      try {
        const data = await request<AuthResponse>(`/user/${type}/refresh`, {
          method: 'POST',
          skipAuthRefresh: true,
        })
        setSession(type, data.accessToken)
        return true
      } catch {
        clearSession()
        return false
      } finally {
        refreshPromise = null
      }
    })()

    return refreshPromise
  }

  async function init(): Promise<void> {
    if (initialized.value) return
    if (initPromise) return initPromise

    initPromise = (async (): Promise<void> => {
      const refreshed = await refresh()
      if (refreshed) await loadProfile()
      initialized.value = true
      initPromise = null
    })()

    return initPromise
  }

  async function login(type: AuthUserType, email: string, password: string): Promise<void> {
    const data = await request<AuthResponse>(`/user/${type}/login`, {
      method: 'POST',
      body: { email, password },
      skipAuthRefresh: true,
    })

    setSession(type, data.accessToken)
    const loaded = await loadProfile()

    if (!loaded) {
      throw new Error('Не удалось загрузить профиль пользователя')
    }
  }

  async function register(email: string, password: string, confirmationPassword: string): Promise<void> {
    const data = await request<AuthResponse>('/user/client/register', {
      method: 'POST',
      body: { email, password, confirmationPassword },
      skipAuthRefresh: true,
    })

    setSession('client', data.accessToken)
    await loadProfile()
  }

  async function logout(): Promise<void> {
    const type = userType.value

    try {
      if (type) {
        await request<null>(`/user/${type}/logout`, { method: 'POST', skipAuthRefresh: true })
      }
    } finally {
      clearSession()
      initialized.value = false
    }
  }

  async function updateProfile(payload: ProfilePayload): Promise<boolean> {
    if (!userType.value) return false

    const data = await request<AuthProfile>(`/user/${userType.value}/me`, {
      method: 'PATCH',
      body: payload,
    })

    profile.value = data
    return true
  }

  async function changePassword(payload: PasswordPayload): Promise<boolean> {
    if (!userType.value) return false

    await request<null>(`/user/${userType.value}/change-password`, {
      method: 'PATCH',
      body: payload,
    })

    return true
  }

  return {
    accessToken,
    userType,
    profile,
    initialized,
    isAuthenticated,
    isEmployee,
    role,
    displayName,
    initials,
    homeRoute,
    init,
    refresh,
    login,
    register,
    logout,
    loadProfile,
    updateProfile,
    changePassword,
  }
})
