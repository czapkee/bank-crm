import { Injectable } from '@nestjs/common'
import * as argon2 from 'argon2'

@Injectable()
export class UserPasswordUtil {
  async hashPassword(password: string): Promise<string> {
    return await argon2.hash(password, {
      type: argon2.argon2id,
      timeCost: 3,
      memoryCost: 65536,
      parallelism: 4,
    })
  }

  async verifyPassword(hash: string, password: string): Promise<boolean> {
    if (!hash) {
      return false
    }

    try {
      return await argon2.verify(hash, password)
    } catch {
      return false
    }
  }
}
