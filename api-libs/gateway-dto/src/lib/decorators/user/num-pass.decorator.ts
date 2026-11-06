import { applyDecorators } from '@nestjs/common'
import { ApiProperty } from '@nestjs/swagger'
import { USER_CONFIG } from '@org/validation-config'
import { USER_MESSAGES } from '@org/validation-messages'
import { IsNotEmpty, IsOptional, IsString, Length } from 'class-validator'

export function NumPass(required = true): PropertyDecorator {
  return applyDecorators(
    ApiProperty({
      description: 'Номер паспорта',
      example: 'AB1234567',
      required,
      minLength: USER_CONFIG.NUM_PASS.MIN_LENGTH,
      maxLength: USER_CONFIG.NUM_PASS.MAX_LENGTH,
    }),
    required ? IsNotEmpty({ message: USER_MESSAGES.NUM_PASS_VALIDATION.NOT_EMPTY }) : IsOptional(),
    IsString({ message: USER_MESSAGES.NUM_PASS_VALIDATION.TYPE }),
    Length(USER_CONFIG.NUM_PASS.MIN_LENGTH, USER_CONFIG.NUM_PASS.MAX_LENGTH, { message: USER_MESSAGES.NUM_PASS_VALIDATION.LENGTH }),
  )
}
