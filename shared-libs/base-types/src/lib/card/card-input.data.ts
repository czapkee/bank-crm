import { PaginationBaseInput } from '../shared/pagination.type.js';

export interface CardPaginationBaseInput extends PaginationBaseInput {
  status?: number;
  userId?: string;
  dateFrom?: Date;
  dateTo?: Date;
}

export interface GetMyCardsBaseInput {
  pagination: CardPaginationBaseInput;
}

export interface GetMyCardBaseInput {
  id: string;
}

export interface GetCardsBaseInput {
  pagination: CardPaginationBaseInput;
}

export interface GetCardBaseInput {
  id: string;
}

export interface GetUserCardsBaseInput {
  userId: string;
  pagination: CardPaginationBaseInput;
}

export interface CreateCardBaseInput {
  cardNumber: string;
  accountNumber: string;
  dateOfExpire: Date;
  balance: string;
  status?: number;
  userId: string;
}

export interface UpdateCardBaseInput {
  id: string;
  accountNumber?: string;
  dateOfExpire?: Date;
  balance?: string;
  status?: number;
}

export interface ChangeCardStatusBaseInput {
  id: string;
  status: number;
}

export interface CardActionBaseInput {
  id: string;
}
