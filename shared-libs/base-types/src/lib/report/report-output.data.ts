import { PaginationBaseOutput } from '../shared/pagination.type.js';

export interface ReportListBaseOutput {
  id: string;
  userId: string | null;
  assignedToId: string | null;
  title: string;
  themeId: string | null;
  status: number;
  feedbackType: number;
  priority: number;
  createdAt: string;
  updatedAt: string;
}

export interface ReportBaseOutput {
  id: string;
  userId: string | null;
  assignedToId: string | null;
  title: string;
  content: string;
  feedbackContact: string | null;
  themeId: string | null;
  status: number;
  feedbackType: number;
  priority: number;
  resolvedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ReportPaginationBaseOutput extends PaginationBaseOutput {
  userId?: string;
  assignedToId?: string;
  themeId?: string;
  status?: number;
  feedbackType?: number;
  priority?: number;
  dateFrom?: string;
  dateTo?: string;
}

export interface PaginatedReportsBaseOutput {
  pagination: ReportPaginationBaseOutput;
  reports: ReportListBaseOutput[];
}
