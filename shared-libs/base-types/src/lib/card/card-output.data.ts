import { PaginationBaseOutput } from '../shared/pagination.type.js';

export interface CardBaseOutput {
  id: string;
  cardNumber: string;
  accountNumber: string;
  dateOfExpire: Date;
  balance: string;
  status: number;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CardPaginationBaseOutput extends PaginationBaseOutput {
  status?: number;
  userId?: string;
  dateFrom?: Date;
  dateTo?: Date;
}

export interface PaginatedCardsBaseOutput {
  pagination: CardPaginationBaseOutput;
  cards: CardBaseOutput[];
}
