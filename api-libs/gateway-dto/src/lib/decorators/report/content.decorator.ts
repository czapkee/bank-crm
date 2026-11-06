import { applyDecorators } from '@nestjs/common'
import { ApiProperty } from '@nestjs/swagger'
import { REPORT_CONFIG } from '@org/validation-config'
import { REPORT_MESSAGES } from '@org/validation-messages'
import { IsNotEmpty, IsOptional, IsString, Length } from 'class-validator'

export function ReportContent(required = true): PropertyDecorator {
  return applyDecorators(
    ApiProperty({
      description: 'Содержание обращения',
      example: 'Подробное описание проблемы',
      required,
      minLength: REPORT_CONFIG.CONTENT.MIN_LENGTH,
      maxLength: REPORT_CONFIG.CONTENT.MAX_LENGTH,
    }),
    required ? IsNotEmpty({ message: REPORT_MESSAGES.CONTENT_VALIDATION.NOT_EMPTY }) : IsOptional(),
    IsString({ message: REPORT_MESSAGES.CONTENT_VALIDATION.TYPE }),
    Length(REPORT_CONFIG.CONTENT.MIN_LENGTH, REPORT_CONFIG.CONTENT.MAX_LENGTH, { message: REPORT_MESSAGES.CONTENT_VALIDATION.LENGTH }),
  )
}
