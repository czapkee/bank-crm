import { Injectable } from '@nestjs/common'

import type {
  EmployeeAuthOutput,
  EmployeeChangePasswordInput,
  EmployeeDeleteAccountInput,
  EmployeeLoginInput,
  EmployeeRefreshInput,
  EmployeeRegisterInput,
  EmployeeServiceContract,
  EmployeeUpdateProfileInput,
  EmployeeUserEntity,
  EmployeeUserPayload,
  EmployeeValidateInput,
  Empty,
} from '@org/grpc-types'

@Injectable()
export class UserEmployeeFeatureService implements EmployeeServiceContract {
  async Register(_data: EmployeeRegisterInput): Promise<EmployeeAuthOutput> {
    throw new Error('Method not implemented')
  }

  async Login(_data: EmployeeLoginInput): Promise<EmployeeAuthOutput> {
    throw new Error('Method not implemented')
  }

  async Refresh(_data: EmployeeRefreshInput): Promise<EmployeeAuthOutput> {
    throw new Error('Method not implemented')
  }

  async Validate(_data: EmployeeValidateInput): Promise<EmployeeUserPayload> {
    throw new Error('Method not implemented')
  }

  async GetMe(_data: EmployeeValidateInput): Promise<EmployeeUserEntity> {
    throw new Error('Method not implemented')
  }

  async UpdateProfile(_data: EmployeeUpdateProfileInput): Promise<EmployeeUserEntity> {
    throw new Error('Method not implemented')
  }

  async ChangePassword(_data: EmployeeChangePasswordInput): Promise<Empty> {
    throw new Error('Method not implemented')
  }

  async DeleteAccount(_data: EmployeeDeleteAccountInput): Promise<Empty> {
    throw new Error('Method not implemented')
  }
}
