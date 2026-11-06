import { Module } from '@nestjs/common'
import { UserUtilsModule } from '@org/user-utils'

import { UserEmployeeFeatureController } from './user-employee-feature.controller.js'
import { UserEmployeeFeatureService } from './user-employee-feature.service.js'

@Module({
  imports: [UserUtilsModule],
  controllers: [UserEmployeeFeatureController],
  providers: [UserEmployeeFeatureService],
})
export class UserEmployeeFeatureModule {}
