import { applyDecorators } from '@nestjs/common'
import { ApiProperty } from '@nestjs/swagger'
import { CardStatuses } from '@org/enums'
import { CARD_MESSAGES } from '@org/validation-messages'
import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator'

export function CardStatus(required = true): PropertyDecorator {
  return applyDecorators(
    ApiProperty({
      description: 'Статус карты',
      enum: CardStatuses,
      required,
    }),
    required ? IsNotEmpty({ message: CARD_MESSAGES.STATUS_VALIDATION.NOT_EMPTY }) : IsOptional(),
    IsEnum(CardStatuses, { message: CARD_MESSAGES.STATUS_VALIDATION.ENUM() }),
  )
}
