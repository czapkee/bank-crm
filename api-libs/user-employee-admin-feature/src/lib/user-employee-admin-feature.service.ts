import { Injectable } from '@nestjs/common'
import { LogPublisher, UserSyncPublisher } from '@org/rmq-config'
import { USER_LOG_ACTIONS } from '@org/rmq-messages'
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
    private readonly log: LogPublisher,
    private readonly sync: UserSyncPublisher,
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
    const actor = await this.validate.validateEmployeeAccess(data.validation.accessToken)
    await this.validate.validateEmployeeEmailAvailable(data.email)
    await this.validate.validateProfileUnique(data)
    const auth = await this.db.createEmployeeWithProfile(data)

    this.sync.publish({ action: 'upsert', userId: auth.user.id })

    this.log.publish({
      service: 'user',
      entity: 'Employee',
      method: 'CreateEmployee',
      action: USER_LOG_ACTIONS.EMPLOYEE_ADMIN_CREATE,
      userId: actor.user.id,
      data: { employeeId: auth.user.id, email: data.email, role: data.role },
    })

    return this.map.mapEmployee(auth)
  }

  async UpdateEmployee(data: UpdateEmployeeInput): Promise<EmployeeUserEntity> {
    const actor = await this.validate.validateEmployeeAccess(data.validation.accessToken)
    const existing = await this.validate.validateEmployeeExists(data.id)
    await this.validate.validateEmployeeEmailAvailable(data.email ?? existing.email, existing.email)
    await this.validate.validateProfileUnique(data, data.id)
    const auth = await this.db.updateEmployeeProfileByAdmin(data.id, data)

    this.sync.publish({ action: 'upsert', userId: data.id })

    this.log.publish({
      service: 'user',
      entity: 'Employee',
      method: 'UpdateEmployee',
      action: USER_LOG_ACTIONS.EMPLOYEE_ADMIN_UPDATE,
      userId: actor.user.id,
      data: { employeeId: data.id, changes: { ...data } },
    })

    return this.map.mapEmployee(auth)
  }

  async ChangeEmployeeRole(data: ChangeEmployeeRoleInput): Promise<EmployeeUserEntity> {
    const actor = await this.validate.validateEmployeeAccess(data.validation.accessToken)
    await this.validate.validateEmployeeExists(data.id)
    const auth = await this.db.changeEmployeeRole(data.id, data.role)

    this.log.publish({
      service: 'user',
      entity: 'Employee',
      method: 'ChangeEmployeeRole',
      action: USER_LOG_ACTIONS.EMPLOYEE_ADMIN_CHANGE_ROLE,
      userId: actor.user.id,
      data: { employeeId: data.id, role: data.role },
    })

    return this.map.mapEmployee(auth)
  }

  async BlockEmployee(data: EmployeeActionInput): Promise<EmployeeUserEntity> {
    const actor = await this.validate.validateEmployeeAccess(data.validation.accessToken)
    const auth = await this.validate.validateEmployeeExists(data.id)
    this.validate.validateEmployeeNotBlocked(auth.user.isActive)
    const blocked = await this.db.setEmployeeActive(data.id, false)

    this.log.publish({
      service: 'user',
      entity: 'Employee',
      method: 'BlockEmployee',
      action: USER_LOG_ACTIONS.EMPLOYEE_ADMIN_BLOCK,
      userId: actor.user.id,
      data: { employeeId: data.id },
    })

    return this.map.mapEmployee(blocked)
  }

  async UnblockEmployee(data: EmployeeActionInput): Promise<EmployeeUserEntity> {
    const actor = await this.validate.validateEmployeeAccess(data.validation.accessToken)
    const auth = await this.validate.validateEmployeeExists(data.id)
    this.validate.validateEmployeeNotActive(auth.user.isActive)
    const unblocked = await this.db.setEmployeeActive(data.id, true)

    this.log.publish({
      service: 'user',
      entity: 'Employee',
      method: 'UnblockEmployee',
      action: USER_LOG_ACTIONS.EMPLOYEE_ADMIN_UNBLOCK,
      userId: actor.user.id,
      data: { employeeId: data.id },
    })

    return this.map.mapEmployee(unblocked)
  }

  async ResetEmployeePassword(data: ResetEmployeePasswordInput): Promise<Empty> {
    const actor = await this.validate.validateEmployeeAccess(data.validation.accessToken)
    await this.validate.validateEmployeeExists(data.id)
    this.validate.validatePasswordFormat(data.newPassword)
    const passwordHash = await this.password.hashPassword(data.newPassword)
    await this.db.updateEmployeePassword(data.id, passwordHash)

    this.log.publish({
      service: 'user',
      entity: 'Employee',
      method: 'ResetEmployeePassword',
      action: USER_LOG_ACTIONS.EMPLOYEE_ADMIN_RESET_PASSWORD,
      userId: actor.user.id,
      data: { employeeId: data.id },
    })

    return {}
  }

  async DeleteEmployee(data: EmployeeActionInput): Promise<Empty> {
    const actor = await this.validate.validateEmployeeAccess(data.validation.accessToken)
    await this.validate.validateEmployeeExists(data.id)
    await this.db.deleteEmployee(data.id)

    this.sync.publish({ action: 'delete', userId: data.id })

    this.log.publish({
      service: 'user',
      entity: 'Employee',
      method: 'DeleteEmployee',
      action: USER_LOG_ACTIONS.EMPLOYEE_ADMIN_DELETE,
      userId: actor.user.id,
      data: { employeeId: data.id },
    })

    return {}
  }
}
