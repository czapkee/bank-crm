import { isFetchError } from './utils/is-fetch-error.js'

interface ErrorBody {
  message?: string | string[]
  data?: string
}

const STATUS_MESSAGES: Record<number, string> = {
  400: 'Проверьте заполнение формы',
  401: 'Требуется авторизация',
  403: 'Недостаточно прав для выполнения действия',
  404: 'Запись не найдена',
  409: 'Запись уже существует',
  422: 'Некорректные данные',
  429: 'Слишком много запросов, попробуйте позже',
  500: 'Внутренняя ошибка сервера',
  502: 'Сервис временно недоступен',
  503: 'Сервис временно недоступен',
}

export function extractApiError(error: unknown): string {
  if (isFetchError(error)) {
    const status = error.response?.status ?? 0
    const body = error.response?._data as ErrorBody | undefined
    const message = body?.message

    if (Array.isArray(message)) return message.join('. ')
    if (typeof message === 'string' && message.length > 0) return message
    if (typeof body?.data === 'string' && body.data.length > 0) return body.data

    return STATUS_MESSAGES[status] ?? 'Не удалось выполнить запрос'
  }

  if (error instanceof Error && error.message.length > 0) {
    return error.message
  }

  return 'Не удалось выполнить запрос'
}
