import { PaymentStatus } from '../decorators/payment/payment-status.decorator.js'

import type { CardPaymentStatus } from '@org/enums'
import type { ChangePaymentStatusInput } from '@org/shared-types'

export class ChangePaymentStatusDto implements ChangePaymentStatusInput {
  @PaymentStatus()
  status: CardPaymentStatus
}
