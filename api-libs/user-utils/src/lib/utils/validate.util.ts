import { status } from '@grpc/grpc-js'
import { Injectable } from '@nestjs/common'
import { RpcException } from '@nestjs/microservices'
import { StringValidationUtil } from '@org/shared-utils'
import { AUTH_CONFIG } from '@org/validation-config'
import { AUTH_MESSAGES, USER_MESSAGES } from '@org/validation-messages'

import { UserDatabaseUtil } from './database.util.js'
import { UserPasswordUtil } from './password.util.js'
import { UserTokenUtil } from './token.util.js'

import type { ClientAuthWithUser, EmployeeAuthWithUser, UserProfileData } from './database.util.js'

@Injectable()
export class UserValidateUtil {
  constructor(
    private readonly db: UserDatabaseUtil,
    private readonly password: UserPasswordUtil,
    private readonly token: UserTokenUtil,
    private readonly string: StringValidationUtil,
  ) {}

  async validateClientAccess(accessToken: string): Promise<ClientAuthWithUser> {
    const payload = this.token.verifyAccessToken(accessToken, 'client')
    const auth = await this.db.findClientAuthByUserId(payload.id)

    if (!auth) {
      this.throwError(AUTH_MESSAGES.USER_NOT_FOUND, status.UNAUTHENTICATED)
    }

    this.validateUserActive(auth.user.isActive)
    return auth
  }

  async validateEmployeeAccess(accessToken: string): Promise<EmployeeAuthWithUser> {
    const payload = this.token.verifyAccessToken(accessToken, 'employee')
    const auth = await this.db.findEmployeeAuthByUserId(payload.id)

    if (!auth) {
      this.throwError(AUTH_MESSAGES.USER_NOT_FOUND, status.UNAUTHENTICATED)
    }

    this.validateUserActive(auth.user.isActive)
    return auth
  }

  async validateClientRefresh(refreshToken: string): Promise<ClientAuthWithUser> {
    const payload = this.token.verifyRefreshToken(refreshToken, 'client')
    const auth = await this.db.findClientAuthByUserId(payload.id)

    if (!auth) {
      this.throwError(AUTH_MESSAGES.USER_NOT_FOUND, status.UNAUTHENTICATED)
    }

    this.validateUserActive(auth.user.isActive)
    return auth
  }

  async validateEmployeeRefresh(refreshToken: string): Promise<EmployeeAuthWithUser> {
    const payload = this.token.verifyRefreshToken(refreshToken, 'employee')
    const auth = await this.db.findEmployeeAuthByUserId(payload.id)

    if (!auth) {
      this.throwError(AUTH_MESSAGES.USER_NOT_FOUND, status.UNAUTHENTICATED)
    }

    this.validateUserActive(auth.user.isActive)
    return auth
  }

  async validateClientCredentials(email: string, password: string): Promise<ClientAuthWithUser> {
    this.string.validateEmail(email)
    const auth = await this.db.findClientAuthByEmail(email)

    if (!auth) {
      this.throwError(AUTH_MESSAGES.USER_NOT_FOUND, status.NOT_FOUND)
    }

    this.validateUserActive(auth.user.isActive)
    await this.validatePassword(auth.passwordHash, password)
    return auth
  }

  async validateEmployeeCredentials(email: string, password: string): Promise<EmployeeAuthWithUser> {
    this.string.validateEmail(email)
    const auth = await this.db.findEmployeeAuthByEmail(email)

    if (!auth) {
      this.throwError(AUTH_MESSAGES.USER_NOT_FOUND, status.NOT_FOUND)
    }

    this.validateUserActive(auth.user.isActive)

    if (!auth.passwordHash) {
      if (!auth.registrationExpiresAt || auth.registrationExpiresAt.getTime() <= Date.now()) {
        this.throwError(AUTH_MESSAGES.EMPLOYEE_REGISTRATION_EXPIRED, status.FAILED_PRECONDITION)
      }

      this.throwError(AUTH_MESSAGES.EMPLOYEE_NOT_REGISTERED, status.FAILED_PRECONDITION)
    }

    await this.validatePassword(auth.passwordHash, password)
    return auth
  }

  async validateEmployeeRegistration(email: string): Promise<EmployeeAuthWithUser> {
    this.string.validateEmail(email)
    const auth = await this.db.findEmployeeAuthByEmail(email)

    if (!auth) {
      this.throwError(AUTH_MESSAGES.USER_NOT_FOUND, status.NOT_FOUND)
    }

    this.validateUserActive(auth.user.isActive)

    if (auth.passwordHash) {
      this.throwError(AUTH_MESSAGES.EMPLOYEE_ALREADY_REGISTERED, status.FAILED_PRECONDITION)
    }

    if (!auth.registrationExpiresAt || auth.registrationExpiresAt.getTime() <= Date.now()) {
      this.throwError(AUTH_MESSAGES.EMPLOYEE_REGISTRATION_EXPIRED, status.FAILED_PRECONDITION)
    }

    return auth
  }

  async validateClientEmailAvailable(email: string, currentEmail?: string): Promise<void> {
    this.string.validateEmail(email)

    if (currentEmail !== undefined && currentEmail === email) {
      return
    }

    if (await this.db.findClientAuthByEmail(email)) {
      this.throwError(AUTH_MESSAGES.USER_WITH_EMAIL_EXISTS, status.ALREADY_EXISTS)
    }
  }

