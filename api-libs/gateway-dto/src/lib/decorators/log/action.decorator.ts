import { applyDecorators } from '@nestjs/common'
import { ApiProperty } from '@nestjs/swagger'
import { LOG_CONFIG } from '@org/validation-config'
import { LOG_MESSAGES } from '@org/validation-messages'
import { IsNotEmpty, IsOptional, IsString, Length } from 'class-validator'

export function LogAction(required = false): PropertyDecorator {
  return applyDecorators(
    ApiProperty({
      description: 'Название действия',
      example: 'Создание клиента',
      required,
      minLength: LOG_CONFIG.ACTION.MIN_LENGTH,
      maxLength: LOG_CONFIG.ACTION.MAX_LENGTH,
    }),
    required ? IsNotEmpty({ message: LOG_MESSAGES.ACTION_VALIDATION.NOT_EMPTY }) : IsOptional(),
    IsString({ message: LOG_MESSAGES.ACTION_VALIDATION.TYPE }),
    Length(LOG_CONFIG.ACTION.MIN_LENGTH, LOG_CONFIG.ACTION.MAX_LENGTH, { message: LOG_MESSAGES.ACTION_VALIDATION.LENGTH }),
  )
}
