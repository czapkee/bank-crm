import { Global, Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { SharedUtilsModule } from '@org/shared-utils'
import { UserDatabaseModule } from '@org/user-database'

import { UserDatabaseUtil } from './utils/database.util.js'
import { UserMapUtil } from './utils/map.util.js'
import { UserPasswordUtil } from './utils/password.util.js'
import { UserTokenUtil } from './utils/token.util.js'
import { UserValidateUtil } from './utils/validate.util.js'

const UTILS = [UserDatabaseUtil, UserMapUtil, UserValidateUtil, UserPasswordUtil, UserTokenUtil]

@Global()
@Module({
  imports: [
    SharedUtilsModule,
    UserDatabaseModule,
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
export class UserUtilsModule {}
