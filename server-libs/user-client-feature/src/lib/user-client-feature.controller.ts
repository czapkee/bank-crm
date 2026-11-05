import { Controller } from '@nestjs/common'
import { GrpcMethod } from '@nestjs/microservices'

import { UserClientFeatureService } from './user-client-feature.service.js'

import type {
  ClientAuthOutput,
  ClientChangePasswordInput,
  ClientDeleteAccountInput,
  ClientLoginInput,
  ClientRefreshInput,
  ClientRegisterInput,
  ClientServiceContract,
  ClientUpdateProfileInput,
  ClientUserEntity,
  ClientUserPayload,
  ClientValidateInput,
  Empty,
} from '@org/grpc-types'

@Controller()
export class UserClientFeatureController implements ClientServiceContract {
  constructor(private readonly service: UserClientFeatureService) {}

  @GrpcMethod('ClientService', 'Register')
  async Register(data: ClientRegisterInput): Promise<ClientAuthOutput> {
    return await this.service.Register(data)
  }

  @GrpcMethod('ClientService', 'Login')
  async Login(data: ClientLoginInput): Promise<ClientAuthOutput> {
    return await this.service.Login(data)
  }

  @GrpcMethod('ClientService', 'Refresh')
  async Refresh(data: ClientRefreshInput): Promise<ClientAuthOutput> {
    return await this.service.Refresh(data)
  }

  @GrpcMethod('ClientService', 'Validate')
  async Validate(data: ClientValidateInput): Promise<ClientUserPayload> {
    return await this.service.Validate(data)
  }

  @GrpcMethod('ClientService', 'GetMe')
  async GetMe(data: ClientValidateInput): Promise<ClientUserEntity> {
    return await this.service.GetMe(data)
  }

  @GrpcMethod('ClientService', 'UpdateProfile')
  async UpdateProfile(data: ClientUpdateProfileInput): Promise<ClientUserEntity> {
    return await this.service.UpdateProfile(data)
  }

  @GrpcMethod('ClientService', 'ChangePassword')
  async ChangePassword(data: ClientChangePasswordInput): Promise<Empty> {
    return await this.service.ChangePassword(data)
  }

  @GrpcMethod('ClientService', 'DeleteAccount')
  async DeleteAccount(data: ClientDeleteAccountInput): Promise<Empty> {
    return await this.service.DeleteAccount(data)
  }
}
