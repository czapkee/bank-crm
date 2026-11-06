import { applyDecorators } from '@nestjs/common'
import { ApiProperty } from '@nestjs/swagger'
import { IsBoolean, IsNotEmpty, IsOptional } from 'class-validator'

interface BooleanFieldOptions {
  description: string
  required?: boolean
  message: string
}

export function BooleanField(options: BooleanFieldOptions): PropertyDecorator {
  const required = options.required ?? true
  return applyDecorators(
    ApiProperty({
      description: options.description,
      example: true,
      type: 'boolean',
      required,
    }),
    required ? IsNotEmpty({ message: options.message }) : IsOptional(),
    IsBoolean({ message: options.message }),
  )
}
