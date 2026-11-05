import { applyDecorators } from '@nestjs/common'
import { ApiProperty } from '@nestjs/swagger'
import { USER_CONFIG } from '@org/validation-config'
import { USER_MESSAGES } from '@org/validation-messages'
import { IsNotEmpty, IsOptional, IsString, Length } from 'class-validator'

export function IdentifCode(required = true): PropertyDecorator {
  return applyDecorators(
    ApiProperty({
      description: 'Идентификационный код',
      example: '123456789',
      required,
      minLength: USER_CONFIG.IDENTIF_CODE.MIN_LENGTH,
      maxLength: USER_CONFIG.IDENTIF_CODE.MAX_LENGTH,
    }),
    required ? IsNotEmpty({ message: USER_MESSAGES.IDENTIF_CODE_VALIDATION.NOT_EMPTY }) : IsOptional(),
    IsString({ message: USER_MESSAGES.IDENTIF_CODE_VALIDATION.TYPE }),
    Length(USER_CONFIG.IDENTIF_CODE.MIN_LENGTH, USER_CONFIG.IDENTIF_CODE.MAX_LENGTH, { message: USER_MESSAGES.IDENTIF_CODE_VALIDATION.LENGTH }),
  )
}
