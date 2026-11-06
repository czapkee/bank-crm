import { applyDecorators, Delete } from '@nestjs/common'
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiOkResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger'

import { Validate } from '../validate.decorator.js'

import type { Roles } from '@org/enums'

interface IDELETEProtectedMethodOptions {
  path: string
  summary: string
  operationDesc: string
  roles?: Roles[]
}

type IDELETEMethodOptions = Omit<IDELETEProtectedMethodOptions, 'roles'>

export const DELETEMethod = (options: IDELETEMethodOptions): MethodDecorator => {
  return applyDecorators(
    ApiOperation({
      summary: options.summary,
      description: options.operationDesc,
    }),
    ApiOkResponse({
      description: 'Ресурс успешно удалён',
    }),
    ApiBadRequestResponse({
      description: 'Запрос содержит некорректные данные',
    }),
    ApiInternalServerErrorResponse({
      description: 'Внутренняя ошибка сервера',
    }),
    Delete(options.path),
  )
}

export const DELETEProtectedMethod = (options: IDELETEProtectedMethodOptions): MethodDecorator => {
  return applyDecorators(
    ApiOperation({
      summary: options.summary,
      description: options.operationDesc,
    }),
    ApiBearerAuth(),
    ApiOkResponse({
      description: 'Ресурс успешно удалён',
    }),
    ApiBadRequestResponse({
      description: 'Запрос содержит некорректные данные',
    }),
    ApiUnauthorizedResponse({
      description: 'Требуется авторизация',
    }),
    ApiForbiddenResponse({
      description: 'Недостаточно прав для выполнения действия',
    }),
    ApiInternalServerErrorResponse({
      description: 'Внутренняя ошибка сервера',
    }),
    Delete(options.path),
    Validate(...(options.roles || [])),
  )
}
