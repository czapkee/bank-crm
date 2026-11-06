import { Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { AUTH_CONFIG } from '@org/validation-config'
import { AUTH_MESSAGES } from '@org/validation-messages'

import type { Request, Response } from 'express'

const REFRESH_TOKEN_COOKIE = 'refreshToken'

@Injectable()
export class CookieService {
  private readonly isDevMode: boolean

  constructor(config: ConfigService) {
    this.isDevMode = config.get<string>('BANK-CRM_DEV_MODE', 'false') === 'true'
  }

  setRefreshToken(res: Response, token: string): void {
    const expires = new Date()
    expires.setDate(expires.getDate() + AUTH_CONFIG.TOKEN.REFRESH_EXPIRE_DAYS)

    res.cookie(REFRESH_TOKEN_COOKIE, token, {
      expires,
      sameSite: 'lax',
      httpOnly: true,
      secure: !this.isDevMode,
    })
  }

  removeRefreshToken(res: Response): void {
    res.clearCookie(REFRESH_TOKEN_COOKIE, {
      httpOnly: true,
      secure: !this.isDevMode,
      sameSite: 'lax',
    })
  }

  getRefreshToken(req: Request): string {
    const token: unknown = req.cookies?.[REFRESH_TOKEN_COOKIE]

    if (typeof token !== 'string' || !token) {
      throw new UnauthorizedException(AUTH_MESSAGES.TOKEN_NOT_FOUND)
    }

    return token
  }
}
