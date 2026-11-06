import { Body, Inject, OnModuleInit, Param } from '@nestjs/common'
import { ADMIN_ROLES } from '@org/gateway-authorization'
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
  ClientPaginationDto,
  CreateClientDto,
  ResetClientPasswordDto,
  UpdateClientDto,
} from '@org/gateway-dto'
import { firstValueFrom } from 'rxjs'

import type { ClientGrpc } from '@nestjs/microservices'
import type { ClientAdminServiceObservableContract, ValidateInput } from '@org/grpc-types'
import type { ClientOutput, PaginatedClientsOutput } from '@org/shared-types'

@HTTPController({
  microserviceName: 'User',
  serviceName: 'ClientAdmin',
})
export class ClientAdminController implements OnModuleInit {
  private clientAdminContract!: ClientAdminServiceObservableContract

  constructor(@Inject('USER_CLIENT') private readonly client: ClientGrpc) {}

  onModuleInit(): void {
    this.clientAdminContract = this.client.getService<ClientAdminServiceObservableContract>('ClientAdminService')
  }

  @QUERYProtectedMethod({
    path: 'clients',
    summary: 'Получение списка клиентов',
    operationDesc: 'Возвращает постраничный список клиентов банка с фильтрами',
    roles: ADMIN_ROLES,
  })
  async getClients(
    @ValidateInputParam() validation: ValidateInput,
    @Body() pagination: ClientPaginationDto,
  ): Promise<PaginatedClientsOutput> {
    return await firstValueFrom(this.clientAdminContract.GetClients({ validation, pagination }))
  }

  @GETProtectedMethod({
    path: 'clients/:id',
    summary: 'Получение клиента',
    operationDesc: 'Возвращает данные клиента банка по идентификатору',
    roles: ADMIN_ROLES,
  })
  async getClient(
    @ValidateInputParam() validation: ValidateInput,
    @Param('id') id: string,
  ): Promise<ClientOutput> {
    return await firstValueFrom(this.clientAdminContract.GetClient({ validation, id }))
  }

  @POSTProtected({
    path: 'clients',
    summary: 'Создание клиента',
    operationDesc: 'Создаёт нового клиента банка',
    roles: ADMIN_ROLES,
  })
  async createClient(
    @ValidateInputParam() validation: ValidateInput,
    @Body() dto: CreateClientDto,
  ): Promise<ClientOutput> {
    return await firstValueFrom(this.clientAdminContract.CreateClient({ validation, ...dto }))
  }

  @PUTProtectedMethod({
    path: 'clients/:id',
    summary: 'Обновление клиента',
    operationDesc: 'Обновляет данные клиента банка',
    roles: ADMIN_ROLES,
  })
  async updateClient(
    @ValidateInputParam() validation: ValidateInput,
    @Param('id') id: string,
    @Body() dto: UpdateClientDto,
  ): Promise<ClientOutput> {
    return await firstValueFrom(this.clientAdminContract.UpdateClient({ validation, id, ...dto }))
  }

  @PATCHProtectedMethod({
    path: 'clients/:id/block',
    summary: 'Блокировка клиента',
    operationDesc: 'Блокирует учётную запись клиента банка',
    roles: ADMIN_ROLES,
  })
  async blockClient(
    @ValidateInputParam() validation: ValidateInput,
    @Param('id') id: string,
  ): Promise<ClientOutput> {
    return await firstValueFrom(this.clientAdminContract.BlockClient({ validation, id }))
  }

  @PATCHProtectedMethod({
    path: 'clients/:id/unblock',
    summary: 'Разблокировка клиента',
    operationDesc: 'Разблокирует учётную запись клиента банка',
    roles: ADMIN_ROLES,
  })
  async unblockClient(
    @ValidateInputParam() validation: ValidateInput,
    @Param('id') id: string,
  ): Promise<ClientOutput> {
    return await firstValueFrom(this.clientAdminContract.UnblockClient({ validation, id }))
  }

  @PATCHProtectedMethod({
    path: 'clients/:id/reset-password',
    summary: 'Сброс пароля клиента',
    operationDesc: 'Устанавливает новый пароль для учётной записи клиента банка',
    roles: ADMIN_ROLES,
  })
  async resetClientPassword(
    @ValidateInputParam() validation: ValidateInput,
    @Param('id') id: string,
    @Body() dto: ResetClientPasswordDto,
  ): Promise<void> {
    await firstValueFrom(
      this.clientAdminContract.ResetClientPassword({ validation, id, newPassword: dto.newPassword }),
    )
  }

  @DELETEProtectedMethod({
    path: 'clients/:id',
    summary: 'Удаление клиента',
    operationDesc: 'Удаляет учётную запись клиента банка',
    roles: ADMIN_ROLES,
  })
  async deleteClient(
    @ValidateInputParam() validation: ValidateInput,
    @Param('id') id: string,
  ): Promise<void> {
    await firstValueFrom(this.clientAdminContract.DeleteClient({ validation, id }))
  }
}
