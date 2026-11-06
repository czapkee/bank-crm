import { Injectable } from '@nestjs/common'
import { UserDatabaseUtil, UserMapUtil, UserPasswordUtil, UserTokenUtil, UserValidateUtil } from '@org/user-utils'

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
  constructor(
    private readonly db: UserDatabaseUtil,
    private readonly validate: UserValidateUtil,
    private readonly password: UserPasswordUtil,
    private readonly token: UserTokenUtil,
    private readonly map: UserMapUtil,
  ) {}

  async Register(data: EmployeeRegisterInput): Promise<EmployeeAuthOutput> {
    this.validate.validatePasswordsMatch(data.password, data.confirmationPassword)
    const auth = await this.validate.validateEmployeeRegistration(data.email)
    const passwordHash = await this.password.hashPassword(data.password)
    const updated = await this.db.registerEmployee(auth.user.id, passwordHash)

    return this.token.generateTokens(updated.user.id, 'employee', this.map.mapRole(updated.role))
  }

  async Login(data: EmployeeLoginInput): Promise<EmployeeAuthOutput> {
    const auth = await this.validate.validateEmployeeCredentials(data.email, data.password)

    return this.token.generateTokens(auth.user.id, 'employee', this.map.mapRole(auth.role))
  }

  async Refresh(data: EmployeeRefreshInput): Promise<EmployeeAuthOutput> {
    const auth = await this.validate.validateEmployeeRefresh(data.refreshToken)

    return this.token.generateTokens(auth.user.id, 'employee', this.map.mapRole(auth.role))
  }

  async Validate(data: EmployeeValidateInput): Promise<EmployeeUserPayload> {
    const auth = await this.validate.validateEmployeeAccess(data.accessToken)

    return this.map.mapEmployeePayload(auth)
  }

  async GetMe(data: EmployeeValidateInput): Promise<EmployeeUserEntity> {
    const auth = await this.validate.validateEmployeeAccess(data.accessToken)

    return this.map.mapEmployee(auth)
  }

  async UpdateProfile(data: EmployeeUpdateProfileInput): Promise<EmployeeUserEntity> {
    const auth = await this.validate.validateEmployeeAccess(data.validation.accessToken)
    await this.validate.validateProfileUnique(data, auth.user.id)
    const updated = await this.db.updateEmployeeProfile(auth.user.id, data)

    return this.map.mapEmployee(updated)
  }

  async ChangePassword(data: EmployeeChangePasswordInput): Promise<Empty> {
    const auth = await this.validate.validateEmployeeAccess(data.validation.accessToken)

    if (!auth.passwordHash) {
      this.validate.validatePasswordFormat(data.newPassword)
    } else {
      await this.validate.validatePassword(auth.passwordHash, data.oldPassword)
    }

    this.validate.validatePasswordsMatch(data.newPassword, data.newPasswordConfirmation)
    const passwordHash = await this.password.hashPassword(data.newPassword)
    await this.db.updateEmployeePassword(auth.user.id, passwordHash)

    return {}
  }

  async DeleteAccount(data: EmployeeDeleteAccountInput): Promise<Empty> {
    const auth = await this.validate.validateEmployeeAccess(data.validation.accessToken)

    if (auth.passwordHash) {
      await this.validate.validatePassword(auth.passwordHash, data.password)
    }

    await this.db.deleteEmployee(auth.user.id)

    return {}
  }
}
