import { PaginationBaseOutput } from '../shared/pagination.type.js';

export interface LogBaseOutput {
  id: string;
  service: string;
  entity: string | null;
  method: string;
  action: string;
  userId: string | null;
  data: string | null;
  userAgent: string | null;
  createdAt: Date;
}

export interface LogPaginationBaseOutput extends PaginationBaseOutput {
  service?: string;
  entity?: string;
  method?: string;
  action?: string;
  userId?: string;
  dateFrom?: Date;
  dateTo?: Date;
}

export interface PaginatedLogsBaseOutput {
  pagination: LogPaginationBaseOutput;
  logs: LogBaseOutput[];
}
