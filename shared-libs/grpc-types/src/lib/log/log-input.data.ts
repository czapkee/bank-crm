import { AdminProtected } from '../utils/protected.js';

import type {
  GetLogBaseInput,
  GetLogsBaseInput,
  GetLogsByUserBaseInput,
  LogPaginationBaseInput,
} from '@org/base-types';

export type LogPaginationInput = LogPaginationBaseInput;
export type GetLogsInput = AdminProtected<GetLogsBaseInput>;
export type GetLogInput = AdminProtected<GetLogBaseInput>;
export type GetLogsByUserInput = AdminProtected<GetLogsByUserBaseInput>;
