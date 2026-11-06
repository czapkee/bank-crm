import { applyDecorators } from '@nestjs/common'
import { ApiProperty } from '@nestjs/swagger'
import { USER_CONFIG } from '@org/validation-config'
import { USER_MESSAGES } from '@org/validation-messages'
import { IsNotEmpty, IsOptional, IsString, Length } from 'class-validator'

export function CodeWord(required = true): PropertyDecorator {
  return applyDecorators(
    ApiProperty({
      description: 'Кодовое слово',
      example: 'Секретное слово',
      required,
      minLength: USER_CONFIG.CODE_WORD.MIN_LENGTH,
      maxLength: USER_CONFIG.CODE_WORD.MAX_LENGTH,
    }),
    required ? IsNotEmpty({ message: USER_MESSAGES.CODE_WORD_VALIDATION.NOT_EMPTY }) : IsOptional(),
    IsString({ message: USER_MESSAGES.CODE_WORD_VALIDATION.TYPE }),
    Length(USER_CONFIG.CODE_WORD.MIN_LENGTH, USER_CONFIG.CODE_WORD.MAX_LENGTH, { message: USER_MESSAGES.CODE_WORD_VALIDATION.LENGTH }),
  )
}
