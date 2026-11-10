export type IconName =
  | 'dashboard'
  | 'users'
  | 'card'
  | 'wallet'
  | 'message'
  | 'tag'
  | 'activity'
  | 'settings'
  | 'logout'
  | 'plus'
  | 'search'
  | 'chevron-down'
  | 'chevron-left'
  | 'chevron-right'
  | 'close'
  | 'edit'
  | 'trash'
  | 'lock'
  | 'unlock'
  | 'eye'
  | 'arrow-up-right'
  | 'check'
  | 'alert'
  | 'refresh'
  | 'building'
  | 'user'
  | 'filter'
  | 'calendar'
  | 'menu'
  | 'mail'
  | 'phone'
  | 'file'
  | 'arrow-left'

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'dark'
export type ButtonSize = 'sm' | 'md'

export interface SelectOption {
  value: string | number
  label: string
}

export interface TableColumn {
  key: string
  label: string
  align?: 'left' | 'right' | 'center'
  width?: string
  class?: string
}

export interface TabItem {
  value: string
  label: string
}
