import { CardPaymentStatus, PaymentReference } from '@org/enums';

import { Replace } from '../shared/replace.type.js';

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

export type PaymentPaginationInput = Replace<
  PaymentPaginationBaseInput,
  {
    status?: CardPaymentStatus;
    reference?: PaymentReference;
  }
>;
export type WriteOffCardInput = Replace<
  Omit<WriteOffCardBaseInput, 'cardId'>,
  { reference: PaymentReference }
>;
export type GetMyPaymentsInput = Replace<
  GetMyPaymentsBaseInput,
  { pagination: PaymentPaginationInput }
>;
export type GetMyCardPaymentsInput = Replace<
  Omit<GetMyCardPaymentsBaseInput, 'cardId'>,
  { pagination: PaymentPaginationInput }
>;
export type GetPaymentsInput = Replace<
  GetPaymentsBaseInput,
  { pagination: PaymentPaginationInput }
>;
export type GetPaymentInput = Omit<GetPaymentBaseInput, 'id'>;
export type GetCardPaymentsInput = Replace<
  Omit<GetCardPaymentsBaseInput, 'cardId'>,
  { pagination: PaymentPaginationInput }
>;
export type CreatePaymentInput = Replace<
  Omit<CreatePaymentBaseInput, 'cardId'>,
  {
    reference: PaymentReference;
    status?: CardPaymentStatus;
  }
>;
export type ChangePaymentStatusInput = Replace<
  Omit<ChangePaymentStatusBaseInput, 'id'>,
  { status: CardPaymentStatus }
>;
export type PaymentActionInput = Omit<PaymentActionBaseInput, 'id'>;
