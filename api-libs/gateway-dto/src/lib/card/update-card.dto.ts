import { AccountNumber } from '../decorators/card/account-number.decorator.js'
import { Balance } from '../decorators/card/balance.decorator.js'
import { CardStatus } from '../decorators/card/card-status.decorator.js'
import { DateOfExpire } from '../decorators/card/date-of-expire.decorator.js'

import type { CardStatuses } from '@org/enums'
import type { UpdateCardInput } from '@org/shared-types'

export class UpdateCardDto implements UpdateCardInput {
  @AccountNumber(false)
  accountNumber?: string

  @DateOfExpire(false)
  dateOfExpire?: Date

  @Balance(false)
  balance?: string

  @CardStatus(false)
  status?: CardStatuses
}
