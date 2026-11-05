import { DateAndTime } from '../decorators/payment/date-and-time.decorator.js'
import { PaymentReferenceField } from '../decorators/payment/payment-reference.decorator.js'
import { PaymentStatus } from '../decorators/payment/payment-status.decorator.js'
import { PaymentService } from '../decorators/payment/service.decorator.js'
import { PaymentSum } from '../decorators/payment/sum.decorator.js'

import type { PaymentReference, CardPaymentStatus } from '@org/enums'
import type { CreatePaymentInput } from '@org/shared-types'

export class CreatePaymentDto implements CreatePaymentInput {
  @PaymentSum()
  sum: string

  @DateAndTime()
  dateAndTime: Date

  @PaymentService()
  service: string

  @PaymentReferenceField()
  reference: PaymentReference

  @PaymentStatus(false)
  status?: CardPaymentStatus
}
