import { THEME_CONFIG } from '@org/validation-config'

export const THEME_MESSAGES = {
  THEME_NOT_FOUND: 'Тема не найдена',
  THEME_HAS_CHILDREN: 'Нельзя удалить тему, у которой есть дочерние темы',
  NAME_VALIDATION: {
    NOT_EMPTY: 'Название темы не может быть пустым',
    TYPE: 'Название темы должно быть строкой',
    LENGTH: `Длина названия темы должна быть от ${THEME_CONFIG.NAME.MIN_LENGTH} до ${THEME_CONFIG.NAME.MAX_LENGTH} символов`,
  },
  DESCRIPTION_VALIDATION: {
    NOT_EMPTY: 'Описание темы не может быть пустым',
    TYPE: 'Описание темы должно быть строкой',
    LENGTH: `Длина описания темы должна быть от ${THEME_CONFIG.DESCRIPTION.MIN_LENGTH} до ${THEME_CONFIG.DESCRIPTION.MAX_LENGTH} символов`,
  },
} as const
