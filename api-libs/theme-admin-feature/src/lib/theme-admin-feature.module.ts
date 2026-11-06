import { Module } from '@nestjs/common'
import { ReportUtilsModule } from '@org/report-utils'

import { ThemeAdminFeatureController } from './theme-admin-feature.controller.js'
import { ThemeAdminFeatureService } from './theme-admin-feature.service.js'

@Module({
  imports: [ReportUtilsModule],
  controllers: [ThemeAdminFeatureController],
  providers: [ThemeAdminFeatureService],
})
export class ThemeAdminFeatureModule {}
