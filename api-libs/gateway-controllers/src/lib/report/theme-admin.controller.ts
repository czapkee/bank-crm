import { Body, Inject, OnModuleInit, Param } from '@nestjs/common'
import { ADMIN_ROLES } from '@org/gateway-authorization'
import {
  DELETEProtectedMethod,
  GETProtectedMethod,
  HTTPController,
  POSTProtected,
  PUTProtectedMethod,
  QUERYProtectedMethod,
  ValidateInputParam,
} from '@org/gateway-decorators'
import { CreateThemeDto, ThemePaginationDto, UpdateThemeDto } from '@org/gateway-dto'
import { ThemeGatewayMapService } from '@org/gateway-map'
import { firstValueFrom } from 'rxjs'

import type { ClientGrpc } from '@nestjs/microservices'
import type { ThemeAdminServiceObservableContract, ValidateInput } from '@org/grpc-types'
import type { PaginatedThemesOutput, ThemeDetailedOutput, ThemeOutput } from '@org/shared-types'

@HTTPController({
  microserviceName: 'Report',
  serviceName: 'ThemeAdmin',
})
export class ThemeAdminController implements OnModuleInit {
  private themeAdminContract!: ThemeAdminServiceObservableContract

  constructor(
    @Inject('REPORT_CLIENT') private readonly client: ClientGrpc,
    private readonly map: ThemeGatewayMapService,
  ) {}

  onModuleInit(): void {
    this.themeAdminContract = this.client.getService<ThemeAdminServiceObservableContract>('ThemeAdminService')
  }

  @QUERYProtectedMethod({
    path: 'themes',
    summary: 'Получение списка тем',
    operationDesc: 'Возвращает постраничный список тем обращений',
    roles: ADMIN_ROLES,
  })
  async getThemes(
    @ValidateInputParam() validation: ValidateInput,
    @Body() pagination: ThemePaginationDto,
  ): Promise<PaginatedThemesOutput> {
    const response = await firstValueFrom(this.themeAdminContract.GetThemes({ validation, pagination }))
    return this.map.mapPaginatedThemes(response)
  }

  @GETProtectedMethod({
    path: 'themes/:id',
    summary: 'Получение темы',
    operationDesc: 'Возвращает тему обращения с дочерними темами',
    roles: ADMIN_ROLES,
  })
  async getTheme(
    @ValidateInputParam() validation: ValidateInput,
    @Param('id') id: string,
  ): Promise<ThemeDetailedOutput> {
    const response = await firstValueFrom(this.themeAdminContract.GetTheme({ validation, id }))
    return this.map.mapThemeDetailed(response)
  }

  @POSTProtected({
    path: 'themes',
    summary: 'Создание темы',
    operationDesc: 'Создаёт тему обращений',
    roles: ADMIN_ROLES,
  })
  async createTheme(
    @ValidateInputParam() validation: ValidateInput,
    @Body() dto: CreateThemeDto,
  ): Promise<ThemeOutput> {
    const response = await firstValueFrom(this.themeAdminContract.CreateTheme({ validation, ...dto }))
    return this.map.mapTheme(response)
  }

  @PUTProtectedMethod({
    path: 'themes/:id',
    summary: 'Обновление темы',
    operationDesc: 'Обновляет тему обращений',
    roles: ADMIN_ROLES,
  })
  async updateTheme(
    @ValidateInputParam() validation: ValidateInput,
    @Param('id') id: string,
    @Body() dto: UpdateThemeDto,
  ): Promise<ThemeOutput> {
    const response = await firstValueFrom(
      this.themeAdminContract.UpdateTheme({ validation, id, ...dto }),
    )
    return this.map.mapTheme(response)
  }

  @DELETEProtectedMethod({
    path: 'themes/:id',
    summary: 'Удаление темы',
    operationDesc: 'Удаляет тему обращений',
    roles: ADMIN_ROLES,
  })
  async deleteTheme(
    @ValidateInputParam() validation: ValidateInput,
    @Param('id') id: string,
  ): Promise<void> {
    await firstValueFrom(this.themeAdminContract.DeleteTheme({ validation, id }))
  }
}
