import { ReportFeedback, ReportPriority, ReportStatus } from '@org/enums';

import { Replace } from '../shared/replace.type.js';

import type {
  PaginatedReportsBaseOutput,
  ReportBaseOutput,
  ReportListBaseOutput,
  ReportPaginationBaseOutput,
} from '@org/base-types';

export type ReportListOutput = Replace<
  ReportListBaseOutput,
  {
    status: ReportStatus;
    feedbackType: ReportFeedback;
    priority: ReportPriority;
  }
>;
export type ReportOutput = Replace<
  ReportBaseOutput,
  {
    status: ReportStatus;
    feedbackType: ReportFeedback;
    priority: ReportPriority;
  }
>;
export type ReportPaginationOutput = Replace<
  ReportPaginationBaseOutput,
  {
    status?: ReportStatus;
    feedbackType?: ReportFeedback;
    priority?: ReportPriority;
  }
>;
export type PaginatedReportsOutput = Replace<
  PaginatedReportsBaseOutput,
  {
    pagination: ReportPaginationOutput;
    reports: ReportListOutput[];
  }
>;
