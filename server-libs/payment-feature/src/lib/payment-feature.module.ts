import { Module } from '@nestjs/common'
import { CardUtilsModule } from '@org/card-utils'

import { PaymentFeatureController } from './payment-feature.controller.js'
import { PaymentFeatureService } from './payment-feature.service.js'

@Module({
  imports: [CardUtilsModule],
  controllers: [PaymentFeatureController],
  providers: [PaymentFeatureService],
})
export class PaymentFeatureModule {}
