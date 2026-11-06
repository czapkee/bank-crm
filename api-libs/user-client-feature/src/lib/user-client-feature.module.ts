import { Module } from '@nestjs/common'
import { UserUtilsModule } from '@org/user-utils'

import { UserClientFeatureController } from './user-client-feature.controller.js'
import { UserClientFeatureService } from './user-client-feature.service.js'

@Module({
  imports: [UserUtilsModule],
  controllers: [UserClientFeatureController],
  providers: [UserClientFeatureService],
})
export class UserClientFeatureModule {}
