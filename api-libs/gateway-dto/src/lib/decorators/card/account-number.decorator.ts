import { applyDecorators } from '@nestjs/common'
import { ApiProperty } from '@nestjs/swagger'
import { CARD_CONFIG } from '@org/validation-config'
import { CARD_MESSAGES } from '@org/validation-messages'
import { IsNotEmpty, IsOptional, IsString, Length } from 'class-validator'

export function AccountNumber(required = true): PropertyDecorator {
  return applyDecorators(
    ApiProperty({
      description: 'Номер банковского счёта',
      example: 'BY12ABCD1234567890',
      required,
      minLength: CARD_CONFIG.ACCOUNT_NUMBER.MIN_LENGTH,
      maxLength: CARD_CONFIG.ACCOUNT_NUMBER.MAX_LENGTH,
    }),
    required ? IsNotEmpty({ message: CARD_MESSAGES.ACCOUNT_NUMBER_VALIDATION.NOT_EMPTY }) : IsOptional(),
    IsString({ message: CARD_MESSAGES.ACCOUNT_NUMBER_VALIDATION.TYPE }),
    Length(CARD_CONFIG.ACCOUNT_NUMBER.MIN_LENGTH, CARD_CONFIG.ACCOUNT_NUMBER.MAX_LENGTH, { message: CARD_MESSAGES.ACCOUNT_NUMBER_VALIDATION.LENGTH }),
  )
}
