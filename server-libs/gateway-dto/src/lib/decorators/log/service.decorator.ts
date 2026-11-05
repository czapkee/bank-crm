import { applyDecorators } from '@nestjs/common'
import { ApiProperty } from '@nestjs/swagger'
import { LOG_CONFIG } from '@org/validation-config'
import { LOG_MESSAGES } from '@org/validation-messages'
import { IsNotEmpty, IsOptional, IsString, Length } from 'class-validator'

export function LogService(required = false): PropertyDecorator {
  return applyDecorators(
    ApiProperty({
      description: 'Название сервиса',
      example: 'user',
      required,
      minLength: LOG_CONFIG.SERVICE.MIN_LENGTH,
      maxLength: LOG_CONFIG.SERVICE.MAX_LENGTH,
    }),
    required ? IsNotEmpty({ message: LOG_MESSAGES.SERVICE_VALIDATION.NOT_EMPTY }) : IsOptional(),
    IsString({ message: LOG_MESSAGES.SERVICE_VALIDATION.TYPE }),
    Length(LOG_CONFIG.SERVICE.MIN_LENGTH, LOG_CONFIG.SERVICE.MAX_LENGTH, { message: LOG_MESSAGES.SERVICE_VALIDATION.LENGTH }),
  )
}
