import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ReportAdminFeatureModule } from '@org/report-admin-feature';
import { ReportFeatureModule } from '@org/report-feature';
import { ThemeAdminFeatureModule } from '@org/theme-admin-feature';
import { ThemeFeatureModule } from '@org/theme-feature';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ReportFeatureModule,
    ReportAdminFeatureModule,
    ThemeFeatureModule,
    ThemeAdminFeatureModule,
  ],
})
export class AppModule {}
