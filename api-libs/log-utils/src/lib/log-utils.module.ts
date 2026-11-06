import { Global, Module } from '@nestjs/common'
import { OrgLogDatabaseModule } from '@org/log-database'
import { SharedUtilsModule } from '@org/shared-utils'

import { LogDatabaseUtil } from './utils/database.util.js'
import { LogMapUtil } from './utils/map.util.js'
import { LogValidateUtil } from './utils/validate.util.js'

const UTILS = [LogDatabaseUtil, LogMapUtil, LogValidateUtil]

@Global()
@Module({
  imports: [SharedUtilsModule, OrgLogDatabaseModule],
  controllers: [],
  providers: [...UTILS],
  exports: [...UTILS],
})
export class LogUtilsModule {}
