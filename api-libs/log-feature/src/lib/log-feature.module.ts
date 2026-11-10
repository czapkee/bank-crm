import { Module } from '@nestjs/common'
import { LogUtilsModule } from '@org/log-utils'

import { LogFeatureController } from './log-feature.controller.js'
import { LogFeatureService } from './log-feature.service.js'
import { LogMessageController } from './log-message.controller.js'

@Module({
  imports: [LogUtilsModule],
  controllers: [LogFeatureController, LogMessageController],
  providers: [LogFeatureService],
})
export class LogFeatureModule {}
