import { Body, Inject, OnModuleInit, Param } from '@nestjs/common'
import { ADMIN_ROLES } from '@org/gateway-authorization'
import {
  GETProtectedMethod,
  HTTPController,
  QUERYProtectedMethod,
  ValidateInputParam,
} from '@org/gateway-decorators'
import { LogPaginationDto } from '@org/gateway-dto'
import { LogGatewayMapService } from '@org/gateway-map'
import { firstValueFrom } from 'rxjs'

import type { ClientGrpc } from '@nestjs/microservices'
import type { LogServiceObservableContract, ValidateInput } from '@org/grpc-types'
import type { LogOutput, PaginatedLogsOutput } from '@org/shared-types'

@HTTPController({
  microserviceName: 'Log',
  serviceName: 'Log',
})
export class LogController implements OnModuleInit {
  private logContract!: LogServiceObservableContract

  constructor(
    @Inject('LOG_CLIENT') private readonly client: ClientGrpc,
    private readonly map: LogGatewayMapService,
  ) {}

  onModuleInit(): void {
    this.logContract = this.client.getService<LogServiceObservableContract>('LogService')
  }

  @QUERYProtectedMethod({
    path: 'logs',
    summary: 'Получение журнала действий',
    operationDesc: 'Возвращает постраничный список записей журнала действий с фильтрами',
    roles: ADMIN_ROLES,
  })
  async getLogs(
    @ValidateInputParam() validation: ValidateInput,
    @Body() pagination: LogPaginationDto,
  ): Promise<PaginatedLogsOutput> {
    const response = await firstValueFrom(
      this.logContract.GetLogs({
        validation,
        pagination: this.map.mapLogPaginationRequest(pagination),
      }),
    )
    return this.map.mapPaginatedLogs(response)
  }

  @GETProtectedMethod({
    path: 'logs/:id',
    summary: 'Получение записи журнала',
    operationDesc: 'Возвращает запись журнала действий по идентификатору',
    roles: ADMIN_ROLES,
  })
  async getLog(
    @ValidateInputParam() validation: ValidateInput,
    @Param('id') id: string,
  ): Promise<LogOutput> {
    const response = await firstValueFrom(this.logContract.GetLog({ validation, id }))
    return this.map.mapLog(response)
  }

  @QUERYProtectedMethod({
    path: 'users/:userId/logs',
    summary: 'Получение журнала действий пользователя',
    operationDesc: 'Возвращает постраничный список записей журнала действий указанного пользователя',
    roles: ADMIN_ROLES,
  })
  async getLogsByUser(
    @ValidateInputParam() validation: ValidateInput,
    @Param('userId') userId: string,
    @Body() pagination: LogPaginationDto,
  ): Promise<PaginatedLogsOutput> {
    const response = await firstValueFrom(
      this.logContract.GetLogsByUser({
        validation,
        userId,
        pagination: this.map.mapLogPaginationRequest(pagination),
      }),
    )
    return this.map.mapPaginatedLogs(response)
  }
}
