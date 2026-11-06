import { Password } from '../../decorators/shared/password.decorator.js'

import type { ResetClientPasswordInput } from '@org/shared-types'

export class ResetClientPasswordDto implements ResetClientPasswordInput {
  @Password()
  newPassword: string
}
