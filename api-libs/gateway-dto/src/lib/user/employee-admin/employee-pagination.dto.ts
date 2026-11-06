import { IsActive } from '../../decorators/user/is-active.decorator.js'
import { Role } from '../../decorators/user/role.decorator.js'
import { BasePaginationDto } from '../../shared/pagination-base.dto.js'

import type { Roles } from '@org/enums'
import type { EmployeePaginationInput } from '@org/shared-types'

export class EmployeePaginationDto extends BasePaginationDto implements EmployeePaginationInput {
  @IsActive()
  isActive?: boolean

  @Role(false)
  role?: Roles
}
