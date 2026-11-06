import { Body, Inject, OnModuleInit, Param } from '@nestjs/common'
import { ADMIN_ROLES } from '@org/gateway-authorization'
import {
  DELETEProtectedMethod,
  GETProtectedMethod,
  HTTPController,
  PATCHProtectedMethod,
  PUTProtectedMethod,
  QUERYProtectedMethod,
  ValidateInputParam,
} from '@org/gateway-decorators'
import {
  AssignReportDto,
  ChangeReportStatusDto,
  ReportPaginationDto,
  UpdateReportDto,
} from '@org/gateway-dto'
import { ReportGatewayMapService } from '@org/gateway-map'
import { firstValueFrom } from 'rxjs'

import type { ClientGrpc } from '@nestjs/microservices'
import type { ReportAdminServiceObservableContract, ValidateInput } from '@org/grpc-types'
import type { PaginatedReportsOutput, ReportOutput } from '@org/shared-types'

@HTTPController({
  microserviceName: 'Report',
  serviceName: 'ReportAdmin',
})
export class ReportAdminController implements OnModuleInit {
  private reportAdminContract!: ReportAdminServiceObservableContract

  constructor(
    @Inject('REPORT_CLIENT') private readonly client: ClientGrpc,
    private readonly map: ReportGatewayMapService,
  ) {}

  onModuleInit(): void {
    this.reportAdminContract = this.client.getService<ReportAdminServiceObservableContract>('ReportAdminService')
  }

  @QUERYProtectedMethod({
    path: 'reports',
    summary: 'Получение списка обращений',
    operationDesc: 'Возвращает постраничный список обращений банка с фильтрами',
    roles: ADMIN_ROLES,
  })
  async getReports(
    @ValidateInputParam() validation: ValidateInput,
    @Body() pagination: ReportPaginationDto,
  ): Promise<PaginatedReportsOutput> {
    const response = await firstValueFrom(
      this.reportAdminContract.GetReports({
        validation,
        pagination: this.map.mapReportPaginationRequest(pagination),
      }),
    )
    return this.map.mapPaginatedReports(response)
  }

  @GETProtectedMethod({
    path: 'reports/:id',
    summary: 'Получение обращения',
    operationDesc: 'Возвращает обращение банка по идентификатору',
    roles: ADMIN_ROLES,
  })
  async getReport(
    @ValidateInputParam() validation: ValidateInput,
    @Param('id') id: string,
  ): Promise<ReportOutput> {
    const response = await firstValueFrom(this.reportAdminContract.GetReport({ validation, id }))
    return this.map.mapReport(response)
  }

  @PUTProtectedMethod({
    path: 'reports/:id',
    summary: 'Обновление обращения',
    operationDesc: 'Обновляет данные обращения банка',
    roles: ADMIN_ROLES,
  })
  async updateReport(
    @ValidateInputParam() validation: ValidateInput,
    @Param('id') id: string,
    @Body() dto: UpdateReportDto,
  ): Promise<ReportOutput> {
    const response = await firstValueFrom(
      this.reportAdminContract.UpdateReport({
        validation,
        id,
        ...this.map.mapUpdateReportRequest(dto),
      }),
    )
    return this.map.mapReport(response)
  }

  @PATCHProtectedMethod({
    path: 'reports/:id/assign',
    summary: 'Назначение обращения',
    operationDesc: 'Назначает обращение сотруднику банка',
    roles: ADMIN_ROLES,
  })
  async assignReport(
    @ValidateInputParam() validation: ValidateInput,
    @Param('id') id: string,
    @Body() dto: AssignReportDto,
  ): Promise<ReportOutput> {
    const response = await firstValueFrom(
      this.reportAdminContract.AssignReport({ validation, id, ...dto }),
    )
    return this.map.mapReport(response)
  }

  @PATCHProtectedMethod({
    path: 'reports/:id/status',
    summary: 'Изменение статуса обращения',
    operationDesc: 'Изменяет статус обращения банка',
    roles: ADMIN_ROLES,
  })
  async changeReportStatus(
    @ValidateInputParam() validation: ValidateInput,
    @Param('id') id: string,
    @Body() dto: ChangeReportStatusDto,
  ): Promise<ReportOutput> {
    const response = await firstValueFrom(
      this.reportAdminContract.ChangeReportStatus({
        validation,
        id,
        ...this.map.mapChangeReportStatusRequest(dto),
      }),
    )
    return this.map.mapReport(response)
  }

  @PATCHProtectedMethod({
    path: 'reports/:id/resolve',
    summary: 'Закрытие обращения',
    operationDesc: 'Закрывает обращение банка',
    roles: ADMIN_ROLES,
  })
  async resolveReport(
    @ValidateInputParam() validation: ValidateInput,
    @Param('id') id: string,
  ): Promise<ReportOutput> {
    const response = await firstValueFrom(this.reportAdminContract.ResolveReport({ validation, id }))
    return this.map.mapReport(response)
  }

  @DELETEProtectedMethod({
    path: 'reports/:id',
    summary: 'Удаление обращения',
    operationDesc: 'Удаляет обращение банка',
    roles: ADMIN_ROLES,
  })
  async deleteReport(
    @ValidateInputParam() validation: ValidateInput,
    @Param('id') id: string,
  ): Promise<void> {
    await firstValueFrom(this.reportAdminContract.DeleteReport({ validation, id }))
  }
}
