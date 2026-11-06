import { Injectable } from '@nestjs/common'

@Injectable()
export class CardMapUtil {
  mapCard(_card: unknown): unknown {
    throw new Error('Method not implemented')
  }

  mapPayment(_payment: unknown): unknown {
    throw new Error('Method not implemented')
  }
}
