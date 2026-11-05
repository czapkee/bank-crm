import { applyDecorators } from '@nestjs/common'
import { ApiProperty } from '@nestjs/swagger'
import { SHARED_CONFIG } from '@org/validation-config'
import { SHARED_MESSAGES } from '@org/validation-messages'
import { IsNotEmpty, IsOptional, IsString, Length } from 'class-validator'

export function Name(required = true): PropertyDecorator {
  return applyDecorators(
    ApiProperty({
      description: 'Имя пользователя',
      example: 'Иван',
      required,
      minLength: SHARED_CONFIG.NAME.MIN_LENGTH,
      maxLength: SHARED_CONFIG.NAME.MAX_LENGTH,
    }),
    required ? IsNotEmpty({ message: SHARED_MESSAGES.NAME_VALIDATION.NOT_EMPTY }) : IsOptional(),
    IsString({ message: SHARED_MESSAGES.NAME_VALIDATION.TYPE }),
    Length(SHARED_CONFIG.NAME.MIN_LENGTH, SHARED_CONFIG.NAME.MAX_LENGTH, { message: SHARED_MESSAGES.NAME_VALIDATION.LENGTH }),
  )
}
