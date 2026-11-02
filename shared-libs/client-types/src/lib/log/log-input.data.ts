import type {
  GetLogBaseInput,
  GetLogsBaseInput,
  GetLogsByUserBaseInput,
  LogPaginationBaseInput,
} from '@org/base-types';

export type LogPaginationInput = LogPaginationBaseInput;
export type GetLogsInput = GetLogsBaseInput;
export type GetLogInput = Omit<GetLogBaseInput, 'id'>;
export type GetLogsByUserInput = Omit<GetLogsByUserBaseInput, 'userId'>;
