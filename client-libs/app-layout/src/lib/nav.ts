import { Roles } from '@org/enums'

import type { IconName } from '@org/ui'

export interface NavItem {
  label: string
  to: string
  icon: IconName
  roles?: Roles[]
}

export const CLIENT_NAV: NavItem[] = [
  { label: 'профиль', to: '/portal', icon: 'user' },
  { label: 'мои карты', to: '/portal/cards', icon: 'card' },
  { label: 'платежи', to: '/portal/payments', icon: 'wallet' },
  { label: 'мои обращения', to: '/portal/reports', icon: 'message' },
]

export const ADMIN_NAV: NavItem[] = [
  { label: 'обзор', to: '/admin', icon: 'dashboard', roles: [Roles.HEAD_OF_DEPARTMENT, Roles.SUPERADMIN] },
  { label: 'клиенты', to: '/admin/clients', icon: 'users', roles: [Roles.HEAD_OF_DEPARTMENT, Roles.SUPERADMIN] },
  { label: 'карты', to: '/admin/cards', icon: 'card', roles: [Roles.OPERATIONIST, Roles.HEAD_OF_DEPARTMENT, Roles.SUPERADMIN] },
  { label: 'платежи', to: '/admin/payments', icon: 'wallet', roles: [Roles.OPERATIONIST, Roles.HEAD_OF_DEPARTMENT, Roles.SUPERADMIN] },
  { label: 'обращения', to: '/admin/reports', icon: 'message', roles: [Roles.HEAD_OF_DEPARTMENT, Roles.SUPERADMIN] },
  { label: 'темы', to: '/admin/themes', icon: 'tag', roles: [Roles.HEAD_OF_DEPARTMENT, Roles.SUPERADMIN] },
  { label: 'журнал', to: '/admin/logs', icon: 'activity', roles: [Roles.HEAD_OF_DEPARTMENT, Roles.SUPERADMIN] },
  { label: 'сотрудники', to: '/admin/employees', icon: 'building', roles: [Roles.SUPERADMIN] },
  { label: 'настройки', to: '/admin/settings', icon: 'settings' },
]
