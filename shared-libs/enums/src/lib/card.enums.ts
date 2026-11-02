export enum CardStatuses {
  CREATED = 'CREATED',
  IN_PROCESS = 'IN_PROCESS',
  PROCESSED = 'PROCESSED',
  IN_DELIVERY = 'IN_DELIVERY',
  AT_CLIENT = 'AT_CLIENT',
  EXPIRED = 'EXPIRED',
  BLOCKED = 'BLOCKED',
  DESTROYED = 'DESTROYED',
  CLOSED = 'CLOSED',
}

export const CARD_STATUSES_TO_GRPC: Record<CardStatuses, number> = {
  [CardStatuses.CREATED]: 0,
  [CardStatuses.IN_PROCESS]: 1,
  [CardStatuses.PROCESSED]: 2,
  [CardStatuses.IN_DELIVERY]: 3,
  [CardStatuses.AT_CLIENT]: 4,
  [CardStatuses.EXPIRED]: 5,
  [CardStatuses.BLOCKED]: 6,
  [CardStatuses.DESTROYED]: 7,
  [CardStatuses.CLOSED]: 8,
};

export const GRPC_TO_CARD_STATUSES: Record<number, CardStatuses> = {
  0: CardStatuses.CREATED,
  1: CardStatuses.IN_PROCESS,
  2: CardStatuses.PROCESSED,
  3: CardStatuses.IN_DELIVERY,
  4: CardStatuses.AT_CLIENT,
  5: CardStatuses.EXPIRED,
  6: CardStatuses.BLOCKED,
  7: CardStatuses.DESTROYED,
  8: CardStatuses.CLOSED,
};

export enum CardPaymentStatus {
  IN_PROCESS = 'IN_PROCESS',
  APPROVED = 'APPROVED',
  INSUFFICIENT_FUNDS = 'INSUFFICIENT_FUNDS',
  DENIED_BY_FROD = 'DENIED_BY_FROD',
  INCORRECT_CVV = 'INCORRECT_CVV',
  LIMIT_EXCEEDED = 'LIMIT_EXCEEDED',
  INCORRECT_DATA = 'INCORRECT_DATA',
  INCORRECT_3D = 'INCORRECT_3D',
}

export const CARD_PAYMENT_STATUSES_TO_GRPC: Record<CardPaymentStatus, number> =
  {
    [CardPaymentStatus.IN_PROCESS]: 0,
    [CardPaymentStatus.APPROVED]: 1,
    [CardPaymentStatus.INSUFFICIENT_FUNDS]: 2,
    [CardPaymentStatus.DENIED_BY_FROD]: 3,
    [CardPaymentStatus.INCORRECT_CVV]: 4,
    [CardPaymentStatus.LIMIT_EXCEEDED]: 5,
    [CardPaymentStatus.INCORRECT_DATA]: 6,
    [CardPaymentStatus.INCORRECT_3D]: 7,
  };

export const GRPC_TO_CARD_PAYMENT_STATUSES: Record<number, CardPaymentStatus> =
  {
    0: CardPaymentStatus.IN_PROCESS,
    1: CardPaymentStatus.APPROVED,
    2: CardPaymentStatus.INSUFFICIENT_FUNDS,
    3: CardPaymentStatus.DENIED_BY_FROD,
    4: CardPaymentStatus.INCORRECT_CVV,
    5: CardPaymentStatus.LIMIT_EXCEEDED,
    6: CardPaymentStatus.INCORRECT_DATA,
    7: CardPaymentStatus.INCORRECT_3D,
  };

export enum PaymentReference {
  PAYMENT_FOR_GOODS_AND_SERVICES = 'PAYMENT_FOR_GOODS_AND_SERVICES',
  RETURN_AND_REFUND = 'RETURN_AND_REFUND',
  SALARY = 'SALARY',
  ACCOUNT_TOP_UP_VIA_ERIP = 'ACCOUNT_TOP_UP_VIA_ERIP',
  CARD_TO_CARD_TRANSFER = 'CARD_TO_CARD_TRANSFER',
}

export const PAYMENT_REFERENCES_TO_GRPC: Record<PaymentReference, number> = {
  [PaymentReference.PAYMENT_FOR_GOODS_AND_SERVICES]: 0,
  [PaymentReference.RETURN_AND_REFUND]: 1,
  [PaymentReference.SALARY]: 2,
  [PaymentReference.ACCOUNT_TOP_UP_VIA_ERIP]: 3,
  [PaymentReference.CARD_TO_CARD_TRANSFER]: 4,
};

export const GRPC_TO_PAYMENT_REFERENCES: Record<number, PaymentReference> = {
  0: PaymentReference.PAYMENT_FOR_GOODS_AND_SERVICES,
  1: PaymentReference.RETURN_AND_REFUND,
  2: PaymentReference.SALARY,
  3: PaymentReference.ACCOUNT_TOP_UP_VIA_ERIP,
  4: PaymentReference.CARD_TO_CARD_TRANSFER,
};
