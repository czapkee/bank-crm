import { Global, Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { RedisModule } from '@nestjs-modules/ioredis'
import { OrgLogDatabaseModule } from '@org/log-database'
import { SharedUtilsModule } from '@org/shared-utils'

import { LogAuthUtil } from './utils/auth.util.js'
import { LogCacheUtil } from './utils/cache.util.js'
import { LogDatabaseUtil } from './utils/database.util.js'
import { LogMapUtil } from './utils/map.util.js'
import { LogValidateUtil } from './utils/validate.util.js'

const UTILS = [LogAuthUtil, LogCacheUtil, LogDatabaseUtil, LogMapUtil, LogValidateUtil]

@Global()
@Module({
  imports: [
    SharedUtilsModule,
    OrgLogDatabaseModule,
    ConfigModule,
    RedisModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'single',
        url: config.get<string>(
          'BANK_CRM_REDIS_URL',
          'redis://localhost:6379',
        ),
        options: {
          password: config.get<string>('BANK_CRM_REDIS_PASSWORD') || undefined,
        },
      }),
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret:
          config.get<string>('BANK_CRM_JWT_SECRET') ??
          'DEFAULT_JWT_SECRET_DONT_USE_IN_PRODUCTION',
        signOptions: {
          algorithm: 'HS256',
        },
        verifyOptions: {
          algorithms: ['HS256'],
          ignoreExpiration: false,
        },
      }),
    }),
  ],
  controllers: [],
  providers: [...UTILS],
  exports: [...UTILS],
})
export class LogUtilsModule {}
