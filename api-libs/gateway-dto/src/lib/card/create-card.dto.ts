import { AccountNumber } from '../decorators/card/account-number.decorator.js'
import { Balance } from '../decorators/card/balance.decorator.js'
import { CardNumber } from '../decorators/card/card-number.decorator.js'
import { CardStatus } from '../decorators/card/card-status.decorator.js'
import { DateOfExpire } from '../decorators/card/date-of-expire.decorator.js'
import { Id } from '../decorators/shared/id.decorator.js'

import type { CardStatuses } from '@org/enums'
import type { CreateCardInput } from '@org/shared-types'

export class CreateCardDto implements CreateCardInput {
  @CardNumber()
  cardNumber: string

  @AccountNumber()
  accountNumber: string

  @DateOfExpire()
  dateOfExpire: Date

  @Balance()
  balance: string

  @CardStatus(false)
  status?: CardStatuses

  @Id()
  userId: string
}
