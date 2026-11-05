export const SHARED_CONFIG = {
  ID: {
    VERSION: 7,
  },
  PAGINATION: {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 10,
    MIN_PAGE: 1,
    MIN_LIMIT: 1,
    MAX_LIMIT: 100,
  },
  SEARCH: {
    MIN_LENGTH: 1,
    MAX_LENGTH: 90,
  },
  NAME: {
    MIN_LENGTH: 2,
    MAX_LENGTH: 90,
  },
  DESCRIPTION: {
    MIN_LENGTH: 1,
    MAX_LENGTH: 500,
  },
  PHONE_NUMBER: {
    MIN_LENGTH: 7,
    MAX_LENGTH: 20,
  },
  MONEY: {
    MIN_VALUE: 0,
    MAX_DECIMAL_PLACES: 2,
  },
} as const
