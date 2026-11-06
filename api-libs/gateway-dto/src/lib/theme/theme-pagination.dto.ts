import { Id } from '../decorators/shared/id.decorator.js'
import { BasePaginationDto } from '../shared/pagination-base.dto.js'

import type { ThemePaginationInput } from '@org/shared-types'

export class ThemePaginationDto extends BasePaginationDto implements ThemePaginationInput {
  @Id(false)
  parentId?: string
}
