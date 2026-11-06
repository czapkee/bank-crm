import { status } from '@grpc/grpc-js'
import { Injectable } from '@nestjs/common'
import { JsonWebTokenError, JwtService, TokenExpiredError } from '@nestjs/jwt'
import { RpcException } from '@nestjs/microservices'
import { AUTH_CONFIG } from '@org/validation-config'
import { AUTH_MESSAGES } from '@org/validation-messages'

import type { AuthTokenPayload, AuthUserType } from '@org/base-types'

@Injectable()
export class UserTokenUtil {
  private readonly accessTtl = AUTH_CONFIG.TOKEN.ACCESS_EXPIRE_MINUTES * 60
  private readonly refreshTtl = AUTH_CONFIG.TOKEN.REFRESH_EXPIRE_DAYS * 24 * 60 * 60

  constructor(private readonly jwt: JwtService) {}

  generateTokens(
    id: string,
    type: AuthUserType,
    role?: number,
  ): { accessToken: string; refreshToken: string } {
    const payload = role === undefined ? { id, type } : { id, type, role }

    const accessToken = this.jwt.sign(
      { ...payload, tokenType: 'access' },
      { expiresIn: this.accessTtl, algorithm: 'HS256' },
    )

    const refreshToken = this.jwt.sign(
      { ...payload, tokenType: 'refresh' },
      { expiresIn: this.refreshTtl, algorithm: 'HS256' },
    )

    return { accessToken, refreshToken }
  }

  verifyAccessToken(token: string, type: AuthUserType): AuthTokenPayload {
    const payload = this.verifyToken(token)

    if (payload.tokenType !== 'access') {
      this.throwUnauthorized(AUTH_MESSAGES.TOKEN_TYPE_INVALID)
    }

    if (payload.type !== type) {
      this.throwUnauthorized(AUTH_MESSAGES.TOKEN_TYPE_INVALID)
    }

    return payload
  }

  verifyRefreshToken(token: string, type: AuthUserType): AuthTokenPayload {
    const payload = this.verifyToken(token)

    if (payload.tokenType !== 'refresh') {
      this.throwUnauthorized(AUTH_MESSAGES.TOKEN_TYPE_INVALID)
    }

    if (payload.type !== type) {
      this.throwUnauthorized(AUTH_MESSAGES.TOKEN_TYPE_INVALID)
    }

    return payload
  }

  private verifyToken(token: string): AuthTokenPayload {
    if (!token || typeof token !== 'string') {
      this.throwUnauthorized(AUTH_MESSAGES.TOKEN_NOT_FOUND)
    }

    try {
      return this.jwt.verify<AuthTokenPayload>(token, {
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
  }

  private throwUnauthorized(message: string): never {
    throw new RpcException({
      message,
      code: status.UNAUTHENTICATED,
    })
  }
}
