import { applyDecorators } from '@nestjs/common'
import { ApiProperty } from '@nestjs/swagger'
import { ReportFeedback } from '@org/enums'
import { REPORT_MESSAGES } from '@org/validation-messages'
import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator'

export function ReportFeedbackField(required = true): PropertyDecorator {
  return applyDecorators(
    ApiProperty({
      description: 'Способ обратной связи',
      enum: ReportFeedback,
      required,
    }),
    required ? IsNotEmpty({ message: REPORT_MESSAGES.FEEDBACK_VALIDATION.NOT_EMPTY }) : IsOptional(),
    IsEnum(ReportFeedback, { message: REPORT_MESSAGES.FEEDBACK_VALIDATION.ENUM() }),
  )
}
