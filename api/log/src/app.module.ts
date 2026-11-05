import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LogFeatureModule } from '@org/log-feature';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    LogFeatureModule,
  ],
})
export class AppModule {}
