import { Password } from '../../decorators/shared/password.decorator.js'

import type { EmployeeDeleteAccountInput } from '@org/shared-types'

export class EmployeeDeleteAccountDto implements EmployeeDeleteAccountInput {
  @Password()
  password: string
}
