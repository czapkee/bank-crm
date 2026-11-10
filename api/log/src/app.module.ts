import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LogFeatureModule } from '@org/log-feature';
import { getEnvFilePaths } from '@org/nest-launcher';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: getEnvFilePaths(),
    }),
    LogFeatureModule,
  ],
})
export class AppModule {}
