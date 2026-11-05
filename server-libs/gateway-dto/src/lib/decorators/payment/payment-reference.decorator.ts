import { applyDecorators } from '@nestjs/common'
import { ApiProperty } from '@nestjs/swagger'
import { PaymentReference } from '@org/enums'
import { PAYMENT_MESSAGES } from '@org/validation-messages'
import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator'

export function PaymentReferenceField(required = true): PropertyDecorator {
  return applyDecorators(
    ApiProperty({
      description: 'Тип операции',
      enum: PaymentReference,
      required,
    }),
    required ? IsNotEmpty({ message: PAYMENT_MESSAGES.REFERENCE_VALIDATION.NOT_EMPTY }) : IsOptional(),
    IsEnum(PaymentReference, { message: PAYMENT_MESSAGES.REFERENCE_VALIDATION.ENUM() }),
  )
}
