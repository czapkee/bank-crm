import { USER_CONFIG } from '@org/validation-config'

export const USER_MESSAGES = {
  CLIENT_NOT_FOUND: 'Клиент не найден',
  EMPLOYEE_NOT_FOUND: 'Сотрудник не найден',
  PHONE_NUMBER_EXISTS: 'Пользователь с таким номером телефона уже существует',
  IDENTIF_CODE_EXISTS: 'Пользователь с таким идентификационным кодом уже существует',
  NUM_PASS_EXISTS: 'Пользователь с таким номером паспорта уже существует',
  CLIENT_ALREADY_BLOCKED: 'Клиент уже заблокирован',
  CLIENT_NOT_BLOCKED: 'Клиент не заблокирован',
  EMPLOYEE_ALREADY_BLOCKED: 'Сотрудник уже заблокирован',
  EMPLOYEE_NOT_BLOCKED: 'Сотрудник не заблокирован',
  SURNAME_VALIDATION: {
    NOT_EMPTY: 'Фамилия не может быть пустой',
    TYPE: 'Фамилия должна быть строкой',
    LENGTH: `Длина фамилии должна быть от ${USER_CONFIG.SURNAME.MIN_LENGTH} до ${USER_CONFIG.SURNAME.MAX_LENGTH} символов`,
  },
  FATHER_NAME_VALIDATION: {
    NOT_EMPTY: 'Отчество не может быть пустым',
    TYPE: 'Отчество должно быть строкой',
    LENGTH: `Длина отчества должна быть от ${USER_CONFIG.FATHER_NAME.MIN_LENGTH} до ${USER_CONFIG.FATHER_NAME.MAX_LENGTH} символов`,
  },
  IDENTIF_CODE_VALIDATION: {
    NOT_EMPTY: 'Идентификационный код не может быть пустым',
    TYPE: 'Идентификационный код должен быть строкой',
    LENGTH: `Длина идентификационного кода должна быть от ${USER_CONFIG.IDENTIF_CODE.MIN_LENGTH} до ${USER_CONFIG.IDENTIF_CODE.MAX_LENGTH} символов`,
  },
  NUM_PASS_VALIDATION: {
    NOT_EMPTY: 'Номер паспорта не может быть пустым',
    TYPE: 'Номер паспорта должен быть строкой',
    LENGTH: `Длина номера паспорта должна быть от ${USER_CONFIG.NUM_PASS.MIN_LENGTH} до ${USER_CONFIG.NUM_PASS.MAX_LENGTH} символов`,
  },
  CODE_WORD_VALIDATION: {
    NOT_EMPTY: 'Кодовое слово не может быть пустым',
    TYPE: 'Кодовое слово должно быть строкой',
    LENGTH: `Длина кодового слова должна быть от ${USER_CONFIG.CODE_WORD.MIN_LENGTH} до ${USER_CONFIG.CODE_WORD.MAX_LENGTH} символов`,
  },
  ADDRESS_VALIDATION: {
    NOT_EMPTY: 'Адрес не может быть пустым',
    TYPE: 'Адрес должен быть строкой',
    LENGTH: `Длина адреса должна быть от ${USER_CONFIG.ADDRESS.MIN_LENGTH} до ${USER_CONFIG.ADDRESS.MAX_LENGTH} символов`,
  },
  IS_ACTIVE_VALIDATION: {
    NOT_EMPTY: 'Признак активности не может быть пустым',
    TYPE: 'Признак активности должен быть логическим',
  },
  IS_RESIDENT_VALIDATION: {
    NOT_EMPTY: 'Признак резидентства не может быть пустым',
    TYPE: 'Признак резидентства должен быть логическим',
  },
  NEW_PASSWORD_VALIDATION: {
    NOT_EMPTY: 'Новый пароль не может быть пустым',
    TYPE: 'Новый пароль должен быть строкой',
  },
} as const
