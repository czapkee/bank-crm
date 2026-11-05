import { applyDecorators } from '@nestjs/common'
import { ApiProperty } from '@nestjs/swagger'
import { PAYMENT_CONFIG } from '@org/validation-config'
import { PAYMENT_MESSAGES } from '@org/validation-messages'
import { IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator'

export function PaymentSum(required = true): PropertyDecorator {
  return applyDecorators(
    ApiProperty({
      description: 'Сумма платежа',
      example: '100.00',
      required,
    }),
    required ? IsNotEmpty({ message: PAYMENT_MESSAGES.SUM_VALIDATION.NOT_EMPTY }) : IsOptional(),
    IsString({ message: PAYMENT_MESSAGES.SUM_VALIDATION.TYPE }),
    Matches(new RegExp(`^\\d+(\\.\\d{1,${PAYMENT_CONFIG.SUM.MAX_DECIMAL_PLACES}})?$`), {
      message: PAYMENT_MESSAGES.SUM_VALIDATION.FORMAT,
    }),
  )
}
