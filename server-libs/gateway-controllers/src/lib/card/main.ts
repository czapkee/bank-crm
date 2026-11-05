import { CardAdminController } from './card-admin.controller.js'
import { CardController } from './card.controller.js'
import { PaymentAdminController } from './payment-admin.controller.js'
import { PaymentController } from './payment.controller.js'

export const CARD_CONTROLLERS = [
  CardController,
  CardAdminController,
  PaymentController,
  PaymentAdminController,
]
