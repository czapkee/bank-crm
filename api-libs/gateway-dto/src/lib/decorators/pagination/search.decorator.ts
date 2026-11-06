import { applyDecorators } from '@nestjs/common'
import { ApiProperty } from '@nestjs/swagger'
import { SHARED_CONFIG } from '@org/validation-config'
import { SHARED_MESSAGES } from '@org/validation-messages'
import { IsOptional, IsString, Length } from 'class-validator'

export function Search(): PropertyDecorator {
  return applyDecorators(
    ApiProperty({
      description: 'Поисковый запрос',
      example: 'Иван',
      required: false,
    }),
    IsOptional(),
    IsString({ message: SHARED_MESSAGES.PAGINATION_SEARCH_VALIDATION.TYPE }),
    Length(SHARED_CONFIG.SEARCH.MIN_LENGTH, SHARED_CONFIG.SEARCH.MAX_LENGTH, {
      message: SHARED_MESSAGES.PAGINATION_SEARCH_VALIDATION.LENGTH,
    }),
  )
}
