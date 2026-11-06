import { applyDecorators } from '@nestjs/common'
import { ApiProperty } from '@nestjs/swagger'
import { PAYMENT_CONFIG } from '@org/validation-config'
import { PAYMENT_MESSAGES } from '@org/validation-messages'
import { IsNotEmpty, IsOptional, IsString, Length } from 'class-validator'

export function PaymentService(required = true): PropertyDecorator {
  return applyDecorators(
    ApiProperty({
      description: 'Назначение платежа',
      example: 'Оплата услуг связи',
      required,
      minLength: PAYMENT_CONFIG.SERVICE.MIN_LENGTH,
      maxLength: PAYMENT_CONFIG.SERVICE.MAX_LENGTH,
    }),
    required ? IsNotEmpty({ message: PAYMENT_MESSAGES.SERVICE_VALIDATION.NOT_EMPTY }) : IsOptional(),
    IsString({ message: PAYMENT_MESSAGES.SERVICE_VALIDATION.TYPE }),
    Length(PAYMENT_CONFIG.SERVICE.MIN_LENGTH, PAYMENT_CONFIG.SERVICE.MAX_LENGTH, { message: PAYMENT_MESSAGES.SERVICE_VALIDATION.LENGTH }),
  )
}
