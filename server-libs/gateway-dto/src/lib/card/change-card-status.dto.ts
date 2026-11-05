import { CardStatus } from '../decorators/card/card-status.decorator.js'

import type { CardStatuses } from '@org/enums'
import type { ChangeCardStatusInput } from '@org/shared-types'

export class ChangeCardStatusDto implements ChangeCardStatusInput {
  @CardStatus()
  status: CardStatuses
}
