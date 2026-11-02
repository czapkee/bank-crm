import { ReportFeedback, ReportPriority, ReportStatus } from '@org/enums';

import { Replace } from '../shared/replace.type.js';

import type {
  AssignReportBaseInput,
  ChangeReportStatusBaseInput,
  CreateReportBaseInput,
  GetAdminReportBaseInput,
  GetMyReportBaseInput,
  GetMyReportsBaseInput,
  GetReportsBaseInput,
  MyReportActionBaseInput,
  ReportActionBaseInput,
  ReportPaginationBaseInput,
  UpdateMyReportBaseInput,
  UpdateReportBaseInput,
} from '@org/base-types';

export type ReportPaginationInput = Replace<
  ReportPaginationBaseInput,
  {
    status?: ReportStatus;
    feedbackType?: ReportFeedback;
    priority?: ReportPriority;
  }
>;
export type GetMyReportsInput = Replace<
  GetMyReportsBaseInput,
  { pagination: ReportPaginationInput }
>;
export type GetMyReportInput = Omit<GetMyReportBaseInput, 'id'>;
export type GetReportsInput = Replace<
  GetReportsBaseInput,
  { pagination: ReportPaginationInput }
>;
export type GetAdminReportInput = Omit<GetAdminReportBaseInput, 'id'>;
export type CreateReportInput = Replace<
  CreateReportBaseInput,
  { feedbackType?: ReportFeedback }
>;
export type UpdateMyReportInput = Replace<
  Omit<UpdateMyReportBaseInput, 'id'>,
  { feedbackType?: ReportFeedback }
>;
export type UpdateReportInput = Replace<
  Omit<UpdateReportBaseInput, 'id'>,
  {
    status?: ReportStatus;
    feedbackType?: ReportFeedback;
    priority?: ReportPriority;
  }
>;
export type AssignReportInput = Omit<AssignReportBaseInput, 'id'>;
export type ChangeReportStatusInput = Replace<
  Omit<ChangeReportStatusBaseInput, 'id'>,
  { status: ReportStatus }
>;
export type ReportActionInput = Omit<ReportActionBaseInput, 'id'>;
export type MyReportActionInput = Omit<MyReportActionBaseInput, 'id'>;
