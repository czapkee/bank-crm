import { Password } from '../../decorators/shared/password.decorator.js'

import type { ClientDeleteAccountInput } from '@org/shared-types'

export class ClientDeleteAccountDto implements ClientDeleteAccountInput {
  @Password()
  password: string
}
