import { PaginationBaseOutput } from '../shared/pagination.type.js';

export interface PaymentBaseOutput {
  id: string;
  sum: string;
  dateAndTime: Date;
  service: string;
  reference: number;
  status: number;
  cardId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PaymentPaginationBaseOutput extends PaginationBaseOutput {
  status?: number;
  reference?: number;
  cardId?: string;
  dateFrom?: Date;
  dateTo?: Date;
}

export interface PaginatedPaymentsBaseOutput {
  pagination: PaymentPaginationBaseOutput;
  payments: PaymentBaseOutput[];
}
