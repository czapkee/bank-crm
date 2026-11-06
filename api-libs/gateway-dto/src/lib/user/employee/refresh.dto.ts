import { RefreshToken } from '../../decorators/shared/token.decorator.js'

import type { EmployeeRefreshInput } from '@org/shared-types'

export class EmployeeRefreshDto implements EmployeeRefreshInput {
  @RefreshToken()
  refreshToken: string
}
