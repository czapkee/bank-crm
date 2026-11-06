import { applyDecorators } from '@nestjs/common'
import { ApiProperty } from '@nestjs/swagger'
import { SHARED_CONFIG } from '@org/validation-config'
import { SHARED_MESSAGES } from '@org/validation-messages'
import { IsNotEmpty, IsOptional, IsString, Length, Matches } from 'class-validator'

export function Phone(required = true): PropertyDecorator {
  return applyDecorators(
    ApiProperty({
      description: 'Номер телефона',
      example: '+375291234567',
      required,
    }),
    required ? IsNotEmpty({ message: SHARED_MESSAGES.PHONE_NUMBER_VALIDATION.NOT_EMPTY }) : IsOptional(),
    IsString({ message: SHARED_MESSAGES.PHONE_NUMBER_VALIDATION.TYPE }),
    Length(SHARED_CONFIG.PHONE_NUMBER.MIN_LENGTH, SHARED_CONFIG.PHONE_NUMBER.MAX_LENGTH, {
      message: SHARED_MESSAGES.PHONE_NUMBER_VALIDATION.LENGTH,
    }),
    Matches(/^\+?[0-9\s()-]+$/, { message: SHARED_MESSAGES.PHONE_NUMBER_VALIDATION.FORMAT }),
  )
}
