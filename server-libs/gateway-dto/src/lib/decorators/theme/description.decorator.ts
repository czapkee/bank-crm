import { applyDecorators } from '@nestjs/common'
import { ApiProperty } from '@nestjs/swagger'
import { THEME_CONFIG } from '@org/validation-config'
import { THEME_MESSAGES } from '@org/validation-messages'
import { IsNotEmpty, IsOptional, IsString, Length } from 'class-validator'

export function ThemeDescription(required = false): PropertyDecorator {
  return applyDecorators(
    ApiProperty({
      description: 'Описание темы',
      example: 'Вопросы по банковским картам',
      required,
      minLength: THEME_CONFIG.DESCRIPTION.MIN_LENGTH,
      maxLength: THEME_CONFIG.DESCRIPTION.MAX_LENGTH,
    }),
    required ? IsNotEmpty({ message: THEME_MESSAGES.DESCRIPTION_VALIDATION.NOT_EMPTY }) : IsOptional(),
    IsString({ message: THEME_MESSAGES.DESCRIPTION_VALIDATION.TYPE }),
    Length(THEME_CONFIG.DESCRIPTION.MIN_LENGTH, THEME_CONFIG.DESCRIPTION.MAX_LENGTH, { message: THEME_MESSAGES.DESCRIPTION_VALIDATION.LENGTH }),
  )
}
