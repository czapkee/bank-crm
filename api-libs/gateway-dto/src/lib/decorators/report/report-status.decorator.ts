import { applyDecorators } from '@nestjs/common'
import { ApiProperty } from '@nestjs/swagger'
import { ReportStatus } from '@org/enums'
import { REPORT_MESSAGES } from '@org/validation-messages'
import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator'

export function ReportStatusField(required = true): PropertyDecorator {
  return applyDecorators(
    ApiProperty({
      description: 'Статус обращения',
      enum: ReportStatus,
      required,
    }),
    required ? IsNotEmpty({ message: REPORT_MESSAGES.STATUS_VALIDATION.NOT_EMPTY }) : IsOptional(),
    IsEnum(ReportStatus, { message: REPORT_MESSAGES.STATUS_VALIDATION.ENUM() }),
  )
}
