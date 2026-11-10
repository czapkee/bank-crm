import { Injectable } from '@nestjs/common'

import type {
  PaginatedThemesOutput,
  ThemeDetailedOutput,
  ThemeOutput,
} from '@org/shared-types'

@Injectable()
export class ThemeGatewayMapService {
  mapTheme(theme: ThemeOutput): ThemeOutput {
    return {
      ...theme,
      description: theme.description ?? null,
      parentId: theme.parentId ?? null,
    }
  }

  mapThemeDetailed(theme: ThemeDetailedOutput): ThemeDetailedOutput {
    return {
      ...theme,
      children: (theme.children ?? []).map((child) => this.mapTheme(child)),
    }
  }

  mapPaginatedThemes(output: PaginatedThemesOutput): PaginatedThemesOutput {
    return {
      pagination: output.pagination,
      themes: (output.themes ?? []).map((theme) => this.mapTheme(theme)),
    }
  }
}
