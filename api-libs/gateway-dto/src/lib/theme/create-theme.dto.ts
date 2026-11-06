import { Id } from '../decorators/shared/id.decorator.js'
import { ThemeDescription } from '../decorators/theme/description.decorator.js'
import { ThemeName } from '../decorators/theme/name.decorator.js'

import type { CreateThemeInput } from '@org/shared-types'

export class CreateThemeDto implements CreateThemeInput {
  @ThemeName()
  name: string

  @ThemeDescription()
  description?: string

  @Id(false)
  parentId?: string
}
