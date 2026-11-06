import { Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { AUTH_MESSAGES } from '@org/validation-messages'
import { ExtractJwt, Strategy } from 'passport-jwt'

import type { AuthTokenPayload } from '@org/shared-types'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey:
        config.get<string>('BANK-CRM_JWT_SECRET') ??
        config.get<string>('BANK_CRM_JWT_SECRET') ??
        'DEFAULT_JWT_SECRET_DONT_USE_IN_PRODUCTION',
    })
  }

  validate(payload: AuthTokenPayload): AuthTokenPayload {
    if (payload.tokenType !== 'access') {
      throw new UnauthorizedException(AUTH_MESSAGES.TOKEN_TYPE_INVALID)
    }

    if (payload.type !== 'client' && payload.type !== 'employee') {
      throw new UnauthorizedException(AUTH_MESSAGES.TOKEN_INVALID)
    }

    return payload
  }
}
