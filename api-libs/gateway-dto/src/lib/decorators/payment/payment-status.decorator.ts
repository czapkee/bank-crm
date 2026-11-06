import { applyDecorators } from '@nestjs/common'
import { ApiProperty } from '@nestjs/swagger'
import { CardPaymentStatus } from '@org/enums'
import { PAYMENT_MESSAGES } from '@org/validation-messages'
import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator'

export function PaymentStatus(required = true): PropertyDecorator {
  return applyDecorators(
    ApiProperty({
      description: 'Статус платежа',
      enum: CardPaymentStatus,
      required,
    }),
    required ? IsNotEmpty({ message: PAYMENT_MESSAGES.STATUS_VALIDATION.NOT_EMPTY }) : IsOptional(),
    IsEnum(CardPaymentStatus, { message: PAYMENT_MESSAGES.STATUS_VALIDATION.ENUM() }),
  )
}
