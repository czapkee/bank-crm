import { Email } from '../../decorators/shared/email.decorator.js'
import { Password } from '../../decorators/shared/password.decorator.js'

import type { ClientLoginInput } from '@org/shared-types'

export class ClientLoginDto implements ClientLoginInput {
  @Email()
  email: string

  @Password()
  password: string
}
