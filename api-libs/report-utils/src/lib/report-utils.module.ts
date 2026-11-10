import { Global, Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { OrgReportDatabaseModule } from '@org/report-database'
import { SharedUtilsModule } from '@org/shared-utils'

import { ReportUserSyncController } from './controllers/user-sync.controller.js'
import { ReportAuthUtil } from './utils/auth.util.js'
import { ReportDatabaseUtil } from './utils/database.util.js'
import { ReportMapUtil } from './utils/map.util.js'
import { ReportValidateUtil } from './utils/validate.util.js'

const UTILS = [ReportAuthUtil, ReportDatabaseUtil, ReportMapUtil, ReportValidateUtil]

@Global()
@Module({
  imports: [
    SharedUtilsModule,
    OrgReportDatabaseModule,
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
  controllers: [ReportUserSyncController],
  providers: [...UTILS],
  exports: [...UTILS],
})
export class ReportUtilsModule {}
