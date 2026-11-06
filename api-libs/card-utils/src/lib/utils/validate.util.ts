import { Injectable } from '@nestjs/common'

@Injectable()
export class CardValidateUtil {
  validateCardExists(_id: string): void {
    throw new Error('Method not implemented')
  }

  validatePaymentExists(_id: string): void {
    throw new Error('Method not implemented')
  }
}