  async validateEmployeeEmailAvailable(email: string, currentEmail?: string): Promise<void> {
    this.string.validateEmail(email)

    if (currentEmail !== undefined && currentEmail === email) {
      return
    }

    if (await this.db.findEmployeeAuthByEmail(email)) {
      this.throwError(AUTH_MESSAGES.USER_WITH_EMAIL_EXISTS, status.ALREADY_EXISTS)
    }
  }

  async validateProfileUnique(data: UserProfileData, excludeUserId?: string): Promise<void> {
    if (data.phoneNumber && (await this.db.findUserByPhoneNumber(data.phoneNumber, excludeUserId))) {
      this.throwError(USER_MESSAGES.PHONE_NUMBER_EXISTS, status.ALREADY_EXISTS)
    }

    if (data.identifCode && (await this.db.findUserByIdentifCode(data.identifCode, excludeUserId))) {
      this.throwError(USER_MESSAGES.IDENTIF_CODE_EXISTS, status.ALREADY_EXISTS)
    }

    if (data.numPass && (await this.db.findUserByNumPass(data.numPass, excludeUserId))) {
      this.throwError(USER_MESSAGES.NUM_PASS_EXISTS, status.ALREADY_EXISTS)
    }
  }

  validatePasswordsMatch(password: string, confirmationPassword: string): void {
    if (!password) {
      this.throwError(AUTH_MESSAGES.PASSWORD_VALIDATION.NOT_EMPTY, status.INVALID_ARGUMENT)
    }

    if (password !== confirmationPassword) {
      this.throwError(AUTH_MESSAGES.PASSWORDS_NOT_SIMILAR, status.INVALID_ARGUMENT)
    }

    this.validatePasswordFormat(password)
  }

  validatePasswordFormat(password: string): void {
    if (!password) {
      this.throwError(AUTH_MESSAGES.PASSWORD_VALIDATION.NOT_EMPTY, status.INVALID_ARGUMENT)
    }

    const hasLowercase = /[a-z]/.test(password)
    const hasUppercase = /[A-Z]/.test(password)
    const hasNumbers = /[0-9]/.test(password)
    const hasSymbols = /[^A-Za-z0-9]/.test(password)

    const isValid =
      password.length >= AUTH_CONFIG.PASSWORD.MIN_LENGTH &&
      (hasLowercase ? 1 : 0) >= AUTH_CONFIG.PASSWORD.MIN_LOWERCASE &&
      (hasUppercase ? 1 : 0) >= AUTH_CONFIG.PASSWORD.MIN_UPPERCASE &&
      (hasNumbers ? 1 : 0) >= AUTH_CONFIG.PASSWORD.MIN_NUMBERS &&
      (hasSymbols ? 1 : 0) >= AUTH_CONFIG.PASSWORD.MIN_SYMBOLS

    if (!isValid) {
      this.throwError(AUTH_MESSAGES.PASSWORD_VALIDATION.STRONG, status.INVALID_ARGUMENT)
    }
  }

  async validatePassword(passwordHash: string, password: string): Promise<void> {
    if (!password || !(await this.password.verifyPassword(passwordHash, password))) {
      this.throwError(AUTH_MESSAGES.INVALID_PASSWORD, status.UNAUTHENTICATED)
    }
  }

  async validateClientExists(id: string): Promise<ClientAuthWithUser> {
    this.string.validateId(id)
    const auth = await this.db.findClientAuthByUserId(id)

    if (!auth) {
      this.throwError(USER_MESSAGES.CLIENT_NOT_FOUND, status.NOT_FOUND)
    }

    return auth
  }

  async validateEmployeeExists(id: string): Promise<EmployeeAuthWithUser> {
    this.string.validateId(id)
    const auth = await this.db.findEmployeeAuthByUserId(id)

    if (!auth) {
      this.throwError(USER_MESSAGES.EMPLOYEE_NOT_FOUND, status.NOT_FOUND)
    }

    return auth
  }

  validateUserActive(isActive: boolean): void {
    if (!isActive) {
      this.throwError(AUTH_MESSAGES.USER_INACTIVE, status.UNAUTHENTICATED)
    }
  }

  validateClientNotBlocked(isActive: boolean): void {
    if (!isActive) {
      this.throwError(USER_MESSAGES.CLIENT_ALREADY_BLOCKED, status.FAILED_PRECONDITION)
    }
  }

  validateClientNotActive(isActive: boolean): void {
    if (isActive) {
      this.throwError(USER_MESSAGES.CLIENT_NOT_BLOCKED, status.FAILED_PRECONDITION)
    }
  }

  validateEmployeeNotBlocked(isActive: boolean): void {
    if (!isActive) {
      this.throwError(USER_MESSAGES.EMPLOYEE_ALREADY_BLOCKED, status.FAILED_PRECONDITION)
    }
  }

  validateEmployeeNotActive(isActive: boolean): void {
    if (isActive) {
      this.throwError(USER_MESSAGES.EMPLOYEE_NOT_BLOCKED, status.FAILED_PRECONDITION)
    }
  }

  private throwError(message: string, code: status): never {
    throw new RpcException({ message, code })
  }
}
