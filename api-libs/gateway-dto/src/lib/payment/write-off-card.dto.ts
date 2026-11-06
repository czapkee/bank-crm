import { PaymentReferenceField } from '../decorators/payment/payment-reference.decorator.js'
import { PaymentService } from '../decorators/payment/service.decorator.js'
import { PaymentSum } from '../decorators/payment/sum.decorator.js'

import type { PaymentReference } from '@org/enums'
import type { WriteOffCardInput } from '@org/shared-types'

export class WriteOffCardDto implements WriteOffCardInput {
  @PaymentSum()
  sum: string

  @PaymentService()
  service: string

  @PaymentReferenceField()
  reference: PaymentReference
}
