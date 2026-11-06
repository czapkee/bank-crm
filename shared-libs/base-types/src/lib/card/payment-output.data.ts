import { PaginationBaseOutput } from '../shared/pagination.type.js';

export interface PaymentBaseOutput {
  id: string;
  sum: string;
  dateAndTime: string;
  service: string;
  reference: number;
  status: number;
  cardId: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentPaginationBaseOutput extends PaginationBaseOutput {
  status?: number;
  reference?: number;
  cardId?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface PaginatedPaymentsBaseOutput {
  pagination: PaymentPaginationBaseOutput;
  payments: PaymentBaseOutput[];
}
