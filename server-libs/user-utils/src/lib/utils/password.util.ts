import { Injectable } from '@nestjs/common'

@Injectable()
export class UserPasswordUtil {
  async hashPassword(_password: string): Promise<string> {
    throw new Error('Method not implemented')
  }

  async verifyPassword(_hash: string, _password: string): Promise<boolean> {
    throw new Error('Method not implemented')
  }
}
