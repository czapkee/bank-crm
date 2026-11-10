import { Injectable } from '@nestjs/common'
import { ReportAuthUtil, ReportDatabaseUtil, ReportMapUtil, ReportValidateUtil } from '@org/report-utils'
import { LogPublisher } from '@org/rmq-config'
import { THEME_LOG_ACTIONS } from '@org/rmq-messages'

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
  constructor(
    private readonly db: ReportDatabaseUtil,
    private readonly auth: ReportAuthUtil,
    private readonly validate: ReportValidateUtil,
    private readonly map: ReportMapUtil,
    private readonly log: LogPublisher,
  ) {}

  async GetThemes(data: GetThemesAdminInput): Promise<PaginatedThemesOutput> {
    this.auth.validateAdminAccess(data.validation.accessToken)
    const pagination = this.validate.validateThemePagination(data.pagination)
    const result = await this.db.getThemes(pagination)

    return this.map.mapThemeListResult(result)
  }

  async GetTheme(data: GetThemeAdminInput): Promise<ThemeDetailedOutput> {
    this.auth.validateAdminAccess(data.validation.accessToken)
    const theme = await this.validate.validateThemeDetailedExists(data.id)

    return this.map.mapThemeDetailed(theme)
  }

  async CreateTheme(data: CreateThemeInput): Promise<ThemeOutput> {
    const actor = this.auth.validateAdminAccess(data.validation.accessToken)
    const name = this.validate.validateThemeName(data.name)
    const description =
      data.description === undefined
        ? undefined
        : this.validate.validateThemeDescription(data.description)
    const parentId =
      data.parentId === undefined
        ? undefined
        : await this.validate.validateThemeParent(undefined, data.parentId)

    await this.validate.validateThemeNameAvailable(name)

    const theme = await this.db.createTheme({ name, description, parentId })

    this.log.publish({
      service: 'report',
      entity: 'Theme',
      method: 'CreateTheme',
      action: THEME_LOG_ACTIONS.ADMIN_CREATE,
      userId: actor.id,
      data: { themeId: theme.id, name: theme.name },
    })

    return this.map.mapTheme(theme)
  }

  async UpdateTheme(data: UpdateThemeInput): Promise<ThemeOutput> {
    const actor = this.auth.validateAdminAccess(data.validation.accessToken)
    await this.validate.validateThemeExists(data.id)
    const name = data.name === undefined ? undefined : this.validate.validateThemeName(data.name)
    const description =
      data.description === undefined
        ? undefined
        : this.validate.validateThemeDescription(data.description)
    const parentId =
      data.parentId === undefined
        ? undefined
        : await this.validate.validateThemeParent(data.id, data.parentId)

    if (name !== undefined) {
      await this.validate.validateThemeNameAvailable(name, data.id)
    }

    const theme = await this.db.updateTheme(data.id, { name, description, parentId })

    this.log.publish({
      service: 'report',
      entity: 'Theme',
      method: 'UpdateTheme',
      action: THEME_LOG_ACTIONS.ADMIN_UPDATE,
      userId: actor.id,
      data: { themeId: data.id, changes: { ...data } },
    })

    return this.map.mapTheme(theme)
  }

  async DeleteTheme(data: ThemeActionInput): Promise<Empty> {
    const actor = this.auth.validateAdminAccess(data.validation.accessToken)
    await this.validate.validateThemeExists(data.id)
    await this.validate.validateThemeHasNoChildren(data.id)
    await this.db.deleteTheme(data.id)

    this.log.publish({
      service: 'report',
      entity: 'Theme',
      method: 'DeleteTheme',
      action: THEME_LOG_ACTIONS.ADMIN_DELETE,
      userId: actor.id,
      data: { themeId: data.id },
    })

    return {}
  }
}
