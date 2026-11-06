import { Body, Inject, OnModuleInit, Param } from '@nestjs/common'
import { GETProtectedMethod, HTTPController, QUERYProtectedMethod, ValidateInputParam } from '@org/gateway-decorators'
import { ThemePaginationDto } from '@org/gateway-dto'
import { ThemeGatewayMapService } from '@org/gateway-map'
import { firstValueFrom } from 'rxjs'

import type { ClientGrpc } from '@nestjs/microservices'
import type { ThemeServiceObservableContract, ValidateInput } from '@org/grpc-types'
import type { PaginatedThemesOutput, ThemeDetailedOutput } from '@org/shared-types'

@HTTPController({
  microserviceName: 'Report',
  serviceName: 'Theme',
})
export class ThemeController implements OnModuleInit {
  private themeContract!: ThemeServiceObservableContract

  constructor(
    @Inject('REPORT_CLIENT') private readonly client: ClientGrpc,
    private readonly map: ThemeGatewayMapService,
  ) {}

  onModuleInit(): void {
    this.themeContract = this.client.getService<ThemeServiceObservableContract>('ThemeService')
  }

  @QUERYProtectedMethod({
    path: 'themes',
    summary: 'Получение списка тем',
    operationDesc: 'Возвращает постраничный список тем обращений',
  })
  async getThemes(
    @ValidateInputParam() validation: ValidateInput,
    @Body() pagination: ThemePaginationDto,
  ): Promise<PaginatedThemesOutput> {
    const response = await firstValueFrom(this.themeContract.GetThemes({ validation, pagination }))
    return this.map.mapPaginatedThemes(response)
  }

  @GETProtectedMethod({
    path: 'themes/:id',
    summary: 'Получение темы',
    operationDesc: 'Возвращает тему обращения с дочерними темами',
  })
  async getTheme(
    @ValidateInputParam() validation: ValidateInput,
    @Param('id') id: string,
  ): Promise<ThemeDetailedOutput> {
    const response = await firstValueFrom(this.themeContract.GetTheme({ validation, id }))
    return this.map.mapThemeDetailed(response)
  }
}
