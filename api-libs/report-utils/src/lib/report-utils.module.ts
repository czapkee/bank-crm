import { Global, Module } from '@nestjs/common'
import { OrgReportDatabaseModule } from '@org/report-database'
import { SharedUtilsModule } from '@org/shared-utils'

import { ReportDatabaseUtil } from './utils/database.util.js'
import { ReportMapUtil } from './utils/map.util.js'
import { ReportValidateUtil } from './utils/validate.util.js'

const UTILS = [ReportDatabaseUtil, ReportMapUtil, ReportValidateUtil]

@Global()
@Module({
  imports: [SharedUtilsModule, OrgReportDatabaseModule],
  controllers: [],
  providers: [...UTILS],
  exports: [...UTILS],
})
export class ReportUtilsModule {}
