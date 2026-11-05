import { Injectable } from '@nestjs/common'

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

@Injectable()
export class UserClientFeatureService implements ClientServiceContract {
  async Register(_data: ClientRegisterInput): Promise<ClientAuthOutput> {
    throw new Error('Method not implemented')
  }

  async Login(_data: ClientLoginInput): Promise<ClientAuthOutput> {
    throw new Error('Method not implemented')
  }

  async Refresh(_data: ClientRefreshInput): Promise<ClientAuthOutput> {
    throw new Error('Method not implemented')
  }

  async Validate(_data: ClientValidateInput): Promise<ClientUserPayload> {
    throw new Error('Method not implemented')
  }

  async GetMe(_data: ClientValidateInput): Promise<ClientUserEntity> {
    throw new Error('Method not implemented')
  }

  async UpdateProfile(_data: ClientUpdateProfileInput): Promise<ClientUserEntity> {
    throw new Error('Method not implemented')
  }

  async ChangePassword(_data: ClientChangePasswordInput): Promise<Empty> {
    throw new Error('Method not implemented')
  }

  async DeleteAccount(_data: ClientDeleteAccountInput): Promise<Empty> {
    throw new Error('Method not implemented')
  }
}
