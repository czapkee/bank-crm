import { CardStatuses } from '@org/enums';

import { Replace } from '../shared/replace.type.js';

import type {
  CardBaseOutput,
  CardPaginationBaseOutput,
  PaginatedCardsBaseOutput,
} from '@org/base-types';

export type CardOutput = Replace<CardBaseOutput, { status: CardStatuses }>;
export type CardPaginationOutput = Replace<
  CardPaginationBaseOutput,
  { status?: CardStatuses }
>;
export type PaginatedCardsOutput = Replace<
  PaginatedCardsBaseOutput,
  {
    pagination: CardPaginationOutput;
    cards: CardOutput[];
  }
>;
