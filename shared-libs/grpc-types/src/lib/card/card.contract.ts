import type {
  CardActionInput,
  ChangeCardStatusInput,
  CreateCardInput,
  GetCardInput,
  GetCardsInput,
  GetMyCardInput,
  GetMyCardsInput,
  GetUserCardsInput,
  UpdateCardInput,
} from './card-input.data.js';
import type { CardOutput, PaginatedCardsOutput } from './card-output.data.js';
import type {
  ChangePaymentStatusInput,
  CreatePaymentInput,
  GetCardPaymentsInput,
  GetMyCardPaymentsInput,
  GetMyPaymentsInput,
  GetPaymentInput,
  GetPaymentsInput,
  PaymentActionInput,
  WriteOffCardInput,
} from './payment-input.data.js';
import type {
  PaginatedPaymentsOutput,
  PaymentOutput,
} from './payment-output.data.js';
import type { Empty } from '../shared/empty.type.js';
import type { ToObservable } from '../utils/to-observable.js';

export interface CardServiceContract {
  GetMyCards(data: GetMyCardsInput): Promise<PaginatedCardsOutput>;
  GetMyCard(data: GetMyCardInput): Promise<CardOutput>;
}

export interface CardAdminServiceContract {
  GetCards(data: GetCardsInput): Promise<PaginatedCardsOutput>;
  GetCard(data: GetCardInput): Promise<CardOutput>;
  GetUserCards(data: GetUserCardsInput): Promise<PaginatedCardsOutput>;
  CreateCard(data: CreateCardInput): Promise<CardOutput>;
  UpdateCard(data: UpdateCardInput): Promise<CardOutput>;
  ChangeCardStatus(data: ChangeCardStatusInput): Promise<CardOutput>;
  BlockCard(data: CardActionInput): Promise<CardOutput>;
  UnblockCard(data: CardActionInput): Promise<CardOutput>;
  DeleteCard(data: CardActionInput): Promise<Empty>;
}

export interface PaymentServiceContract {
  WriteOffCard(data: WriteOffCardInput): Promise<PaymentOutput>;
  GetMyPayments(data: GetMyPaymentsInput): Promise<PaginatedPaymentsOutput>;
  GetMyCardPayments(
    data: GetMyCardPaymentsInput,
  ): Promise<PaginatedPaymentsOutput>;
}

export interface PaymentAdminServiceContract {
  GetPayments(data: GetPaymentsInput): Promise<PaginatedPaymentsOutput>;
  GetPayment(data: GetPaymentInput): Promise<PaymentOutput>;
  GetCardPayments(data: GetCardPaymentsInput): Promise<PaginatedPaymentsOutput>;
  CreatePayment(data: CreatePaymentInput): Promise<PaymentOutput>;
  ChangePaymentStatus(data: ChangePaymentStatusInput): Promise<PaymentOutput>;
  DeletePayment(data: PaymentActionInput): Promise<Empty>;
}

export type CardServiceObservableContract = ToObservable<CardServiceContract>;
export type CardAdminServiceObservableContract =
  ToObservable<CardAdminServiceContract>;
export type PaymentServiceObservableContract =
  ToObservable<PaymentServiceContract>;
export type PaymentAdminServiceObservableContract =
  ToObservable<PaymentAdminServiceContract>;
