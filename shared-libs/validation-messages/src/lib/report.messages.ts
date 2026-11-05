import { ReportFeedback, ReportPriority, ReportStatus } from '@org/enums'
import { REPORT_CONFIG } from '@org/validation-config'

export const REPORT_MESSAGES = {
  REPORT_NOT_FOUND: 'Обращение не найдено',
  REPORT_CLOSED: 'Обращение уже закрыто',
  REPORT_ALREADY_ASSIGNED: 'Обращение уже назначено сотруднику',
  TITLE_VALIDATION: {
    NOT_EMPTY: 'Заголовок обращения не может быть пустым',
    TYPE: 'Заголовок обращения должен быть строкой',
    LENGTH: `Длина заголовка обращения должна быть от ${REPORT_CONFIG.TITLE.MIN_LENGTH} до ${REPORT_CONFIG.TITLE.MAX_LENGTH} символов`,
  },
  CONTENT_VALIDATION: {
    NOT_EMPTY: 'Содержание обращения не может быть пустым',
    TYPE: 'Содержание обращения должно быть строкой',
    LENGTH: `Длина содержания обращения должна быть от ${REPORT_CONFIG.CONTENT.MIN_LENGTH} до ${REPORT_CONFIG.CONTENT.MAX_LENGTH} символов`,
  },
  FEEDBACK_CONTACT_VALIDATION: {
    NOT_EMPTY: 'Контакт для обратной связи не может быть пустым',
    TYPE: 'Контакт для обратной связи должен быть строкой',
    LENGTH: `Длина контакта для обратной связи должна быть от ${REPORT_CONFIG.FEEDBACK_CONTACT.MIN_LENGTH} до ${REPORT_CONFIG.FEEDBACK_CONTACT.MAX_LENGTH} символов`,
  },
  STATUS_VALIDATION: {
    NOT_EMPTY: 'Статус обращения не может быть пустым',
    ENUM: (): string => `Недопустимый статус обращения. Доступные варианты: ${Object.values(ReportStatus).join(', ')}`,
  },
  FEEDBACK_VALIDATION: {
    NOT_EMPTY: 'Способ обратной связи не может быть пустым',
    ENUM: (): string =>
      `Недопустимый способ обратной связи. Доступные варианты: ${Object.values(ReportFeedback).join(', ')}`,
  },
  PRIORITY_VALIDATION: {
    NOT_EMPTY: 'Приоритет обращения не может быть пустым',
    ENUM: (): string =>
      `Недопустимый приоритет обращения. Доступные варианты: ${Object.values(ReportPriority).join(', ')}`,
  },
} as const
