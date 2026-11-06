import { Module } from '@nestjs/common'
import { UserUtilsModule } from '@org/user-utils'

import { UserClientAdminFeatureController } from './user-client-admin-feature.controller.js'
import { UserClientAdminFeatureService } from './user-client-admin-feature.service.js'

@Module({
  imports: [UserUtilsModule],
  controllers: [UserClientAdminFeatureController],
  providers: [UserClientAdminFeatureService],
})
export class UserClientAdminFeatureModule {}
