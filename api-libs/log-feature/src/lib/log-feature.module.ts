import { Module } from '@nestjs/common'
import { LogUtilsModule } from '@org/log-utils'

import { LogFeatureController } from './log-feature.controller.js'
import { LogFeatureService } from './log-feature.service.js'

@Module({
  imports: [LogUtilsModule],
  controllers: [LogFeatureController],
  providers: [LogFeatureService],
})
export class LogFeatureModule {}
