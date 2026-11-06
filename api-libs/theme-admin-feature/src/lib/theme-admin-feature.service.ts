import { Injectable } from '@nestjs/common'

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

@Injectable()
export class ThemeAdminFeatureService implements ThemeAdminServiceContract {
  async GetThemes(_data: GetThemesAdminInput): Promise<PaginatedThemesOutput> {
    throw new Error('Method not implemented')
  }

  async GetTheme(_data: GetThemeAdminInput): Promise<ThemeDetailedOutput> {
    throw new Error('Method not implemented')
  }

  async CreateTheme(_data: CreateThemeInput): Promise<ThemeOutput> {
    throw new Error('Method not implemented')
  }

  async UpdateTheme(_data: UpdateThemeInput): Promise<ThemeOutput> {
    throw new Error('Method not implemented')
  }

  async DeleteTheme(_data: ThemeActionInput): Promise<Empty> {
    throw new Error('Method not implemented')
  }
}
