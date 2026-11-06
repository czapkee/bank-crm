import { applyDecorators } from '@nestjs/common'
import { ApiProperty } from '@nestjs/swagger'
import { AUTH_CONFIG } from '@org/validation-config'
import { AUTH_MESSAGES } from '@org/validation-messages'
import { IsEmail, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from 'class-validator'

export function Email(required = true): PropertyDecorator {
  return applyDecorators(
    ApiProperty({
      description: 'Адрес электронной почты',
      example: 'user@example.com',
      required,
      minLength: AUTH_CONFIG.EMAIL.MIN_LENGTH,
      maxLength: AUTH_CONFIG.EMAIL.MAX_LENGTH,
    }),
    required ? IsNotEmpty({ message: AUTH_MESSAGES.EMAIL_VALIDATION.NOT_EMPTY }) : IsOptional(),
    IsString({ message: AUTH_MESSAGES.EMAIL_VALIDATION.TYPE }),
    MinLength(AUTH_CONFIG.EMAIL.MIN_LENGTH, { message: AUTH_MESSAGES.EMAIL_VALIDATION.MIN_LENGTH }),
    MaxLength(AUTH_CONFIG.EMAIL.MAX_LENGTH, { message: AUTH_MESSAGES.EMAIL_VALIDATION.MAX_LENGTH }),
    IsEmail({ allow_ip_domain: AUTH_CONFIG.EMAIL.ALLOW_IP_DOMAINS }, { message: AUTH_MESSAGES.EMAIL_VALIDATION.EMAIL }),
  )
}
