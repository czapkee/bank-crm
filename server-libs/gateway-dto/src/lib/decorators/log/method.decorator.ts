import { applyDecorators } from '@nestjs/common'
import { ApiProperty } from '@nestjs/swagger'
import { LOG_CONFIG } from '@org/validation-config'
import { LOG_MESSAGES } from '@org/validation-messages'
import { IsNotEmpty, IsOptional, IsString, Length } from 'class-validator'

export function LogMethod(required = false): PropertyDecorator {
  return applyDecorators(
    ApiProperty({
      description: 'Название метода',
      example: 'Register',
      required,
      minLength: LOG_CONFIG.METHOD.MIN_LENGTH,
      maxLength: LOG_CONFIG.METHOD.MAX_LENGTH,
    }),
    required ? IsNotEmpty({ message: LOG_MESSAGES.METHOD_VALIDATION.NOT_EMPTY }) : IsOptional(),
    IsString({ message: LOG_MESSAGES.METHOD_VALIDATION.TYPE }),
    Length(LOG_CONFIG.METHOD.MIN_LENGTH, LOG_CONFIG.METHOD.MAX_LENGTH, { message: LOG_MESSAGES.METHOD_VALIDATION.LENGTH }),
  )
}
