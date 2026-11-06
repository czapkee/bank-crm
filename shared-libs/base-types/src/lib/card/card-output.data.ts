import { PaginationBaseOutput } from '../shared/pagination.type.js';

export interface CardBaseOutput {
  id: string;
  cardNumber: string;
  accountNumber: string;
  dateOfExpire: string;
  balance: string;
  status: number;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CardPaginationBaseOutput extends PaginationBaseOutput {
  status?: number;
  userId?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface PaginatedCardsBaseOutput {
  pagination: CardPaginationBaseOutput;
  cards: CardBaseOutput[];
}
