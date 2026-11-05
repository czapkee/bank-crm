import { Module } from '@nestjs/common'
import { ReportUtilsModule } from '@org/report-utils'

import { ThemeFeatureController } from './theme-feature.controller.js'
import { ThemeFeatureService } from './theme-feature.service.js'

@Module({
  imports: [ReportUtilsModule],
  controllers: [ThemeFeatureController],
  providers: [ThemeFeatureService],
})
export class ThemeFeatureModule {}
