import { Injectable } from '@nestjs/common'

@Injectable()
export class ReportMapUtil {
  mapReport(_report: unknown): unknown {
    throw new Error('Method not implemented')
  }

  mapTheme(_theme: unknown): unknown {
    throw new Error('Method not implemented')
  }
}
