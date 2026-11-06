import { RefreshToken } from '../../decorators/shared/token.decorator.js'

import type { ClientRefreshInput } from '@org/shared-types'

export class ClientRefreshDto implements ClientRefreshInput {
  @RefreshToken()
  refreshToken: string
}
