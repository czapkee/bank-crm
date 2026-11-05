import { SHARED_CONFIG } from '@org/validation-config'

export const SHARED_MESSAGES = {
  INVALID_DATE: 'Некорректная дата',
  INVALID_ID: 'Идентификатор',
  INVALID_EMAIL: 'Адрес электронной почты',
  INVALID_DATA: 'Данные',
  INTERNAL_ERROR: 'Внутренняя ошибка сервера',
  RPC_ERROR: (field: string): string => `Некорректное значение поля «${field}»`,
  ID_VALIDATION: {
    NOT_EMPTY: 'Идентификатор не может быть пустым',
    TYPE: 'Идентификатор должен быть строкой',
    UUID: `Идентификатор должен быть в формате UUID v${SHARED_CONFIG.ID.VERSION}`,
  },
  PAGINATION_PAGE_VALIDATION: {
    TYPE: 'Номер страницы должен быть числом',
    MIN: `Минимальный номер страницы: ${SHARED_CONFIG.PAGINATION.MIN_PAGE}`,
  },
  PAGINATION_LIMIT_VALIDATION: {
    TYPE: 'Количество элементов на странице должно быть числом',
    MIN: `Минимальное количество элементов на странице: ${SHARED_CONFIG.PAGINATION.MIN_LIMIT}`,
    MAX: `Максимальное количество элементов на странице: ${SHARED_CONFIG.PAGINATION.MAX_LIMIT}`,
  },
  PAGINATION_SEARCH_VALIDATION: {
    TYPE: 'Поисковый запрос должен быть строкой',
    LENGTH: `Длина поискового запроса должна быть от ${SHARED_CONFIG.SEARCH.MIN_LENGTH} до ${SHARED_CONFIG.SEARCH.MAX_LENGTH} символов`,
  },
  NAME_VALIDATION: {
    NOT_EMPTY: 'Имя не может быть пустым',
    TYPE: 'Имя должно быть строкой',
    LENGTH: `Длина имени должна быть от ${SHARED_CONFIG.NAME.MIN_LENGTH} до ${SHARED_CONFIG.NAME.MAX_LENGTH} символов`,
    MIN_LENGTH: `Минимальная длина имени: ${SHARED_CONFIG.NAME.MIN_LENGTH} символа`,
    MAX_LENGTH: `Максимальная длина имени: ${SHARED_CONFIG.NAME.MAX_LENGTH} символов`,
  },
  DESCRIPTION_VALIDATION: {
    NOT_EMPTY: 'Описание не может быть пустым',
    TYPE: 'Описание должно быть строкой',
    LENGTH: `Длина описания должна быть от ${SHARED_CONFIG.DESCRIPTION.MIN_LENGTH} до ${SHARED_CONFIG.DESCRIPTION.MAX_LENGTH} символов`,
    MIN_LENGTH: `Минимальная длина описания: ${SHARED_CONFIG.DESCRIPTION.MIN_LENGTH} символ`,
    MAX_LENGTH: `Максимальная длина описания: ${SHARED_CONFIG.DESCRIPTION.MAX_LENGTH} символов`,
  },
  PHONE_NUMBER_VALIDATION: {
    NOT_EMPTY: 'Номер телефона не может быть пустым',
    TYPE: 'Номер телефона должен быть строкой',
    LENGTH: `Длина номера телефона должна быть от ${SHARED_CONFIG.PHONE_NUMBER.MIN_LENGTH} до ${SHARED_CONFIG.PHONE_NUMBER.MAX_LENGTH} символов`,
    FORMAT: 'Номер телефона должен быть в корректном формате',
  },
  DATE_VALIDATION: {
    NOT_EMPTY: 'Дата не может быть пустой',
    TYPE: 'Дата должна быть в корректном формате, например: 2026-06-15T00:00:00.000Z',
  },
  MONEY_VALIDATION: {
    NOT_EMPTY: 'Сумма не может быть пустой',
    TYPE: 'Сумма должна быть строкой',
    FORMAT: 'Сумма должна быть числом с двумя знаками после запятой',
    MIN: `Минимальная сумма: ${SHARED_CONFIG.MONEY.MIN_VALUE}`,
    MAX_DECIMAL_PLACES: `Максимальное количество знаков после запятой: ${SHARED_CONFIG.MONEY.MAX_DECIMAL_PLACES}`,
  },
  BOOLEAN_VALIDATION: {
    NOT_EMPTY: 'Значение не может быть пустым',
    TYPE: 'Значение должно быть логическим',
  },
  NUMBER_VALIDATION: {
    NOT_EMPTY: 'Значение не может быть пустым',
    TYPE: 'Значение должно быть числом',
  },
  STRING_VALIDATION: {
    TYPE: 'Значение должно быть строкой',
    MIN_LENGTH: 'Слишком короткое значение',
    MAX_LENGTH: 'Слишком длинное значение',
  },
} as const
