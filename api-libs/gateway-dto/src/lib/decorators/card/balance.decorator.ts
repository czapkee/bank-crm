import { applyDecorators } from '@nestjs/common'
import { ApiProperty } from '@nestjs/swagger'
import { CARD_CONFIG } from '@org/validation-config'
import { CARD_MESSAGES } from '@org/validation-messages'
import { IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator'

export function Balance(required = true): PropertyDecorator {
  return applyDecorators(
    ApiProperty({
      description: 'Баланс карты',
      example: '1000.00',
      required,
    }),
    required ? IsNotEmpty({ message: CARD_MESSAGES.BALANCE_VALIDATION.NOT_EMPTY }) : IsOptional(),
    IsString({ message: CARD_MESSAGES.BALANCE_VALIDATION.TYPE }),
    Matches(new RegExp(`^\\d+(\\.\\d{1,${CARD_CONFIG.BALANCE.MAX_DECIMAL_PLACES}})?$`), {
      message: CARD_MESSAGES.BALANCE_VALIDATION.FORMAT,
    }),
  )
}
