import { PaginationBaseInput } from '../shared/pagination.type.js';

export interface ReportPaginationBaseInput extends PaginationBaseInput {
  userId?: string;
  assignedToId?: string;
  themeId?: string;
  status?: number;
  feedbackType?: number;
  priority?: number;
  dateFrom?: Date | string;
  dateTo?: Date | string;
}

export interface GetMyReportsBaseInput {
  pagination: ReportPaginationBaseInput;
}

export interface GetMyReportBaseInput {
  id: string;
}

export interface GetReportsBaseInput {
  pagination: ReportPaginationBaseInput;
}

export interface GetAdminReportBaseInput {
  id: string;
}

export interface CreateReportBaseInput {
  title: string;
  content: string;
  feedbackContact?: string;
  themeId?: string;
  feedbackType?: number;
}

export interface UpdateMyReportBaseInput {
  id: string;
  title?: string;
  content?: string;
  feedbackContact?: string;
  themeId?: string;
  feedbackType?: number;
}

export interface UpdateReportBaseInput {
  id: string;
  title?: string;
  content?: string;
  feedbackContact?: string;
  themeId?: string;
  status?: number;
  feedbackType?: number;
  priority?: number;
  assignedToId?: string;
}

export interface AssignReportBaseInput {
  id: string;
  assignedToId?: string;
}

export interface ChangeReportStatusBaseInput {
  id: string;
  status: number;
}

export interface ReportActionBaseInput {
  id: string;
}

export interface MyReportActionBaseInput {
  id: string;
}
