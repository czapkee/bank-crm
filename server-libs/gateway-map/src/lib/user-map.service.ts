import { Injectable } from '@nestjs/common'
import { GRPC_TO_ROLE, ROLE_TO_GRPC } from '@org/enums'

import type {
  GrpcChangeEmployeeRoleInput,
  GrpcCreateEmployeeInput,
  GrpcEmployeePaginationInput,
  GrpcUpdateEmployeeInput,
} from './types/grpc-input.types.js'
import type {
  GrpcEmployeePaginationOutput,
  GrpcEmployeeUserEntity,
  GrpcPaginatedEmployeesOutput,
} from './types/grpc-output.types.js'
import type {
  ChangeEmployeeRoleInput,
  ClientPaginationOutput,
  ClientUserEntity,
  CreateEmployeeInput,
  EmployeePaginationInput,
  EmployeePaginationOutput,
  EmployeeUserEntity,
  PaginatedClientsOutput,
  PaginatedEmployeesOutput,
  UpdateEmployeeInput,
} from '@org/shared-types'

@Injectable()
export class UserGatewayMapService {
  mapClient(client: ClientUserEntity): ClientUserEntity {
    return client
  }

  mapEmployee(employee: GrpcEmployeeUserEntity): EmployeeUserEntity {
    return {
      ...employee,
      role: GRPC_TO_ROLE[employee.role],
    }
  }

  mapClientPagination(pagination: ClientPaginationOutput): ClientPaginationOutput {
    return pagination
  }

  mapEmployeePagination(pagination: GrpcEmployeePaginationOutput): EmployeePaginationOutput {
    return {
      ...pagination,
      role: pagination.role === undefined ? undefined : GRPC_TO_ROLE[pagination.role],
    }
  }

  mapPaginatedClients(output: PaginatedClientsOutput): PaginatedClientsOutput {
    return output
  }

  mapEmployeePaginationRequest(pagination: EmployeePaginationInput): GrpcEmployeePaginationInput {
    return {
      ...pagination,
      role: pagination.role === undefined ? undefined : ROLE_TO_GRPC[pagination.role],
    }
  }

  mapCreateEmployeeRequest(dto: CreateEmployeeInput): GrpcCreateEmployeeInput {
    return {
      ...dto,
      role: ROLE_TO_GRPC[dto.role],
    }
  }

  mapUpdateEmployeeRequest(dto: UpdateEmployeeInput): GrpcUpdateEmployeeInput {
    return {
      ...dto,
      role: dto.role === undefined ? undefined : ROLE_TO_GRPC[dto.role],
    }
  }

  mapChangeEmployeeRoleRequest(dto: ChangeEmployeeRoleInput): GrpcChangeEmployeeRoleInput {
    return {
      ...dto,
      role: ROLE_TO_GRPC[dto.role],
    }
  }

  mapPaginatedEmployees(output: GrpcPaginatedEmployeesOutput): PaginatedEmployeesOutput {
    return {
      pagination: this.mapEmployeePagination(output.pagination),
      employees: output.employees.map((employee) => this.mapEmployee(employee)),
    }
  }
}
