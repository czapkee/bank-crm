import { Body, Inject, OnModuleInit, Param } from '@nestjs/common'
import {
  DELETEProtectedMethod,
  GETProtectedMethod,
  HTTPController,
  POSTProtected,
  PUTProtectedMethod,
  QUERYProtectedMethod,
  ValidateInputParam,
} from '@org/gateway-decorators'
import {
  CreateReportDto,
  ReportPaginationDto,
  UpdateMyReportDto,
} from '@org/gateway-dto'
import { ReportGatewayMapService } from '@org/gateway-map'
import { firstValueFrom } from 'rxjs'

import type { ClientGrpc } from '@nestjs/microservices'
import type { ReportServiceObservableContract, ValidateInput } from '@org/grpc-types'
import type { PaginatedReportsOutput, ReportOutput } from '@org/shared-types'

@HTTPController({
  microserviceName: 'Report',
  serviceName: 'Report',
})
export class ReportController implements OnModuleInit {
  private reportContract!: ReportServiceObservableContract

  constructor(
    @Inject('REPORT_CLIENT') private readonly client: ClientGrpc,
    private readonly map: ReportGatewayMapService,
  ) {}

  onModuleInit(): void {
    this.reportContract = this.client.getService<ReportServiceObservableContract>('ReportService')
  }

  @POSTProtected({
    path: 'reports',
    summary: 'Создание обращения',
    operationDesc: 'Создаёт обращение текущего клиента',
  })
  async createReport(
    @ValidateInputParam() validation: ValidateInput,
    @Body() dto: CreateReportDto,
  ): Promise<ReportOutput> {
    const response = await firstValueFrom(
      this.reportContract.CreateReport({
        validation,
        ...this.map.mapCreateReportRequest(dto),
      }),
    )
    return this.map.mapReport(response)
  }

  @QUERYProtectedMethod({
    path: 'my/reports',
    summary: 'Получение моих обращений',
    operationDesc: 'Возвращает постраничный список обращений текущего клиента',
  })
  async getMyReports(
    @ValidateInputParam() validation: ValidateInput,
    @Body() pagination: ReportPaginationDto,
  ): Promise<PaginatedReportsOutput> {
    const response = await firstValueFrom(
      this.reportContract.GetMyReports({
        validation,
        pagination: this.map.mapReportPaginationRequest(pagination),
      }),
    )
    return this.map.mapPaginatedReports(response)
  }

  @GETProtectedMethod({
    path: 'my/reports/:id',
    summary: 'Получение моего обращения',
    operationDesc: 'Возвращает обращение текущего клиента по идентификатору',
  })
  async getMyReport(
    @ValidateInputParam() validation: ValidateInput,
    @Param('id') id: string,
  ): Promise<ReportOutput> {
    const response = await firstValueFrom(this.reportContract.GetMyReport({ validation, id }))
    return this.map.mapReport(response)
  }

  @PUTProtectedMethod({
    path: 'my/reports/:id',
    summary: 'Обновление моего обращения',
    operationDesc: 'Обновляет обращение текущего клиента',
  })
  async updateMyReport(
    @ValidateInputParam() validation: ValidateInput,
    @Param('id') id: string,
    @Body() dto: UpdateMyReportDto,
  ): Promise<ReportOutput> {
    const response = await firstValueFrom(
      this.reportContract.UpdateMyReport({
        validation,
        id,
        ...this.map.mapUpdateMyReportRequest(dto),
      }),
    )
    return this.map.mapReport(response)
  }

  @DELETEProtectedMethod({
    path: 'my/reports/:id',
    summary: 'Удаление моего обращения',
    operationDesc: 'Удаляет обращение текущего клиента',
  })
  async deleteMyReport(
    @ValidateInputParam() validation: ValidateInput,
    @Param('id') id: string,
  ): Promise<void> {
    await firstValueFrom(this.reportContract.DeleteMyReport({ validation, id }))
  }
}
