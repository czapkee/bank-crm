import { Email } from '../../decorators/shared/email.decorator.js'
import { Password } from '../../decorators/shared/password.decorator.js'

import type { EmployeeLoginInput } from '@org/shared-types'

export class EmployeeLoginDto implements EmployeeLoginInput {
  @Email()
  email: string

  @Password()
  password: string
}
