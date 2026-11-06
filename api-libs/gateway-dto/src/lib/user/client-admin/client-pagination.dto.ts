import { IsActive } from '../../decorators/user/is-active.decorator.js'
import { IsResident } from '../../decorators/user/is-resident.decorator.js'
import { BasePaginationDto } from '../../shared/pagination-base.dto.js'

import type { ClientPaginationInput } from '@org/shared-types'

export class ClientPaginationDto extends BasePaginationDto implements ClientPaginationInput {
  @IsActive()
  isActive?: boolean

  @IsResident(false)
  isResident?: boolean
}
