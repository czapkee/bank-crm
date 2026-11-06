import { Injectable } from '@nestjs/common'
import { ReportDatabaseService } from '@org/report-database'

@Injectable()
export class ReportDatabaseUtil {
  constructor(protected readonly db: ReportDatabaseService) {}
}
