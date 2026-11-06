import { applyDecorators } from '@nestjs/common'
import { ApiProperty } from '@nestjs/swagger'
import { SHARED_CONFIG } from '@org/validation-config'
import { SHARED_MESSAGES } from '@org/validation-messages'
import { Type } from 'class-transformer'
import { IsInt, IsOptional, Max, Min } from 'class-validator'

export function Limit(): PropertyDecorator {
  return applyDecorators(
    ApiProperty({
      description: 'Количество элементов на странице',
      example: SHARED_CONFIG.PAGINATION.DEFAULT_LIMIT,
      required: false,
      minimum: SHARED_CONFIG.PAGINATION.MIN_LIMIT,
      maximum: SHARED_CONFIG.PAGINATION.MAX_LIMIT,
      type: 'integer',
    }),
    IsOptional(),
    Type(() => Number),
    IsInt({ message: SHARED_MESSAGES.PAGINATION_LIMIT_VALIDATION.TYPE }),
    Min(SHARED_CONFIG.PAGINATION.MIN_LIMIT, { message: SHARED_MESSAGES.PAGINATION_LIMIT_VALIDATION.MIN }),
    Max(SHARED_CONFIG.PAGINATION.MAX_LIMIT, { message: SHARED_MESSAGES.PAGINATION_LIMIT_VALIDATION.MAX }),
  )
}
