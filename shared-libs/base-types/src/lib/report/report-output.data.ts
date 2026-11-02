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
  createdAt: Date;
  updatedAt: Date;
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
  resolvedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface ReportPaginationBaseOutput extends PaginationBaseOutput {
  userId?: string;
  assignedToId?: string;
  themeId?: string;
  status?: number;
  feedbackType?: number;
  priority?: number;
  dateFrom?: Date;
  dateTo?: Date;
}

export interface PaginatedReportsBaseOutput {
  pagination: ReportPaginationBaseOutput;
  reports: ReportListBaseOutput[];
}
