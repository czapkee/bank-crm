import { AdminProtected, Protected } from '../utils/protected.js';

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

export type CardPaginationInput = CardPaginationBaseInput;
export type GetMyCardsInput = Protected<GetMyCardsBaseInput>;
export type GetMyCardInput = Protected<GetMyCardBaseInput>;
export type GetCardsInput = AdminProtected<GetCardsBaseInput>;
export type GetCardInput = AdminProtected<GetCardBaseInput>;
export type GetUserCardsInput = AdminProtected<GetUserCardsBaseInput>;
export type CreateCardInput = AdminProtected<CreateCardBaseInput>;
export type UpdateCardInput = AdminProtected<UpdateCardBaseInput>;
export type ChangeCardStatusInput = AdminProtected<ChangeCardStatusBaseInput>;
export type CardActionInput = AdminProtected<CardActionBaseInput>;
