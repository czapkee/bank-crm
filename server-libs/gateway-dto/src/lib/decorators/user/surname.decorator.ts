import { applyDecorators } from '@nestjs/common'
import { ApiProperty } from '@nestjs/swagger'
import { USER_CONFIG } from '@org/validation-config'
import { USER_MESSAGES } from '@org/validation-messages'
import { IsNotEmpty, IsOptional, IsString, Length } from 'class-validator'

export function Surname(required = true): PropertyDecorator {
  return applyDecorators(
    ApiProperty({
      description: 'Фамилия пользователя',
      example: 'Иванов',
      required,
      minLength: USER_CONFIG.SURNAME.MIN_LENGTH,
      maxLength: USER_CONFIG.SURNAME.MAX_LENGTH,
    }),
    required ? IsNotEmpty({ message: USER_MESSAGES.SURNAME_VALIDATION.NOT_EMPTY }) : IsOptional(),
    IsString({ message: USER_MESSAGES.SURNAME_VALIDATION.TYPE }),
    Length(USER_CONFIG.SURNAME.MIN_LENGTH, USER_CONFIG.SURNAME.MAX_LENGTH, { message: USER_MESSAGES.SURNAME_VALIDATION.LENGTH }),
  )
}
