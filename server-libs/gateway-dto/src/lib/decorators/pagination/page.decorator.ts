import { applyDecorators } from '@nestjs/common'
import { ApiProperty } from '@nestjs/swagger'
import { SHARED_CONFIG } from '@org/validation-config'
import { SHARED_MESSAGES } from '@org/validation-messages'
import { Type } from 'class-transformer'
import { IsInt, IsOptional, Min } from 'class-validator'

export function Page(): PropertyDecorator {
  return applyDecorators(
    ApiProperty({
      description: 'Номер страницы',
      example: SHARED_CONFIG.PAGINATION.DEFAULT_PAGE,
      required: false,
      minimum: SHARED_CONFIG.PAGINATION.MIN_PAGE,
      type: 'integer',
    }),
    IsOptional(),
    Type(() => Number),
    IsInt({ message: SHARED_MESSAGES.PAGINATION_PAGE_VALIDATION.TYPE }),
    Min(SHARED_CONFIG.PAGINATION.MIN_PAGE, { message: SHARED_MESSAGES.PAGINATION_PAGE_VALIDATION.MIN }),
  )
}
