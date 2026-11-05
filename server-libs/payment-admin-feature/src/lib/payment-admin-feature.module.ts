import { Module } from '@nestjs/common'
import { CardUtilsModule } from '@org/card-utils'

import { PaymentAdminFeatureController } from './payment-admin-feature.controller.js'
import { PaymentAdminFeatureService } from './payment-admin-feature.service.js'

@Module({
  imports: [CardUtilsModule],
  controllers: [PaymentAdminFeatureController],
  providers: [PaymentAdminFeatureService],
})
export class PaymentAdminFeatureModule {}
