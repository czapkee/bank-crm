export const CARD_CONFIG = {
  CARD_NUMBER: {
    MIN_LENGTH: 16,
    MAX_LENGTH: 19,
  },
  ACCOUNT_NUMBER: {
    MIN_LENGTH: 13,
    MAX_LENGTH: 34,
  },
  DATE_OF_EXPIRE: {
    MIN_YEAR_OFFSET: 0,
    MAX_YEAR_OFFSET: 10,
  },
  BALANCE: {
    MIN_VALUE: 0,
    MAX_DECIMAL_PLACES: 2,
  },
} as const
