import { Module } from '@nestjs/common'
import { CardUtilsModule } from '@org/card-utils'

import { CardAdminFeatureController } from './card-admin-feature.controller.js'
import { CardAdminFeatureService } from './card-admin-feature.service.js'

@Module({
  imports: [CardUtilsModule],
  controllers: [CardAdminFeatureController],
  providers: [CardAdminFeatureService],
})
export class CardAdminFeatureModule {}
