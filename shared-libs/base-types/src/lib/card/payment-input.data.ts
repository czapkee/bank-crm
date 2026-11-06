import { PaginationBaseInput } from '../shared/pagination.type.js';

export interface PaymentPaginationBaseInput extends PaginationBaseInput {
  status?: number;
  reference?: number;
  cardId?: string;
  dateFrom?: Date | string;
  dateTo?: Date | string;
}

export interface WriteOffCardBaseInput {
  cardId: string;
  sum: string;
  service: string;
  reference: number;
}

export interface GetMyPaymentsBaseInput {
  pagination: PaymentPaginationBaseInput;
}

export interface GetMyCardPaymentsBaseInput {
  cardId: string;
  pagination: PaymentPaginationBaseInput;
}

export interface GetPaymentsBaseInput {
  pagination: PaymentPaginationBaseInput;
}

export interface GetPaymentBaseInput {
  id: string;
}

export interface GetCardPaymentsBaseInput {
  cardId: string;
  pagination: PaymentPaginationBaseInput;
}

export interface CreatePaymentBaseInput {
  cardId: string;
  sum: string;
  dateAndTime: Date | string;
  service: string;
  reference: number;
  status?: number;
}

export interface ChangePaymentStatusBaseInput {
  id: string;
  status: number;
}

export interface PaymentActionBaseInput {
  id: string;
}
