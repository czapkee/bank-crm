import { Controller } from '@nestjs/common'
import { GrpcMethod } from '@nestjs/microservices'

import { UserEmployeeAdminFeatureService } from './user-employee-admin-feature.service.js'

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

@Controller()
export class UserEmployeeAdminFeatureController implements EmployeeAdminServiceContract {
  constructor(private readonly service: UserEmployeeAdminFeatureService) {}

  @GrpcMethod('EmployeeAdminService', 'GetEmployees')
  async GetEmployees(data: GetEmployeesInput): Promise<PaginatedEmployeesOutput> {
    return await this.service.GetEmployees(data)
  }

  @GrpcMethod('EmployeeAdminService', 'GetEmployee')
  async GetEmployee(data: GetEmployeeInput): Promise<EmployeeUserEntity> {
    return await this.service.GetEmployee(data)
  }

  @GrpcMethod('EmployeeAdminService', 'CreateEmployee')
  async CreateEmployee(data: CreateEmployeeInput): Promise<EmployeeUserEntity> {
    return await this.service.CreateEmployee(data)
  }

  @GrpcMethod('EmployeeAdminService', 'UpdateEmployee')
  async UpdateEmployee(data: UpdateEmployeeInput): Promise<EmployeeUserEntity> {
    return await this.service.UpdateEmployee(data)
  }

  @GrpcMethod('EmployeeAdminService', 'ChangeEmployeeRole')
  async ChangeEmployeeRole(data: ChangeEmployeeRoleInput): Promise<EmployeeUserEntity> {
    return await this.service.ChangeEmployeeRole(data)
  }

  @GrpcMethod('EmployeeAdminService', 'BlockEmployee')
  async BlockEmployee(data: EmployeeActionInput): Promise<EmployeeUserEntity> {
    return await this.service.BlockEmployee(data)
  }

  @GrpcMethod('EmployeeAdminService', 'UnblockEmployee')
  async UnblockEmployee(data: EmployeeActionInput): Promise<EmployeeUserEntity> {
    return await this.service.UnblockEmployee(data)
  }

  @GrpcMethod('EmployeeAdminService', 'ResetEmployeePassword')
  async ResetEmployeePassword(data: ResetEmployeePasswordInput): Promise<Empty> {
    return await this.service.ResetEmployeePassword(data)
  }

  @GrpcMethod('EmployeeAdminService', 'DeleteEmployee')
  async DeleteEmployee(data: EmployeeActionInput): Promise<Empty> {
    return await this.service.DeleteEmployee(data)
  }
}
