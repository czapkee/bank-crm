import { CardStatuses } from '@org/enums';

import { Replace } from '../shared/replace.type.js';

import type {
  CardActionBaseInput,
  CardPaginationBaseInput,
  ChangeCardStatusBaseInput,
  CreateCardBaseInput,
  GetCardBaseInput,
  GetCardsBaseInput,
  GetMyCardBaseInput,
  GetMyCardsBaseInput,
  GetUserCardsBaseInput,
  UpdateCardBaseInput,
} from '@org/base-types';

export type CardPaginationInput = Replace<
  CardPaginationBaseInput,
  { status?: CardStatuses }
>;
export type GetMyCardsInput = Replace<
  GetMyCardsBaseInput,
  { pagination: CardPaginationInput }
>;
export type GetMyCardInput = Omit<GetMyCardBaseInput, 'id'>;
export type GetCardsInput = Replace<
  GetCardsBaseInput,
  { pagination: CardPaginationInput }
>;
export type GetCardInput = Omit<GetCardBaseInput, 'id'>;
export type GetUserCardsInput = Replace<
  Omit<GetUserCardsBaseInput, 'userId'>,
  { pagination: CardPaginationInput }
>;
export type CreateCardInput = Replace<
  CreateCardBaseInput,
  { status?: CardStatuses }
>;
export type UpdateCardInput = Replace<
  Omit<UpdateCardBaseInput, 'id'>,
  { status?: CardStatuses }
>;
export type ChangeCardStatusInput = Replace<
  Omit<ChangeCardStatusBaseInput, 'id'>,
  { status: CardStatuses }
>;
export type CardActionInput = Omit<CardActionBaseInput, 'id'>;
