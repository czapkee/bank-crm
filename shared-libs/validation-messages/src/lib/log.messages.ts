import { LOG_CONFIG } from '@org/validation-config'

export const LOG_MESSAGES = {
  LOG_NOT_FOUND: 'Запись журнала не найдена',
  SERVICE_VALIDATION: {
    NOT_EMPTY: 'Название сервиса не может быть пустым',
    TYPE: 'Название сервиса должно быть строкой',
    LENGTH: `Длина названия сервиса должна быть от ${LOG_CONFIG.SERVICE.MIN_LENGTH} до ${LOG_CONFIG.SERVICE.MAX_LENGTH} символов`,
  },
  ENTITY_VALIDATION: {
    NOT_EMPTY: 'Название сущности не может быть пустым',
    TYPE: 'Название сущности должно быть строкой',
    LENGTH: `Длина названия сущности должна быть от ${LOG_CONFIG.ENTITY.MIN_LENGTH} до ${LOG_CONFIG.ENTITY.MAX_LENGTH} символов`,
  },
  METHOD_VALIDATION: {
    NOT_EMPTY: 'Название метода не может быть пустым',
    TYPE: 'Название метода должно быть строкой',
    LENGTH: `Длина названия метода должна быть от ${LOG_CONFIG.METHOD.MIN_LENGTH} до ${LOG_CONFIG.METHOD.MAX_LENGTH} символов`,
  },
  ACTION_VALIDATION: {
    NOT_EMPTY: 'Название действия не может быть пустым',
    TYPE: 'Название действия должно быть строкой',
    LENGTH: `Длина названия действия должна быть от ${LOG_CONFIG.ACTION.MIN_LENGTH} до ${LOG_CONFIG.ACTION.MAX_LENGTH} символов`,
  },
  DATE_VALIDATION: {
    TYPE: 'Дата журнала должна быть в корректном формате, например: 2026-06-15T00:00:00.000Z',
  },
} as const
