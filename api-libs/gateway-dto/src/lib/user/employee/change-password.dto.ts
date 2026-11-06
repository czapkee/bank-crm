import { Password } from '../../decorators/shared/password.decorator.js'
import { Unvalidated } from '../../decorators/shared/unvalidated.decorator.js'

import type { EmployeeChangePasswordInput } from '@org/shared-types'

export class EmployeeChangePasswordDto implements EmployeeChangePasswordInput {
  @Password()
  oldPassword: string

  @Password()
  newPassword: string

  @Unvalidated({ description: 'Подтверждение нового пароля', required: true })
  newPasswordConfirmation: string
}
