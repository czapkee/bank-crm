const amountFormatter = new Intl.NumberFormat('ru-RU', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

const compactFormatter = new Intl.NumberFormat('ru-RU', {
  maximumFractionDigits: 0,
})

export function formatAmount(value: string | number | null | undefined): string {
  if (value === null || value === undefined || value === '') return '—'
  const number = Number(value)
  return Number.isFinite(number) ? amountFormatter.format(number) : '—'
}

export function formatMoney(value: string | number | null | undefined): string {
  const formatted = formatAmount(value)
  return formatted === '—' ? formatted : `${formatted} р.`
}

export function formatCount(value: number | null | undefined): string {
  return value === null || value === undefined ? '—' : compactFormatter.format(value)
}

export function formatDate(value: string | null | undefined): string {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '—'
  return date.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

export function formatDateTime(value: string | null | undefined): string {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '—'
  return `${formatDate(value)}, ${date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}`
}

export function formatTime(value: string | null | undefined): string {
  if (!value) return '—'
  const date = new Date(value)
  return Number.isNaN(date.getTime())
    ? '—'
    : date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
}

export function formatCardNumber(value: string | null | undefined): string {
  if (!value) return '—'
  return value.replace(/(\d{4})(?=\d)/g, '$1 ')
}

export function formatExpire(value: string | null | undefined): string {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '—'
  return `${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getFullYear()).slice(-2)}`
}

export function initials(name?: string | null, surname?: string | null): string {
  return `${name?.charAt(0) ?? ''}${surname?.charAt(0) ?? ''}`.toUpperCase() || '—'
}

interface PersonName {
  surname?: string | null
  name?: string | null
  fatherName?: string | null
  email?: string | null
}

export function formatPersonName(person: PersonName | null | undefined): string {
  if (!person) return '—'

  const full = [person.surname, person.name, person.fatherName].filter(Boolean).join(' ').trim()

  return full || person.email?.trim() || '—'
}

export function shortId(value: string | null | undefined): string {
  return value ? value.slice(0, 8) : '—'
}

export function toIsoDate(value: string): string | null {
  if (!value) return null
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? null : date.toISOString()
}

export function todayLabel(): string {
  return new Date().toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}
