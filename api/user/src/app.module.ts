import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { getEnvFilePaths } from '@org/nest-launcher';
import { RmqModule } from '@org/rmq-config';
import { UserClientAdminFeatureModule } from '@org/user-client-admin-feature';
import { UserClientFeatureModule } from '@org/user-client-feature';
import { UserEmployeeAdminFeatureModule } from '@org/user-employee-admin-feature';
import { UserEmployeeFeatureModule } from '@org/user-employee-feature';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: getEnvFilePaths(),
    }),
    RmqModule,
    UserClientFeatureModule,
    UserEmployeeFeatureModule,
    UserClientAdminFeatureModule,
    UserEmployeeAdminFeatureModule,
  ],
})
export class AppModule {}
