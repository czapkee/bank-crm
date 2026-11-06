import { Password } from '../../decorators/shared/password.decorator.js'

import type { ResetEmployeePasswordInput } from '@org/shared-types'

export class ResetEmployeePasswordDto implements ResetEmployeePasswordInput {
  @Password()
  newPassword: string
}
