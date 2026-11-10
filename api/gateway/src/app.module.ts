import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GatewayAuthorizationModule } from '@org/gateway-authorization';
import { getEnvFilePaths } from '@org/nest-launcher';
import { GatewayControllersModule } from '@org/gateway-controllers';
import { GatewayMapModule } from '@org/gateway-map';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: getEnvFilePaths(),
    }),
    GatewayAuthorizationModule,
    GatewayMapModule,
    GatewayControllersModule,
  ],
})
export class AppModule {}
