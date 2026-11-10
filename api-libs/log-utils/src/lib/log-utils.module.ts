import { Global, Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { OrgLogDatabaseModule } from '@org/log-database'
import { SharedUtilsModule } from '@org/shared-utils'

import { LogAuthUtil } from './utils/auth.util.js'
import { LogDatabaseUtil } from './utils/database.util.js'
import { LogMapUtil } from './utils/map.util.js'
import { LogValidateUtil } from './utils/validate.util.js'

const UTILS = [LogAuthUtil, LogDatabaseUtil, LogMapUtil, LogValidateUtil]

@Global()
@Module({
  imports: [
    SharedUtilsModule,
    OrgLogDatabaseModule,
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret:
          config.get<string>('BANK-CRM_JWT_SECRET') ??
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
