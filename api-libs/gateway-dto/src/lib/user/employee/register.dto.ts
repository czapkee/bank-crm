import { Email } from '../../decorators/shared/email.decorator.js'
import { Password } from '../../decorators/shared/password.decorator.js'
import { Unvalidated } from '../../decorators/shared/unvalidated.decorator.js'

import type { EmployeeRegisterInput } from '@org/shared-types'

export class EmployeeRegisterDto implements EmployeeRegisterInput {
  @Email()
  email: string

  @Password()
  password: string

  @Unvalidated({ description: 'Подтверждение пароля', required: true })
  confirmationPassword: string
}
