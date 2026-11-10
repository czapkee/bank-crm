import { Injectable } from '@nestjs/common'
import { ReportAuthUtil, ReportDatabaseUtil, ReportMapUtil, ReportValidateUtil } from '@org/report-utils'

import type {
  GetThemeInput,
  GetThemesInput,
  PaginatedThemesOutput,
  ThemeDetailedOutput,
  ThemeServiceContract,
} from '@org/grpc-types'

@Injectable()
export class ThemeFeatureService implements ThemeServiceContract {
  constructor(
    private readonly db: ReportDatabaseUtil,
    private readonly auth: ReportAuthUtil,
    private readonly validate: ReportValidateUtil,
    private readonly map: ReportMapUtil,
  ) {}

  async GetThemes(data: GetThemesInput): Promise<PaginatedThemesOutput> {
    this.auth.validateClientAccess(data.validation.accessToken)
    const pagination = this.validate.validateThemePagination(data.pagination)
    const result = await this.db.getThemes(pagination)

    return this.map.mapThemeListResult(result)
  }

  async GetTheme(data: GetThemeInput): Promise<ThemeDetailedOutput> {
    this.auth.validateClientAccess(data.validation.accessToken)
    const theme = await this.validate.validateThemeDetailedExists(data.id)

    return this.map.mapThemeDetailed(theme)
  }
}
