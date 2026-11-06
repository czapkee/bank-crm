import { Global, Module } from '@nestjs/common'
import { OrgCardDatabaseModule } from '@org/card-database'
import { SharedUtilsModule } from '@org/shared-utils'

import { CardDatabaseUtil } from './utils/database.util.js'
import { CardMapUtil } from './utils/map.util.js'
import { CardValidateUtil } from './utils/validate.util.js'

const UTILS = [CardDatabaseUtil, CardMapUtil, CardValidateUtil]

@Global()
@Module({
  imports: [SharedUtilsModule, OrgCardDatabaseModule],
  controllers: [],
  providers: [...UTILS],
  exports: [...UTILS],
})
export class CardUtilsModule {}
