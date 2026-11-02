import { AdminProtected, Protected } from '../utils/protected.js';

import type {
  ChangePaymentStatusBaseInput,
  CreatePaymentBaseInput,
  GetCardPaymentsBaseInput,
  GetMyCardPaymentsBaseInput,
  GetMyPaymentsBaseInput,
  GetPaymentBaseInput,
  GetPaymentsBaseInput,
  PaymentActionBaseInput,
  PaymentPaginationBaseInput,
  WriteOffCardBaseInput,
} from '@org/base-types';

export type PaymentPaginationInput = PaymentPaginationBaseInput;
export type WriteOffCardInput = Protected<WriteOffCardBaseInput>;
export type GetMyPaymentsInput = Protected<GetMyPaymentsBaseInput>;
export type GetMyCardPaymentsInput = Protected<GetMyCardPaymentsBaseInput>;
export type GetPaymentsInput = AdminProtected<GetPaymentsBaseInput>;
export type GetPaymentInput = AdminProtected<GetPaymentBaseInput>;
export type GetCardPaymentsInput = AdminProtected<GetCardPaymentsBaseInput>;
export type CreatePaymentInput = AdminProtected<CreatePaymentBaseInput>;
export type ChangePaymentStatusInput =
  AdminProtected<ChangePaymentStatusBaseInput>;
export type PaymentActionInput = AdminProtected<PaymentActionBaseInput>;
