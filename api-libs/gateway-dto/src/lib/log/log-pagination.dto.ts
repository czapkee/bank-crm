import { LogAction } from '../decorators/log/action.decorator.js'
import { LogEntity } from '../decorators/log/entity.decorator.js'
import { LogMethod } from '../decorators/log/method.decorator.js'
import { LogService } from '../decorators/log/service.decorator.js'
import { DateField } from '../decorators/shared/date.decorator.js'
import { Id } from '../decorators/shared/id.decorator.js'
import { BasePaginationDto } from '../shared/pagination-base.dto.js'

import type { LogPaginationInput } from '@org/shared-types'

export class LogPaginationDto extends BasePaginationDto implements LogPaginationInput {
  @LogService()
  service?: string

  @LogEntity()
  entity?: string

  @LogMethod()
  method?: string

  @LogAction()
  action?: string

  @Id(false)
  userId?: string

  @DateField()
  dateFrom?: Date

  @DateField()
  dateTo?: Date
}
