import { applyDecorators } from '@nestjs/common'
import { ApiProperty } from '@nestjs/swagger'
import { THEME_CONFIG } from '@org/validation-config'
import { THEME_MESSAGES } from '@org/validation-messages'
import { IsNotEmpty, IsOptional, IsString, Length } from 'class-validator'

export function ThemeName(required = true): PropertyDecorator {
  return applyDecorators(
    ApiProperty({
      description: 'Название темы',
      example: 'Банковские карты',
      required,
      minLength: THEME_CONFIG.NAME.MIN_LENGTH,
      maxLength: THEME_CONFIG.NAME.MAX_LENGTH,
    }),
    required ? IsNotEmpty({ message: THEME_MESSAGES.NAME_VALIDATION.NOT_EMPTY }) : IsOptional(),
    IsString({ message: THEME_MESSAGES.NAME_VALIDATION.TYPE }),
    Length(THEME_CONFIG.NAME.MIN_LENGTH, THEME_CONFIG.NAME.MAX_LENGTH, { message: THEME_MESSAGES.NAME_VALIDATION.LENGTH }),
  )
}
