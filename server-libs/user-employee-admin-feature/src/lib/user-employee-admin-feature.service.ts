import { Injectable } from '@nestjs/common'

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
  async GetEmployees(_data: GetEmployeesInput): Promise<PaginatedEmployeesOutput> {
    throw new Error('Method not implemented')
  }

  async GetEmployee(_data: GetEmployeeInput): Promise<EmployeeUserEntity> {
    throw new Error('Method not implemented')
  }

  async CreateEmployee(_data: CreateEmployeeInput): Promise<EmployeeUserEntity> {
    throw new Error('Method not implemented')
  }

  async UpdateEmployee(_data: UpdateEmployeeInput): Promise<EmployeeUserEntity> {
    throw new Error('Method not implemented')
  }

  async ChangeEmployeeRole(_data: ChangeEmployeeRoleInput): Promise<EmployeeUserEntity> {
    throw new Error('Method not implemented')
  }

  async BlockEmployee(_data: EmployeeActionInput): Promise<EmployeeUserEntity> {
    throw new Error('Method not implemented')
  }

  async UnblockEmployee(_data: EmployeeActionInput): Promise<EmployeeUserEntity> {
    throw new Error('Method not implemented')
  }

  async ResetEmployeePassword(_data: ResetEmployeePasswordInput): Promise<Empty> {
    throw new Error('Method not implemented')
  }

  async DeleteEmployee(_data: EmployeeActionInput): Promise<Empty> {
    throw new Error('Method not implemented')
  }
}
