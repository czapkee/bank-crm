import { applyDecorators } from '@nestjs/common'
import { ApiProperty } from '@nestjs/swagger'
import { SHARED_MESSAGES } from '@org/validation-messages'
import { Type } from 'class-transformer'
import { IsDate, IsNotEmpty, IsOptional } from 'class-validator'

export function DateAndTime(required = true): PropertyDecorator {
  return applyDecorators(
    ApiProperty({
      description: 'Дата и время платежа',
      example: '2026-06-15T00:00:00.000Z',
      type: String,
      format: 'date-time',
      required,
    }),
    required ? IsNotEmpty({ message: SHARED_MESSAGES.DATE_VALIDATION.NOT_EMPTY }) : IsOptional(),
    Type(() => Date),
    IsDate({ message: SHARED_MESSAGES.DATE_VALIDATION.TYPE }),
  )
}
