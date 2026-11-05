import { CardPaymentStatus, PaymentReference } from '@org/enums'
import { PAYMENT_CONFIG } from '@org/validation-config'

export const PAYMENT_MESSAGES = {
  PAYMENT_NOT_FOUND: 'Платёж не найден',
  INSUFFICIENT_FUNDS: 'Недостаточно средств на карте',
  PAYMENT_DENIED: 'Платёж отклонён',
  SUM_VALIDATION: {
    NOT_EMPTY: 'Сумма платежа не может быть пустой',
    TYPE: 'Сумма платежа должна быть строкой',
    FORMAT: 'Сумма платежа должна быть числом с двумя знаками после запятой',
    MIN: `Минимальная сумма платежа: ${PAYMENT_CONFIG.SUM.MIN_VALUE}`,
  },
  SERVICE_VALIDATION: {
    NOT_EMPTY: 'Назначение платежа не может быть пустым',
    TYPE: 'Назначение платежа должно быть строкой',
    LENGTH: `Длина назначения платежа должна быть от ${PAYMENT_CONFIG.SERVICE.MIN_LENGTH} до ${PAYMENT_CONFIG.SERVICE.MAX_LENGTH} символов`,
  },
  REFERENCE_VALIDATION: {
    NOT_EMPTY: 'Тип операции не может быть пустым',
    ENUM: (): string =>
      `Недопустимый тип операции. Доступные варианты: ${Object.values(PaymentReference).join(', ')}`,
  },
  STATUS_VALIDATION: {
    NOT_EMPTY: 'Статус платежа не может быть пустым',
    ENUM: (): string =>
      `Недопустимый статус платежа. Доступные варианты: ${Object.values(CardPaymentStatus).join(', ')}`,
  },
} as const
