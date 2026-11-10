import { status as GrpcStatus } from '@grpc/grpc-js'
import { Injectable } from '@nestjs/common'
import { JsonWebTokenError, JwtService, TokenExpiredError } from '@nestjs/jwt'
import { RpcException } from '@nestjs/microservices'
import { ROLE_TO_GRPC, Roles } from '@org/enums'
import { AUTH_MESSAGES } from '@org/validation-messages'

import type { AuthTokenPayload } from '@org/base-types'

const LOG_ADMIN_GRPC_ROLES: number[] = [
  Roles.HEAD_OF_DEPARTMENT,
  Roles.SUPERADMIN,
].map((role) => ROLE_TO_GRPC[role])

@Injectable()
export class LogAuthUtil {
  constructor(private readonly jwt: JwtService) {}

  validateAdminAccess(accessToken: string): AuthTokenPayload {
    if (!accessToken || typeof accessToken !== 'string') {
      this.throwUnauthorized(AUTH_MESSAGES.TOKEN_NOT_FOUND)
    }

    let payload: AuthTokenPayload

    try {
      payload = this.jwt.verify<AuthTokenPayload>(accessToken, {
        algorithms: ['HS256'],
        ignoreExpiration: false,
      })
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        this.throwUnauthorized(AUTH_MESSAGES.TOKEN_EXPIRED)
      }

      if (error instanceof JsonWebTokenError) {
        this.throwUnauthorized(AUTH_MESSAGES.TOKEN_INVALID)
      }

      this.throwUnauthorized(AUTH_MESSAGES.TOKEN_INVALID)
    }

    if (payload.tokenType !== 'access' || payload.type !== 'employee') {
      this.throwUnauthorized(AUTH_MESSAGES.TOKEN_TYPE_INVALID)
    }

    if (typeof payload.id !== 'string' || payload.id.length === 0) {
      this.throwUnauthorized(AUTH_MESSAGES.TOKEN_INVALID)
    }

    if (payload.role === undefined || !LOG_ADMIN_GRPC_ROLES.includes(payload.role)) {
      throw new RpcException({
        message: AUTH_MESSAGES.ACCESS_DENIED,
        code: GrpcStatus.PERMISSION_DENIED,
      })
    }

    return payload
  }

  private throwUnauthorized(message: string): never {
    throw new RpcException({
      message,
      code: GrpcStatus.UNAUTHENTICATED,
    })
  }
}
