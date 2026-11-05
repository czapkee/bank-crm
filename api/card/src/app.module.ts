import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CardAdminFeatureModule } from '@org/card-admin-feature';
import { CardFeatureModule } from '@org/card-feature';
import { PaymentAdminFeatureModule } from '@org/payment-admin-feature';
import { PaymentFeatureModule } from '@org/payment-feature';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CardFeatureModule,
    CardAdminFeatureModule,
    PaymentFeatureModule,
    PaymentAdminFeatureModule,
  ],
})
export class AppModule {}
