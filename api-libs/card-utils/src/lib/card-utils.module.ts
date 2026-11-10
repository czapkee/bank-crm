import { Global, Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { OrgCardDatabaseModule } from '@org/card-database'
import { SharedUtilsModule } from '@org/shared-utils'

import { CardAuthUtil } from './utils/auth.util.js'
import { CardDatabaseUtil } from './utils/database.util.js'
import { CardMapUtil } from './utils/map.util.js'
import { CardValidateUtil } from './utils/validate.util.js'

const UTILS = [CardAuthUtil, CardDatabaseUtil, CardMapUtil, CardValidateUtil]

@Global()
@Module({
  imports: [
    SharedUtilsModule,
    OrgCardDatabaseModule,
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret:
          config.get<string>('BANK_CRM_JWT_SECRET') ??
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
export class CardUtilsModule {}
