import { Controller } from '@nestjs/common'
import { GrpcMethod } from '@nestjs/microservices'

import { UserEmployeeFeatureService } from './user-employee-feature.service.js'

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

@Controller()
export class UserEmployeeFeatureController implements EmployeeServiceContract {
  constructor(private readonly service: UserEmployeeFeatureService) {}

  @GrpcMethod('EmployeeService', 'Register')
  async Register(data: EmployeeRegisterInput): Promise<EmployeeAuthOutput> {
    return await this.service.Register(data)
  }

  @GrpcMethod('EmployeeService', 'Login')
  async Login(data: EmployeeLoginInput): Promise<EmployeeAuthOutput> {
    return await this.service.Login(data)
  }

  @GrpcMethod('EmployeeService', 'Refresh')
  async Refresh(data: EmployeeRefreshInput): Promise<EmployeeAuthOutput> {
    return await this.service.Refresh(data)
  }

  @GrpcMethod('EmployeeService', 'Validate')
  async Validate(data: EmployeeValidateInput): Promise<EmployeeUserPayload> {
    return await this.service.Validate(data)
  }

  @GrpcMethod('EmployeeService', 'GetMe')
  async GetMe(data: EmployeeValidateInput): Promise<EmployeeUserEntity> {
    return await this.service.GetMe(data)
  }

  @GrpcMethod('EmployeeService', 'UpdateProfile')
  async UpdateProfile(data: EmployeeUpdateProfileInput): Promise<EmployeeUserEntity> {
    return await this.service.UpdateProfile(data)
  }

  @GrpcMethod('EmployeeService', 'ChangePassword')
  async ChangePassword(data: EmployeeChangePasswordInput): Promise<Empty> {
    return await this.service.ChangePassword(data)
  }

  @GrpcMethod('EmployeeService', 'DeleteAccount')
  async DeleteAccount(data: EmployeeDeleteAccountInput): Promise<Empty> {
    return await this.service.DeleteAccount(data)
  }
}
