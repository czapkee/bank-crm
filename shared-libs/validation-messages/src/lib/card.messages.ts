import { CardStatuses } from '@org/enums'
import { CARD_CONFIG } from '@org/validation-config'

export const CARD_MESSAGES = {
  CARD_NOT_FOUND: 'Карта не найдена',
  CARD_ALREADY_BLOCKED: 'Карта уже заблокирована',
  CARD_NOT_BLOCKED: 'Карта не заблокирована',
  CARD_BLOCKED: 'Карта заблокирована',
  CARD_NOT_ACTIVE: 'Операция доступна только для активированной карты',
  CARD_EXPIRED: 'Срок действия карты истёк',
  CARD_NUMBER_EXISTS: 'Карта с таким номером уже существует',
  ACCOUNT_NUMBER_EXISTS: 'Карта с таким номером счёта уже существует',
  CARD_NUMBER_VALIDATION: {
    NOT_EMPTY: 'Номер карты не может быть пустым',
    TYPE: 'Номер карты должен быть строкой',
    LENGTH: `Длина номера карты должна быть от ${CARD_CONFIG.CARD_NUMBER.MIN_LENGTH} до ${CARD_CONFIG.CARD_NUMBER.MAX_LENGTH} символов`,
    FORMAT: 'Номер карты должен содержать только цифры и пробелы',
  },
  ACCOUNT_NUMBER_VALIDATION: {
    NOT_EMPTY: 'Номер счёта не может быть пустым',
    TYPE: 'Номер счёта должен быть строкой',
    LENGTH: `Длина номера счёта должна быть от ${CARD_CONFIG.ACCOUNT_NUMBER.MIN_LENGTH} до ${CARD_CONFIG.ACCOUNT_NUMBER.MAX_LENGTH} символов`,
  },
  DATE_OF_EXPIRE_VALIDATION: {
    NOT_EMPTY: 'Срок действия карты не может быть пустым',
    TYPE: 'Срок действия карты должен быть в корректном формате',
    FUTURE: 'Срок действия карты должен быть в будущем',
  },
  BALANCE_VALIDATION: {
    NOT_EMPTY: 'Баланс не может быть пустым',
    TYPE: 'Баланс должен быть строкой',
    FORMAT: 'Баланс должен быть числом с двумя знаками после запятой',
    MIN: `Минимальный баланс: ${CARD_CONFIG.BALANCE.MIN_VALUE}`,
  },
  STATUS_VALIDATION: {
    NOT_EMPTY: 'Статус карты не может быть пустым',
    ENUM: (): string => `Недопустимый статус карты. Доступные варианты: ${Object.values(CardStatuses).join(', ')}`,
  },
} as const
