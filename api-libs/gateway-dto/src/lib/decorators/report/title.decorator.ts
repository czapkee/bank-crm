import { applyDecorators } from '@nestjs/common'
import { ApiProperty } from '@nestjs/swagger'
import { REPORT_CONFIG } from '@org/validation-config'
import { REPORT_MESSAGES } from '@org/validation-messages'
import { IsNotEmpty, IsOptional, IsString, Length } from 'class-validator'

export function ReportTitle(required = true): PropertyDecorator {
  return applyDecorators(
    ApiProperty({
      description: 'Заголовок обращения',
      example: 'Проблема с картой',
      required,
      minLength: REPORT_CONFIG.TITLE.MIN_LENGTH,
      maxLength: REPORT_CONFIG.TITLE.MAX_LENGTH,
    }),
    required ? IsNotEmpty({ message: REPORT_MESSAGES.TITLE_VALIDATION.NOT_EMPTY }) : IsOptional(),
    IsString({ message: REPORT_MESSAGES.TITLE_VALIDATION.TYPE }),
    Length(REPORT_CONFIG.TITLE.MIN_LENGTH, REPORT_CONFIG.TITLE.MAX_LENGTH, { message: REPORT_MESSAGES.TITLE_VALIDATION.LENGTH }),
  )
}
