import { Module } from '@nestjs/common'
import { ReportUtilsModule } from '@org/report-utils'

import { ReportFeatureController } from './report-feature.controller.js'
import { ReportFeatureService } from './report-feature.service.js'

@Module({
  imports: [ReportUtilsModule],
  controllers: [ReportFeatureController],
  providers: [ReportFeatureService],
})
export class ReportFeatureModule {}
