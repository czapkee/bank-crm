import { Id } from '../decorators/shared/id.decorator.js'
import { ThemeDescription } from '../decorators/theme/description.decorator.js'
import { ThemeName } from '../decorators/theme/name.decorator.js'

import type { UpdateThemeInput } from '@org/shared-types'

export class UpdateThemeDto implements UpdateThemeInput {
  @ThemeName(false)
  name?: string

  @ThemeDescription()
  description?: string

  @Id(false)
  parentId?: string
}
