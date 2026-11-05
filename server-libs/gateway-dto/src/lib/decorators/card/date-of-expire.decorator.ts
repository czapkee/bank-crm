import { applyDecorators } from '@nestjs/common'
import { ApiProperty } from '@nestjs/swagger'
import { CARD_MESSAGES } from '@org/validation-messages'
import { Type } from 'class-transformer'
import { IsDate, IsNotEmpty, IsOptional } from 'class-validator'

export function DateOfExpire(required = true): PropertyDecorator {
  return applyDecorators(
    ApiProperty({
      description: 'Срок действия карты',
      example: '2030-12-31T00:00:00.000Z',
      type: String,
      format: 'date-time',
      required,
    }),
    required ? IsNotEmpty({ message: CARD_MESSAGES.DATE_OF_EXPIRE_VALIDATION.NOT_EMPTY }) : IsOptional(),
    Type(() => Date),
    IsDate({ message: CARD_MESSAGES.DATE_OF_EXPIRE_VALIDATION.TYPE }),
  )
}
