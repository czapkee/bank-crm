import { Replace } from '../shared/replace.type.js';

import type {
  LogBaseOutput,
  LogPaginationBaseOutput,
  PaginatedLogsBaseOutput,
} from '@org/base-types';

export type LogOutput = Replace<LogBaseOutput, { data: unknown }>;
export type LogPaginationOutput = LogPaginationBaseOutput;
export type PaginatedLogsOutput = Replace<
  PaginatedLogsBaseOutput,
  { logs: LogOutput[] }
>;
