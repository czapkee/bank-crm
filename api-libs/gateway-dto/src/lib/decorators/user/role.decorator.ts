import { applyDecorators } from '@nestjs/common'
import { ApiProperty } from '@nestjs/swagger'
import { Roles } from '@org/enums'
import { AUTH_MESSAGES } from '@org/validation-messages'
import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator'

export function Role(required = true): PropertyDecorator {
  return applyDecorators(
    ApiProperty({
      description: 'Роль сотрудника',
      enum: Roles,
      required,
    }),
    required ? IsNotEmpty({ message: AUTH_MESSAGES.ROLE_VALIDATION.NOT_EMPTY }) : IsOptional(),
    IsEnum(Roles, { message: AUTH_MESSAGES.ROLE_VALIDATION.ENUM() }),
  )
}
