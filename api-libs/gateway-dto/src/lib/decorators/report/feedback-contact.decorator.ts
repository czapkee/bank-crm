import { applyDecorators } from '@nestjs/common'
import { ApiProperty } from '@nestjs/swagger'
import { REPORT_CONFIG } from '@org/validation-config'
import { REPORT_MESSAGES } from '@org/validation-messages'
import { IsNotEmpty, IsOptional, IsString, Length } from 'class-validator'

export function FeedbackContact(required = false): PropertyDecorator {
  return applyDecorators(
    ApiProperty({
      description: 'Контакт для обратной связи',
      example: '+375291234567',
      required,
      minLength: REPORT_CONFIG.FEEDBACK_CONTACT.MIN_LENGTH,
      maxLength: REPORT_CONFIG.FEEDBACK_CONTACT.MAX_LENGTH,
    }),
    required ? IsNotEmpty({ message: REPORT_MESSAGES.FEEDBACK_CONTACT_VALIDATION.NOT_EMPTY }) : IsOptional(),
    IsString({ message: REPORT_MESSAGES.FEEDBACK_CONTACT_VALIDATION.TYPE }),
    Length(REPORT_CONFIG.FEEDBACK_CONTACT.MIN_LENGTH, REPORT_CONFIG.FEEDBACK_CONTACT.MAX_LENGTH, { message: REPORT_MESSAGES.FEEDBACK_CONTACT_VALIDATION.LENGTH }),
  )
}
