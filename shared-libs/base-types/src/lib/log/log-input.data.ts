import { PaginationBaseInput } from '../shared/pagination.type.js';

export interface LogPaginationBaseInput extends PaginationBaseInput {
  service?: string;
  entity?: string;
  method?: string;
  action?: string;
  userId?: string;
  dateFrom?: Date | string;
  dateTo?: Date | string;
}

export interface GetLogsBaseInput {
  pagination: LogPaginationBaseInput;
}

export interface GetLogBaseInput {
  id: string;
}

export interface GetLogsByUserBaseInput {
  userId: string;
  pagination: LogPaginationBaseInput;
}
