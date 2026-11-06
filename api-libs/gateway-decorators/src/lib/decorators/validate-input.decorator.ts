import { createParamDecorator, ExecutionContext } from '@nestjs/common'

import type { ValidateInput } from '@org/grpc-types'

export const ValidateInputParam = createParamDecorator((_data: unknown, ctx: ExecutionContext): ValidateInput => {
  const request = ctx.switchToHttp().getRequest()
  const authHeader = request.headers.authorization
  const accessToken = typeof authHeader === 'string' ? authHeader.replace('Bearer ', '') : ''

  return { accessToken }
})
