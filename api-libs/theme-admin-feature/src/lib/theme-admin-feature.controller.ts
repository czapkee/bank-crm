import { Controller } from '@nestjs/common'
import { GrpcMethod } from '@nestjs/microservices'

import { ThemeAdminFeatureService } from './theme-admin-feature.service.js'

import type {
  CreateThemeInput,
  Empty,
  GetThemeAdminInput,
  GetThemesAdminInput,
  PaginatedThemesOutput,
  ThemeActionInput,
  ThemeAdminServiceContract,
  ThemeDetailedOutput,
  ThemeOutput,
  UpdateThemeInput,
} from '@org/grpc-types'

@Controller()
export class ThemeAdminFeatureController implements ThemeAdminServiceContract {
  constructor(private readonly service: ThemeAdminFeatureService) {}

  @GrpcMethod('ThemeAdminService', 'GetThemes')
  async GetThemes(data: GetThemesAdminInput): Promise<PaginatedThemesOutput> {
    return await this.service.GetThemes(data)
  }

  @GrpcMethod('ThemeAdminService', 'GetTheme')
  async GetTheme(data: GetThemeAdminInput): Promise<ThemeDetailedOutput> {
    return await this.service.GetTheme(data)
  }

  @GrpcMethod('ThemeAdminService', 'CreateTheme')
  async CreateTheme(data: CreateThemeInput): Promise<ThemeOutput> {
    return await this.service.CreateTheme(data)
  }

  @GrpcMethod('ThemeAdminService', 'UpdateTheme')
  async UpdateTheme(data: UpdateThemeInput): Promise<ThemeOutput> {
    return await this.service.UpdateTheme(data)
  }

  @GrpcMethod('ThemeAdminService', 'DeleteTheme')
  async DeleteTheme(data: ThemeActionInput): Promise<Empty> {
    return await this.service.DeleteTheme(data)
  }
}
