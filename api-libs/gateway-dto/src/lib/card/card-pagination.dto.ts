import { CardStatus } from '../decorators/card/card-status.decorator.js'
import { DateField } from '../decorators/shared/date.decorator.js'
import { Id } from '../decorators/shared/id.decorator.js'
import { BasePaginationDto } from '../shared/pagination-base.dto.js'

import type { CardStatuses } from '@org/enums'
import type { CardPaginationInput } from '@org/shared-types'

export class CardPaginationDto extends BasePaginationDto implements CardPaginationInput {
  @CardStatus(false)
  status?: CardStatuses

  @Id(false)
  userId?: string

  @DateField()
  dateFrom?: Date

  @DateField()
  dateTo?: Date
}
