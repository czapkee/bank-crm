import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { getEnvFilePaths } from '@org/nest-launcher';
import { RmqModule } from '@org/rmq-config';
import { ReportAdminFeatureModule } from '@org/report-admin-feature';
import { ReportFeatureModule } from '@org/report-feature';
import { ThemeAdminFeatureModule } from '@org/theme-admin-feature';
import { ThemeFeatureModule } from '@org/theme-feature';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: getEnvFilePaths(),
    }),
    RmqModule,
    ReportFeatureModule,
    ReportAdminFeatureModule,
    ThemeFeatureModule,
    ThemeAdminFeatureModule,
  ],
})
export class AppModule {}
