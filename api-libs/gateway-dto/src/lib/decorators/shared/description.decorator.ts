import { applyDecorators } from '@nestjs/common'
import { ApiProperty } from '@nestjs/swagger'
import { SHARED_CONFIG } from '@org/validation-config'
import { SHARED_MESSAGES } from '@org/validation-messages'
import { IsNotEmpty, IsOptional, IsString, Length } from 'class-validator'

export function Description(required = false): PropertyDecorator {
  return applyDecorators(
    ApiProperty({
      description: 'Описание',
      example: 'Описание записи',
      required,
      minLength: SHARED_CONFIG.DESCRIPTION.MIN_LENGTH,
      maxLength: SHARED_CONFIG.DESCRIPTION.MAX_LENGTH,
    }),
    required ? IsNotEmpty({ message: SHARED_MESSAGES.DESCRIPTION_VALIDATION.NOT_EMPTY }) : IsOptional(),
    IsString({ message: SHARED_MESSAGES.DESCRIPTION_VALIDATION.TYPE }),
    Length(SHARED_CONFIG.DESCRIPTION.MIN_LENGTH, SHARED_CONFIG.DESCRIPTION.MAX_LENGTH, { message: SHARED_MESSAGES.DESCRIPTION_VALIDATION.LENGTH }),
  )
}
