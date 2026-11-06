import { applyDecorators } from '@nestjs/common'
import { ApiProperty } from '@nestjs/swagger'
import { USER_CONFIG } from '@org/validation-config'
import { USER_MESSAGES } from '@org/validation-messages'
import { IsNotEmpty, IsOptional, IsString, Length } from 'class-validator'

export function Address(required = true): PropertyDecorator {
  return applyDecorators(
    ApiProperty({
      description: 'Адрес проживания',
      example: 'г. Минск, ул. Ленина, д. 1',
      required,
      minLength: USER_CONFIG.ADDRESS.MIN_LENGTH,
      maxLength: USER_CONFIG.ADDRESS.MAX_LENGTH,
    }),
    required ? IsNotEmpty({ message: USER_MESSAGES.ADDRESS_VALIDATION.NOT_EMPTY }) : IsOptional(),
    IsString({ message: USER_MESSAGES.ADDRESS_VALIDATION.TYPE }),
    Length(USER_CONFIG.ADDRESS.MIN_LENGTH, USER_CONFIG.ADDRESS.MAX_LENGTH, { message: USER_MESSAGES.ADDRESS_VALIDATION.LENGTH }),
  )
}
