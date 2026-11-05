import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'

import type { ClientUserPayload } from '@org/shared-types'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get<string>('BANK_CRM_JWT_SECRET', 'DEFAULT_JWT_SECRET_DONT_USE_IN_PRODUCTION'),
    })
  }

  validate(payload: ClientUserPayload): ClientUserPayload {
    return payload
  }
}
