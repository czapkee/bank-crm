import { Roles } from '@org/enums'
import { AUTH_CONFIG } from '@org/validation-config'

export const AUTH_MESSAGES = {
  USER_NOT_FOUND: 'Пользователь не найден',
  USER_WITH_EMAIL_EXISTS: 'Пользователь с таким адресом электронной почты уже существует',
  PASSWORDS_NOT_SIMILAR: 'Пароли не совпадают',
  INVALID_PASSWORD: 'Неверный пароль',
  USER_BLOCKED: (blockedUntil: Date, reason: string): string =>
    `Пользователь заблокирован до ${blockedUntil.toLocaleDateString('ru-RU')}. Причина: ${reason}`,
  USER_INACTIVE: 'Учётная запись пользователя неактивна',
  UNAUTHORIZED: 'Требуется авторизация',
  ACCESS_DENIED: 'Недостаточно прав для выполнения действия',
  TOKEN_INVALID: 'Недействительный токен',
  TOKEN_NOT_FOUND: 'Токен не найден',
  TOKEN_EXPIRED: 'Срок действия токена истёк',
  TOKEN_TYPE_INVALID: 'Недействительный тип токена',
  EMPLOYEE_REGISTRATION_EXPIRED: 'Срок регистрации сотрудника истёк',
  EMPLOYEE_ALREADY_REGISTERED: 'Сотрудник уже зарегистрирован',
  EMPLOYEE_NOT_REGISTERED: 'Сотрудник ещё не завершил регистрацию',
  SESSION_NOT_FOUND: 'Сессия не найдена',
  INVALID_SESSION: 'Недействительная сессия',
  PASSWORD_VALIDATION: {
    NOT_EMPTY: 'Пароль не может быть пустым',
    TYPE: 'Пароль должен быть строкой',
    STRONG: `Пароль слишком простой. Минимальная длина: ${AUTH_CONFIG.PASSWORD.MIN_LENGTH}; строчных символов: ${AUTH_CONFIG.PASSWORD.MIN_LOWERCASE}; заглавных символов: ${AUTH_CONFIG.PASSWORD.MIN_UPPERCASE}; цифр: ${AUTH_CONFIG.PASSWORD.MIN_NUMBERS}; специальных символов: ${AUTH_CONFIG.PASSWORD.MIN_SYMBOLS}`,
  },
  EMAIL_VALIDATION: {
    NOT_EMPTY: 'Адрес электронной почты не может быть пустым',
    TYPE: 'Адрес электронной почты должен быть строкой',
    MIN_LENGTH: `Минимальная длина адреса электронной почты: ${AUTH_CONFIG.EMAIL.MIN_LENGTH} символа`,
    MAX_LENGTH: `Максимальная длина адреса электронной почты: ${AUTH_CONFIG.EMAIL.MAX_LENGTH} символов`,
    EMAIL: 'Адрес электронной почты должен быть в корректном формате',
  },
  ROLE_VALIDATION: {
    NOT_EMPTY: 'Роль не может быть пустой',
    ENUM: (): string => `Недопустимая роль. Доступные варианты: ${Object.values(Roles).join(', ')}`,
  },
  CONFIRMATION_PASSWORD_VALIDATION: {
    NOT_EMPTY: 'Подтверждение пароля не может быть пустым',
    TYPE: 'Подтверждение пароля должно быть строкой',
  },
} as const
