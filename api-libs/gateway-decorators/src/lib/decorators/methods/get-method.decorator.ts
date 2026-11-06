import { applyDecorators, Get } from '@nestjs/common'
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

interface IGETProtectedMethodOptions {
  path: string
  summary: string
  operationDesc: string
  roles?: Roles[]
}

type IGETMethodOptions = Omit<IGETProtectedMethodOptions, 'roles'>

export const GETMethod = (options: IGETMethodOptions): MethodDecorator => {
  return applyDecorators(
    ApiOperation({
      summary: options.summary,
      description: options.operationDesc,
    }),
    ApiOkResponse({
      description: 'Запрос успешно обработан',
    }),
    ApiBadRequestResponse({
      description: 'Запрос содержит некорректные данные',
    }),
    ApiInternalServerErrorResponse({
      description: 'Внутренняя ошибка сервера',
    }),
    Get(options.path),
  )
}

export const GETProtectedMethod = (options: IGETProtectedMethodOptions): MethodDecorator => {
  return applyDecorators(
    ApiOperation({
      summary: options.summary,
      description: options.operationDesc,
    }),
    ApiBearerAuth(),
    ApiOkResponse({
      description: 'Запрос успешно обработан',
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
    Get(options.path),
    Validate(...(options.roles || [])),
  )
}
