import { Injectable } from '@nestjs/common'

@Injectable()
export class ReportValidateUtil {
  validateReportExists(_id: string): void {
    throw new Error('Method not implemented')
  }

  validateThemeExists(_id: string): void {
    throw new Error('Method not implemented')
  }
}
