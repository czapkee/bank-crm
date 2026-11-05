import { applyDecorators } from '@nestjs/common'
import { ApiProperty } from '@nestjs/swagger'
import { LOG_CONFIG } from '@org/validation-config'
import { LOG_MESSAGES } from '@org/validation-messages'
import { IsNotEmpty, IsOptional, IsString, Length } from 'class-validator'

export function LogEntity(required = false): PropertyDecorator {
  return applyDecorators(
    ApiProperty({
      description: 'Название сущности',
      example: 'client',
      required,
      minLength: LOG_CONFIG.ENTITY.MIN_LENGTH,
      maxLength: LOG_CONFIG.ENTITY.MAX_LENGTH,
    }),
    required ? IsNotEmpty({ message: LOG_MESSAGES.ENTITY_VALIDATION.NOT_EMPTY }) : IsOptional(),
    IsString({ message: LOG_MESSAGES.ENTITY_VALIDATION.TYPE }),
    Length(LOG_CONFIG.ENTITY.MIN_LENGTH, LOG_CONFIG.ENTITY.MAX_LENGTH, { message: LOG_MESSAGES.ENTITY_VALIDATION.LENGTH }),
  )
}
