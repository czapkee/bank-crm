import { Injectable } from '@nestjs/common'

@Injectable()
export class LogMapUtil {
  mapLog(_log: unknown): unknown {
    throw new Error('Method not implemented')
  }
}
