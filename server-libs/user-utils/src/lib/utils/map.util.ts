import { Injectable } from '@nestjs/common'

@Injectable()
export class UserMapUtil {
  mapClient(_client: unknown): unknown {
    throw new Error('Method not implemented')
  }

  mapEmployee(_employee: unknown): unknown {
    throw new Error('Method not implemented')
  }
}
