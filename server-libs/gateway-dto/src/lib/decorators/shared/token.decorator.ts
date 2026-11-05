import { applyDecorators } from '@nestjs/common'
import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

export function RefreshToken(): PropertyDecorator {
  return applyDecorators(
    ApiProperty({
      description: 'Токен обновления',
      example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
      required: true,
    }),
    IsNotEmpty({ message: 'Токен обновления не может быть пустым' }),
    IsString({ message: 'Токен обновления должен быть строкой' }),
  )
}
