import {
  CardPaymentStatus,
  CardStatuses,
  GRPC_TO_ROLE,
  PaymentReference,
  ReportFeedback,
  ReportPriority,
  ReportStatus,
  Roles,
} from '@org/enums'

export type Tone = 'neutral' | 'success' | 'warning' | 'danger' | 'info'

export const CARD_STATUS_LABELS: Record<CardStatuses, string> = {
  [CardStatuses.CREATED]: 'создана',
  [CardStatuses.IN_PROCESS]: 'в обработке',
  [CardStatuses.PROCESSED]: 'обработана',
  [CardStatuses.IN_DELIVERY]: 'отправлена',
  [CardStatuses.AT_CLIENT]: 'у клиента',
  [CardStatuses.EXPIRED]: 'истекла',
  [CardStatuses.BLOCKED]: 'заблокирована',
  [CardStatuses.DESTROYED]: 'уничтожена',
  [CardStatuses.CLOSED]: 'закрыта',
}

export const PAYMENT_STATUS_LABELS: Record<CardPaymentStatus, string> = {
  [CardPaymentStatus.IN_PROCESS]: 'в обработке',
  [CardPaymentStatus.APPROVED]: 'одобрено',
  [CardPaymentStatus.INSUFFICIENT_FUNDS]: 'недостаточно средств',
  [CardPaymentStatus.DENIED_BY_FROD]: 'отклонено',
  [CardPaymentStatus.INCORRECT_CVV]: 'неверный CVV',
  [CardPaymentStatus.LIMIT_EXCEEDED]: 'превышен лимит',
  [CardPaymentStatus.INCORRECT_DATA]: 'неверные данные',
  [CardPaymentStatus.INCORRECT_3D]: 'ошибка 3-D Secure',
}

export const PAYMENT_REFERENCE_LABELS: Record<PaymentReference, string> = {
  [PaymentReference.PAYMENT_FOR_GOODS_AND_SERVICES]: 'оплата товаров и услуг',
  [PaymentReference.RETURN_AND_REFUND]: 'возврат средств',
  [PaymentReference.SALARY]: 'зарплата',
  [PaymentReference.ACCOUNT_TOP_UP_VIA_ERIP]: 'пополнение через ЕРИП',
  [PaymentReference.CARD_TO_CARD_TRANSFER]: 'перевод с карты на карту',
}

export const REPORT_STATUS_LABELS: Record<ReportStatus, string> = {
  [ReportStatus.IN_PROCESS]: 'в работе',
  [ReportStatus.ON_CONTROL]: 'на контроле',
  [ReportStatus.TAKE_ON_TASK]: 'взято в задачу',
  [ReportStatus.RETURNED_TO_INIT]: 'возвращено',
  [ReportStatus.RETURNED_TO_WORK]: 'возвращено в работу',
  [ReportStatus.CLOSED]: 'закрыто',
}

export const PRIORITY_LABELS: Record<ReportPriority, string> = {
  [ReportPriority.LOW]: 'низкий',
  [ReportPriority.MEDIUM]: 'средний',
  [ReportPriority.HIGH]: 'высокий',
  [ReportPriority.CRITICAL]: 'критический',
}

export const FEEDBACK_LABELS: Record<ReportFeedback, string> = {
  [ReportFeedback.PHONE_NUMBER]: 'телефон',
  [ReportFeedback.EMAIL]: 'email',
  [ReportFeedback.NOT_REQUIRED]: 'не требуется',
  [ReportFeedback.OTHER]: 'другое',
}

export const ROLE_LABELS: Record<Roles, string> = {
  [Roles.EMPLOYEE]: 'сотрудник',
  [Roles.HEAD_OF_DEPARTMENT]: 'начальник отдела',
  [Roles.OPERATIONIST]: 'операционист',
  [Roles.SUPERADMIN]: 'суперадмин',
}

export const CARD_STATUS_OPTIONS = Object.entries(CARD_STATUS_LABELS).map(([value, label]) => ({ value, label }))
export const PAYMENT_STATUS_OPTIONS = Object.entries(PAYMENT_STATUS_LABELS).map(([value, label]) => ({ value, label }))
export const PAYMENT_REFERENCE_OPTIONS = Object.entries(PAYMENT_REFERENCE_LABELS).map(([value, label]) => ({ value, label }))
export const REPORT_STATUS_OPTIONS = Object.entries(REPORT_STATUS_LABELS).map(([value, label]) => ({ value, label }))
export const PRIORITY_OPTIONS = Object.entries(PRIORITY_LABELS).map(([value, label]) => ({ value, label }))
export const FEEDBACK_OPTIONS = Object.entries(FEEDBACK_LABELS).map(([value, label]) => ({ value, label }))
export const ROLE_OPTIONS = Object.entries(ROLE_LABELS).map(([value, label]) => ({ value, label }))

export function labelOf(map: Record<string, string>, value: unknown): string {
  if (value === null || value === undefined) return '—'
  return map[String(value)] ?? String(value)
}

export function cardStatusTone(value: unknown): Tone {
  switch (value) {
    case CardStatuses.AT_CLIENT:
      return 'success'
    case CardStatuses.IN_DELIVERY:
    case CardStatuses.IN_PROCESS:
    case CardStatuses.PROCESSED:
      return 'warning'
    case CardStatuses.BLOCKED:
    case CardStatuses.EXPIRED:
    case CardStatuses.DESTROYED:
      return 'danger'
    case CardStatuses.CREATED:
      return 'info'
    default:
      return 'neutral'
  }
}

export function paymentStatusTone(value: unknown): Tone {
  switch (value) {
    case CardPaymentStatus.APPROVED:
      return 'success'
    case CardPaymentStatus.IN_PROCESS:
      return 'warning'
    case CardPaymentStatus.INSUFFICIENT_FUNDS:
    case CardPaymentStatus.DENIED_BY_FROD:
    case CardPaymentStatus.INCORRECT_CVV:
    case CardPaymentStatus.LIMIT_EXCEEDED:
    case CardPaymentStatus.INCORRECT_DATA:
    case CardPaymentStatus.INCORRECT_3D:
      return 'danger'
    default:
      return 'neutral'
  }
}

export function reportStatusTone(value: unknown): Tone {
  switch (value) {
    case ReportStatus.CLOSED:
      return 'success'
    case ReportStatus.IN_PROCESS:
    case ReportStatus.ON_CONTROL:
    case ReportStatus.TAKE_ON_TASK:
      return 'warning'
    case ReportStatus.RETURNED_TO_INIT:
    case ReportStatus.RETURNED_TO_WORK:
      return 'info'
    default:
      return 'neutral'
  }
}

export function priorityTone(value: unknown): Tone {
  switch (value) {
    case ReportPriority.CRITICAL:
      return 'danger'
    case ReportPriority.HIGH:
      return 'warning'
    case ReportPriority.MEDIUM:
      return 'info'
    default:
      return 'neutral'
  }
}

export function roleLabel(value: Roles | string | number | null | undefined): string {
  if (value === null || value === undefined) return '—'
  const role = typeof value === 'number' ? GRPC_TO_ROLE[value] : value
  return role ? ROLE_LABELS[role as Roles] ?? String(value) : String(value)
}

export function roleTone(value: Roles | string | null | undefined): Tone {
  switch (value) {
    case Roles.SUPERADMIN:
      return 'danger'
    case Roles.HEAD_OF_DEPARTMENT:
      return 'warning'
    case Roles.OPERATIONIST:
      return 'info'
    default:
      return 'neutral'
  }
}
