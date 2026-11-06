import { Injectable } from '@nestjs/common'

@Injectable()
export class LogValidateUtil {
  validateLogExists(_id: string): void {
    throw new Error('Method not implemented')
  }
}
