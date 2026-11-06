import { Module } from '@nestjs/common'
import { ReportUtilsModule } from '@org/report-utils'

import { ReportAdminFeatureController } from './report-admin-feature.controller.js'
import { ReportAdminFeatureService } from './report-admin-feature.service.js'

@Module({
  imports: [ReportUtilsModule],
  controllers: [ReportAdminFeatureController],
  providers: [ReportAdminFeatureService],
})
export class ReportAdminFeatureModule {}
