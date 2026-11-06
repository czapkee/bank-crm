import { applyDecorators } from '@nestjs/common'
import { ApiProperty } from '@nestjs/swagger'
import { ReportPriority } from '@org/enums'
import { REPORT_MESSAGES } from '@org/validation-messages'
import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator'

export function ReportPriorityField(required = true): PropertyDecorator {
  return applyDecorators(
    ApiProperty({
      description: 'Приоритет обращения',
      enum: ReportPriority,
      required,
    }),
    required ? IsNotEmpty({ message: REPORT_MESSAGES.PRIORITY_VALIDATION.NOT_EMPTY }) : IsOptional(),
    IsEnum(ReportPriority, { message: REPORT_MESSAGES.PRIORITY_VALIDATION.ENUM() }),
  )
}
