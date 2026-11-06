import { Injectable } from '@nestjs/common'
import { UserDatabaseUtil, UserMapUtil, UserPasswordUtil, UserValidateUtil } from '@org/user-utils'

import type {
  ChangeEmployeeRoleInput,
  CreateEmployeeInput,
  EmployeeActionInput,
  EmployeeAdminServiceContract,
  EmployeeUserEntity,
  Empty,
  GetEmployeeInput,
  GetEmployeesInput,
  PaginatedEmployeesOutput,
  ResetEmployeePasswordInput,
  UpdateEmployeeInput,
} from '@org/grpc-types'

@Injectable()
export class UserEmployeeAdminFeatureService implements EmployeeAdminServiceContract {
  constructor(
    private readonly db: UserDatabaseUtil,
    private readonly validate: UserValidateUtil,
    private readonly password: UserPasswordUtil,
    private readonly map: UserMapUtil,
  ) {}

  async GetEmployees(data: GetEmployeesInput): Promise<PaginatedEmployeesOutput> {
    await this.validate.validateEmployeeAccess(data.validation.accessToken)
    const result = await this.db.getEmployees(data.pagination)

    return {
      pagination: result.pagination,
      employees: result.employees.map((employee) => this.map.mapEmployee(employee)),
    }
  }

  async GetEmployee(data: GetEmployeeInput): Promise<EmployeeUserEntity> {
    await this.validate.validateEmployeeAccess(data.validation.accessToken)
    const auth = await this.validate.validateEmployeeExists(data.id)

    return this.map.mapEmployee(auth)
  }

  async CreateEmployee(data: CreateEmployeeInput): Promise<EmployeeUserEntity> {
    await this.validate.validateEmployeeAccess(data.validation.accessToken)
    await this.validate.validateEmployeeEmailAvailable(data.email)
    await this.validate.validateProfileUnique(data)
    const auth = await this.db.createEmployeeWithProfile(data)

    return this.map.mapEmployee(auth)
  }

  async UpdateEmployee(data: UpdateEmployeeInput): Promise<EmployeeUserEntity> {
    await this.validate.validateEmployeeAccess(data.validation.accessToken)
    const existing = await this.validate.validateEmployeeExists(data.id)
    await this.validate.validateEmployeeEmailAvailable(data.email ?? existing.email, existing.email)
    await this.validate.validateProfileUnique(data, data.id)
    const auth = await this.db.updateEmployeeProfileByAdmin(data.id, data)

    return this.map.mapEmployee(auth)
  }

  async ChangeEmployeeRole(data: ChangeEmployeeRoleInput): Promise<EmployeeUserEntity> {
    await this.validate.validateEmployeeAccess(data.validation.accessToken)
    await this.validate.validateEmployeeExists(data.id)
    const auth = await this.db.changeEmployeeRole(data.id, data.role)

    return this.map.mapEmployee(auth)
  }

  async BlockEmployee(data: EmployeeActionInput): Promise<EmployeeUserEntity> {
    await this.validate.validateEmployeeAccess(data.validation.accessToken)
    const auth = await this.validate.validateEmployeeExists(data.id)
    this.validate.validateEmployeeNotBlocked(auth.user.isActive)

    return this.map.mapEmployee(await this.db.setEmployeeActive(data.id, false))
  }

  async UnblockEmployee(data: EmployeeActionInput): Promise<EmployeeUserEntity> {
    await this.validate.validateEmployeeAccess(data.validation.accessToken)
    const auth = await this.validate.validateEmployeeExists(data.id)
    this.validate.validateEmployeeNotActive(auth.user.isActive)

    return this.map.mapEmployee(await this.db.setEmployeeActive(data.id, true))
  }

  async ResetEmployeePassword(data: ResetEmployeePasswordInput): Promise<Empty> {
    await this.validate.validateEmployeeAccess(data.validation.accessToken)
    await this.validate.validateEmployeeExists(data.id)
    this.validate.validatePasswordFormat(data.newPassword)
    const passwordHash = await this.password.hashPassword(data.newPassword)
    await this.db.updateEmployeePassword(data.id, passwordHash)

    return {}
  }

  async DeleteEmployee(data: EmployeeActionInput): Promise<Empty> {
    await this.validate.validateEmployeeAccess(data.validation.accessToken)
    await this.validate.validateEmployeeExists(data.id)
    await this.db.deleteEmployee(data.id)

    return {}
  }
}
