import { join } from 'path'

import { Global, Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { ClientsModule, GrpcOptions, Transport } from '@nestjs/microservices'
import { PassportModule } from '@nestjs/passport'
import { workspaceRoot } from 'nx/src/utils/workspace-root'

import { AuthJWTGuard } from './guards/auth-jwt.guard.js'
import { RolesGuard } from './guards/roles.guard.js'
import { CookieService } from './services/cookie.service.js'
import { JwtStrategy } from './strategies/jwt.strategy.js'

@Global()
@Module({
  imports: [
    ConfigModule,
    PassportModule,
    ClientsModule.registerAsync([
      {
        name: 'USER_CLIENT',
        imports: [ConfigModule],
        useFactory: (config: ConfigService): GrpcOptions => ({
          transport: Transport.GRPC,
          options: {
            url:
              config.get<string>('BANK_CRM_USER_GRPC_URL') ??
              config.get<string>('BANK_CRM_USER_GRPC_URL', 'localhost:5003'),
            package: 'user',
            protoPath: join(workspaceRoot, 'proto/user.proto'),
            loader: {
              includeDirs: [join(workspaceRoot, 'proto')],
              defaults: true,
            },
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  providers: [JwtStrategy, AuthJWTGuard, RolesGuard, CookieService],
  exports: [JwtStrategy, AuthJWTGuard, RolesGuard, CookieService],
})
export class GatewayAuthorizationModule {}
