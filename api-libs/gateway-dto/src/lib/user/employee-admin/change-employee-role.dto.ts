import { Role } from '../../decorators/user/role.decorator.js'

import type { Roles } from '@org/enums'
import type { ChangeEmployeeRoleInput } from '@org/shared-types'

export class ChangeEmployeeRoleDto implements ChangeEmployeeRoleInput {
  @Role()
  role: Roles
}
