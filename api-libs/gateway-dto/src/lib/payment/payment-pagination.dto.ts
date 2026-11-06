import { PaymentReferenceField } from '../decorators/payment/payment-reference.decorator.js'
import { PaymentStatus } from '../decorators/payment/payment-status.decorator.js'
import { DateField } from '../decorators/shared/date.decorator.js'
import { Id } from '../decorators/shared/id.decorator.js'
import { BasePaginationDto } from '../shared/pagination-base.dto.js'

import type { CardPaymentStatus, PaymentReference } from '@org/enums'
import type { PaymentPaginationInput } from '@org/shared-types'

export class PaymentPaginationDto extends BasePaginationDto implements PaymentPaginationInput {
  @PaymentStatus(false)
  status?: CardPaymentStatus

  @PaymentReferenceField(false)
  reference?: PaymentReference

  @Id(false)
  cardId?: string

  @DateField()
  dateFrom?: Date

  @DateField()
  dateTo?: Date
}
