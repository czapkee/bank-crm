import { Module } from '@nestjs/common'
import { UserUtilsModule } from '@org/user-utils'

import { UserEmployeeAdminFeatureController } from './user-employee-admin-feature.controller.js'
import { UserEmployeeAdminFeatureService } from './user-employee-admin-feature.service.js'

@Module({
  imports: [UserUtilsModule],
  controllers: [UserEmployeeAdminFeatureController],
  providers: [UserEmployeeAdminFeatureService],
})
export class UserEmployeeAdminFeatureModule {}
