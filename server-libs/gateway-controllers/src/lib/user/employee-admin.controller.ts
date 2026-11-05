import { Body, Inject, OnModuleInit, Param } from '@nestjs/common'
import { ADMIN_ROLES, SUPERADMIN_ROLES } from '@org/gateway-authorization'
import {
  DELETEProtectedMethod,
  GETProtectedMethod,
  HTTPController,
  PATCHProtectedMethod,
  POSTProtected,
  PUTProtectedMethod,
  QUERYProtectedMethod,
  ValidateInputParam,
} from '@org/gateway-decorators'
import {
  ChangeEmployeeRoleDto,
  CreateEmployeeDto,
  EmployeePaginationDto,
  ResetEmployeePasswordDto,
  UpdateEmployeeDto,
} from '@org/gateway-dto'
import { UserGatewayMapService } from '@org/gateway-map'
import { firstValueFrom } from 'rxjs'

import type { ClientGrpc } from '@nestjs/microservices'
import type { EmployeeAdminServiceObservableContract, ValidateInput } from '@org/grpc-types'
import type { EmployeeUserEntity, PaginatedEmployeesOutput } from '@org/shared-types'

@HTTPController({
  microserviceName: 'User',
  serviceName: 'EmployeeAdmin',
})
export class EmployeeAdminController implements OnModuleInit {
  private employeeAdminContract!: EmployeeAdminServiceObservableContract

  constructor(
    @Inject('USER_CLIENT') private readonly client: ClientGrpc,
    private readonly map: UserGatewayMapService,
  ) {}

  onModuleInit(): void {
    this.employeeAdminContract = this.client.getService<EmployeeAdminServiceObservableContract>(
      'EmployeeAdminService',
    )
  }

  @QUERYProtectedMethod({
    path: 'employees',
    summary: 'Получение списка сотрудников',
    operationDesc: 'Возвращает постраничный список сотрудников банка с фильтрами',
    roles: ADMIN_ROLES,
  })
  async getEmployees(
    @ValidateInputParam() validation: ValidateInput,
    @Body() pagination: EmployeePaginationDto,
  ): Promise<PaginatedEmployeesOutput> {
    const response = await firstValueFrom(
      this.employeeAdminContract.GetEmployees({
        validation,
        pagination: this.map.mapEmployeePaginationRequest(pagination),
      }),
    )
    return this.map.mapPaginatedEmployees(response)
  }

  @GETProtectedMethod({
    path: 'employees/:id',
    summary: 'Получение сотрудника',
    operationDesc: 'Возвращает данные сотрудника банка по идентификатору',
    roles: ADMIN_ROLES,
  })
  async getEmployee(
    @ValidateInputParam() validation: ValidateInput,
    @Param('id') id: string,
  ): Promise<EmployeeUserEntity> {
    const response = await firstValueFrom(this.employeeAdminContract.GetEmployee({ validation, id }))
    return this.map.mapEmployee(response)
  }

  @POSTProtected({
    path: 'employees',
    summary: 'Создание сотрудника',
    operationDesc: 'Создаёт нового сотрудника банка',
    roles: SUPERADMIN_ROLES,
  })
  async createEmployee(
    @ValidateInputParam() validation: ValidateInput,
    @Body() dto: CreateEmployeeDto,
  ): Promise<EmployeeUserEntity> {
    const response = await firstValueFrom(
      this.employeeAdminContract.CreateEmployee({
        validation,
        ...this.map.mapCreateEmployeeRequest(dto),
      }),
    )
    return this.map.mapEmployee(response)
  }

  @PUTProtectedMethod({
    path: 'employees/:id',
    summary: 'Обновление сотрудника',
    operationDesc: 'Обновляет данные сотрудника банка',
    roles: ADMIN_ROLES,
  })
  async updateEmployee(
    @ValidateInputParam() validation: ValidateInput,
    @Param('id') id: string,
    @Body() dto: UpdateEmployeeDto,
  ): Promise<EmployeeUserEntity> {
    const response = await firstValueFrom(
      this.employeeAdminContract.UpdateEmployee({
        validation,
        id,
        ...this.map.mapUpdateEmployeeRequest(dto),
      }),
    )
    return this.map.mapEmployee(response)
  }

  @PATCHProtectedMethod({
    path: 'employees/:id/role',
    summary: 'Изменение роли сотрудника',
    operationDesc: 'Изменяет роль сотрудника банка',
    roles: SUPERADMIN_ROLES,
  })
  async changeEmployeeRole(
    @ValidateInputParam() validation: ValidateInput,
    @Param('id') id: string,
    @Body() dto: ChangeEmployeeRoleDto,
  ): Promise<EmployeeUserEntity> {
    const response = await firstValueFrom(
      this.employeeAdminContract.ChangeEmployeeRole({
        validation,
        id,
        ...this.map.mapChangeEmployeeRoleRequest(dto),
      }),
    )
    return this.map.mapEmployee(response)
  }

  @PATCHProtectedMethod({
    path: 'employees/:id/block',
    summary: 'Блокировка сотрудника',
    operationDesc: 'Блокирует учётную запись сотрудника банка',
    roles: ADMIN_ROLES,
  })
  async blockEmployee(
    @ValidateInputParam() validation: ValidateInput,
    @Param('id') id: string,
  ): Promise<EmployeeUserEntity> {
    const response = await firstValueFrom(this.employeeAdminContract.BlockEmployee({ validation, id }))
    return this.map.mapEmployee(response)
  }

  @PATCHProtectedMethod({
    path: 'employees/:id/unblock',
    summary: 'Разблокировка сотрудника',
    operationDesc: 'Разблокирует учётную запись сотрудника банка',
    roles: ADMIN_ROLES,
  })
  async unblockEmployee(
    @ValidateInputParam() validation: ValidateInput,
    @Param('id') id: string,
  ): Promise<EmployeeUserEntity> {
    const response = await firstValueFrom(this.employeeAdminContract.UnblockEmployee({ validation, id }))
    return this.map.mapEmployee(response)
  }

  @PATCHProtectedMethod({
    path: 'employees/:id/reset-password',
    summary: 'Сброс пароля сотрудника',
    operationDesc: 'Устанавливает новый пароль для учётной записи сотрудника банка',
    roles: ADMIN_ROLES,
  })
  async resetEmployeePassword(
    @ValidateInputParam() validation: ValidateInput,
    @Param('id') id: string,
    @Body() dto: ResetEmployeePasswordDto,
  ): Promise<void> {
    await firstValueFrom(
      this.employeeAdminContract.ResetEmployeePassword({ validation, id, newPassword: dto.newPassword }),
    )
  }

  @DELETEProtectedMethod({
    path: 'employees/:id',
    summary: 'Удаление сотрудника',
    operationDesc: 'Удаляет учётную запись сотрудника банка',
    roles: SUPERADMIN_ROLES,
  })
  async deleteEmployee(
    @ValidateInputParam() validation: ValidateInput,
    @Param('id') id: string,
  ): Promise<void> {
    await firstValueFrom(this.employeeAdminContract.DeleteEmployee({ validation, id }))
  }
}
