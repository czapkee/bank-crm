import { Controller } from '@nestjs/common'
import { GrpcMethod } from '@nestjs/microservices'

import { ThemeFeatureService } from './theme-feature.service.js'

import type {
  GetThemeInput,
  GetThemesInput,
  PaginatedThemesOutput,
  ThemeDetailedOutput,
  ThemeServiceContract,
} from '@org/grpc-types'

@Controller()
export class ThemeFeatureController implements ThemeServiceContract {
  constructor(private readonly service: ThemeFeatureService) {}

  @GrpcMethod('ThemeService', 'GetThemes')
  async GetThemes(data: GetThemesInput): Promise<PaginatedThemesOutput> {
    return await this.service.GetThemes(data)
  }

  @GrpcMethod('ThemeService', 'GetTheme')
  async GetTheme(data: GetThemeInput): Promise<ThemeDetailedOutput> {
    return await this.service.GetTheme(data)
  }
}
