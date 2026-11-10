import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CardAdminFeatureModule } from '@org/card-admin-feature';
import { getEnvFilePaths } from '@org/nest-launcher';
import { RmqModule } from '@org/rmq-config';
import { CardFeatureModule } from '@org/card-feature';
import { PaymentAdminFeatureModule } from '@org/payment-admin-feature';
import { PaymentFeatureModule } from '@org/payment-feature';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: getEnvFilePaths(),
    }),
    RmqModule,
    CardFeatureModule,
    CardAdminFeatureModule,
    PaymentFeatureModule,
    PaymentAdminFeatureModule,
  ],
})
export class AppModule {}
