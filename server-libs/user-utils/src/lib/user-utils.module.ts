import { Global, Module } from '@nestjs/common'
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
  imports: [SharedUtilsModule, UserDatabaseModule],
  controllers: [],
  providers: [...UTILS],
  exports: [...UTILS],
})
export class UserUtilsModule {}
