import type {
  GetLogInput,
  GetLogsByUserInput,
  GetLogsInput,
} from './log-input.data.js';
import type { PaginatedLogsOutput, LogOutput } from './log-output.data.js';
import type { ToObservable } from '../utils/to-observable.js';

export interface LogServiceContract {
  GetLogs(data: GetLogsInput): Promise<PaginatedLogsOutput>;
  GetLog(data: GetLogInput): Promise<LogOutput>;
  GetLogsByUser(data: GetLogsByUserInput): Promise<PaginatedLogsOutput>;
}

export type LogServiceObservableContract = ToObservable<LogServiceContract>;
