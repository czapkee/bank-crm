import { Injectable } from '@nestjs/common'
import { UserDatabaseUtil, UserMapUtil, UserPasswordUtil, UserTokenUtil, UserValidateUtil } from '@org/user-utils'

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
  constructor(
    private readonly db: UserDatabaseUtil,
    private readonly validate: UserValidateUtil,
    private readonly password: UserPasswordUtil,
    private readonly token: UserTokenUtil,
    private readonly map: UserMapUtil,
  ) {}

  async Register(data: ClientRegisterInput): Promise<ClientAuthOutput> {
    this.validate.validatePasswordsMatch(data.password, data.confirmationPassword)
    await this.validate.validateClientEmailAvailable(data.email)
    const passwordHash = await this.password.hashPassword(data.password)
    const auth = await this.db.createClient(data.email, passwordHash)

    return this.token.generateTokens(auth.user.id, 'client')
  }

  async Login(data: ClientLoginInput): Promise<ClientAuthOutput> {
    const auth = await this.validate.validateClientCredentials(data.email, data.password)

    return this.token.generateTokens(auth.user.id, 'client')
  }

  async Refresh(data: ClientRefreshInput): Promise<ClientAuthOutput> {
    const auth = await this.validate.validateClientRefresh(data.refreshToken)

    return this.token.generateTokens(auth.user.id, 'client')
  }

  async Validate(data: ClientValidateInput): Promise<ClientUserPayload> {
    const auth = await this.validate.validateClientAccess(data.accessToken)

    return this.map.mapClientPayload(auth)
  }

  async GetMe(data: ClientValidateInput): Promise<ClientUserEntity> {
    const auth = await this.validate.validateClientAccess(data.accessToken)

    return this.map.mapClient(auth)
  }

  async UpdateProfile(data: ClientUpdateProfileInput): Promise<ClientUserEntity> {
    const auth = await this.validate.validateClientAccess(data.validation.accessToken)
    await this.validate.validateProfileUnique(data, auth.user.id)
    const updated = await this.db.updateClientProfile(auth.user.id, data)

    return this.map.mapClient(updated)
  }

  async ChangePassword(data: ClientChangePasswordInput): Promise<Empty> {
    const auth = await this.validate.validateClientAccess(data.validation.accessToken)
    await this.validate.validatePassword(auth.passwordHash, data.oldPassword)
    this.validate.validatePasswordsMatch(data.newPassword, data.newPasswordConfirmation)
    const passwordHash = await this.password.hashPassword(data.newPassword)
    await this.db.updateClientPassword(auth.user.id, passwordHash)

    return {}
  }

  async DeleteAccount(data: ClientDeleteAccountInput): Promise<Empty> {
    const auth = await this.validate.validateClientAccess(data.validation.accessToken)
    await this.validate.validatePassword(auth.passwordHash, data.password)
    await this.db.deleteClient(auth.user.id)

    return {}
  }
}
