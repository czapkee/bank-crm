import { applyDecorators } from '@nestjs/common'
import { ApiProperty } from '@nestjs/swagger'
import { USER_CONFIG } from '@org/validation-config'
import { USER_MESSAGES } from '@org/validation-messages'
import { IsNotEmpty, IsOptional, IsString, Length } from 'class-validator'

export function FatherName(required = false): PropertyDecorator {
  return applyDecorators(
    ApiProperty({
      description: 'Отчество пользователя',
      example: 'Иванович',
      required,
      minLength: USER_CONFIG.FATHER_NAME.MIN_LENGTH,
      maxLength: USER_CONFIG.FATHER_NAME.MAX_LENGTH,
    }),
    required ? IsNotEmpty({ message: USER_MESSAGES.FATHER_NAME_VALIDATION.NOT_EMPTY }) : IsOptional(),
    IsString({ message: USER_MESSAGES.FATHER_NAME_VALIDATION.TYPE }),
    Length(USER_CONFIG.FATHER_NAME.MIN_LENGTH, USER_CONFIG.FATHER_NAME.MAX_LENGTH, { message: USER_MESSAGES.FATHER_NAME_VALIDATION.LENGTH }),
  )
}
