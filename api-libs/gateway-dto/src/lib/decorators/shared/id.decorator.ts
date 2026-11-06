import { applyDecorators } from '@nestjs/common'
import { ApiProperty } from '@nestjs/swagger'
import { SHARED_CONFIG } from '@org/validation-config'
import { SHARED_MESSAGES } from '@org/validation-messages'
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator'

export function Id(required = true): PropertyDecorator {
  return applyDecorators(
    ApiProperty({
      description: 'Идентификатор в формате UUID v7',
      example: '0198f3a0-7c2b-7d3e-8f4a-123456789abc',
      required,
    }),
    required ? IsNotEmpty({ message: SHARED_MESSAGES.ID_VALIDATION.NOT_EMPTY }) : IsOptional(),
    IsString({ message: SHARED_MESSAGES.ID_VALIDATION.TYPE }),
    IsUUID(SHARED_CONFIG.ID.VERSION, { message: SHARED_MESSAGES.ID_VALIDATION.UUID }),
  )
}
