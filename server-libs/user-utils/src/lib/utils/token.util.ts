import { Injectable } from '@nestjs/common'

@Injectable()
export class UserTokenUtil {
  generateTokens(_userId: string): { accessToken: string; refreshToken: string } {
    throw new Error('Method not implemented')
  }

  validateAccessToken(_token: string): void {
    throw new Error('Method not implemented')
  }
}
