import { Injectable } from '@nestjs/common'

import type {
  GetThemeInput,
  GetThemesInput,
  PaginatedThemesOutput,
  ThemeDetailedOutput,
  ThemeServiceContract,
} from '@org/grpc-types'

@Injectable()
export class ThemeFeatureService implements ThemeServiceContract {
  async GetThemes(_data: GetThemesInput): Promise<PaginatedThemesOutput> {
    throw new Error('Method not implemented')
  }

  async GetTheme(_data: GetThemeInput): Promise<ThemeDetailedOutput> {
    throw new Error('Method not implemented')
  }
}
