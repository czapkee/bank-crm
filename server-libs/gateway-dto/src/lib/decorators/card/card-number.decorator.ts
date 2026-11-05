import { applyDecorators } from '@nestjs/common'
import { ApiProperty } from '@nestjs/swagger'
import { CARD_CONFIG } from '@org/validation-config'
import { CARD_MESSAGES } from '@org/validation-messages'
import { IsNotEmpty, IsOptional, IsString, Length, Matches } from 'class-validator'

export function CardNumber(required = true): PropertyDecorator {
  return applyDecorators(
    ApiProperty({
      description: 'Номер банковской карты',
      example: '1234 5678 9012 3456',
      required,
      minLength: CARD_CONFIG.CARD_NUMBER.MIN_LENGTH,
      maxLength: CARD_CONFIG.CARD_NUMBER.MAX_LENGTH,
    }),
    required ? IsNotEmpty({ message: CARD_MESSAGES.CARD_NUMBER_VALIDATION.NOT_EMPTY }) : IsOptional(),
    IsString({ message: CARD_MESSAGES.CARD_NUMBER_VALIDATION.TYPE }),
    Length(CARD_CONFIG.CARD_NUMBER.MIN_LENGTH, CARD_CONFIG.CARD_NUMBER.MAX_LENGTH, { message: CARD_MESSAGES.CARD_NUMBER_VALIDATION.LENGTH }),
    Matches(/^[0-9 ]+$/, { message: CARD_MESSAGES.CARD_NUMBER_VALIDATION.FORMAT }),
  )
}
