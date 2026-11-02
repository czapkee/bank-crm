import { CardPaymentStatus, PaymentReference } from '@org/enums';

import { Replace } from '../shared/replace.type.js';

import type {
  PaginatedPaymentsBaseOutput,
  PaymentBaseOutput,
  PaymentPaginationBaseOutput,
} from '@org/base-types';

export type PaymentOutput = Replace<
  PaymentBaseOutput,
  {
    reference: PaymentReference;
    status: CardPaymentStatus;
  }
>;
export type PaymentPaginationOutput = Replace<
  PaymentPaginationBaseOutput,
  {
    status?: CardPaymentStatus;
    reference?: PaymentReference;
  }
>;
export type PaginatedPaymentsOutput = Replace<
  PaginatedPaymentsBaseOutput,
  {
    pagination: PaymentPaginationOutput;
    payments: PaymentOutput[];
  }
>;
