import { applyDecorators, Post } from '@nestjs/common'
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger'

import { Validate } from '../validate.decorator.js'

import type { Roles } from '@org/enums'

interface IPOSTProtectedMethodOptions {
  path: string
  summary: string
  operationDesc: string
  roles?: Roles[]
}

type IPOSTMethodOptions = Omit<IPOSTProtectedMethodOptions, 'roles'>

export const POSTMethod = (options: IPOSTMethodOptions): MethodDecorator => {
  return applyDecorators(
    ApiOperation({
      summary: options.summary,
      description: options.operationDesc,
    }),
    ApiCreatedResponse({
      description: 'Ресурс успешно создан',
    }),
    ApiBadRequestResponse({
      description: 'Запрос содержит некорректные данные',
    }),
    ApiInternalServerErrorResponse({
      description: 'Внутренняя ошибка сервера',
    }),
    Post(options.path),
  )
}

export const POSTProtected = (options: IPOSTProtectedMethodOptions): MethodDecorator => {
  return applyDecorators(
    ApiOperation({
      summary: options.summary,
      description: options.operationDesc,
    }),
    ApiBearerAuth(),
    ApiCreatedResponse({
      description: 'Ресурс успешно создан',
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
    Post(options.path),
    Validate(...(options.roles || [])),
  )
}
