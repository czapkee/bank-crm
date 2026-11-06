import { Password } from '../../decorators/shared/password.decorator.js'
import { Unvalidated } from '../../decorators/shared/unvalidated.decorator.js'

import type { ClientChangePasswordInput } from '@org/shared-types'

export class ClientChangePasswordDto implements ClientChangePasswordInput {
  @Password()
  oldPassword: string

  @Password()
  newPassword: string

  @Unvalidated({ description: 'Подтверждение нового пароля', required: true })
  newPasswordConfirmation: string
}
