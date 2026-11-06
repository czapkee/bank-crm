import { Global, Module } from '@nestjs/common'

import { DateMapUtil } from './utils/date-map.util.js'
import { PaginationUtil } from './utils/pagination.util.js'
import { StringValidationUtil } from './utils/string-validation.util.js'

const UTILS = [PaginationUtil, StringValidationUtil, DateMapUtil]

@Global()
@Module({
  controllers: [],
  providers: [...UTILS],
  exports: [...UTILS],
})
export class SharedUtilsModule {}
