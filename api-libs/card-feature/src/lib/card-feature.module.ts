import { Module } from '@nestjs/common'
import { CardUtilsModule } from '@org/card-utils'

import { CardFeatureController } from './card-feature.controller.js'
import { CardFeatureService } from './card-feature.service.js'

@Module({
  imports: [CardUtilsModule],
  controllers: [CardFeatureController],
  providers: [CardFeatureService],
})
export class CardFeatureModule {}
