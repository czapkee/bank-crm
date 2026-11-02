import { AdminProtected, Protected } from '../utils/protected.js';

import type {
  AssignReportBaseInput,
  ChangeReportStatusBaseInput,
  CreateReportBaseInput,
  CreateThemeBaseInput,
  GetAdminReportBaseInput,
  GetMyReportBaseInput,
  GetMyReportsBaseInput,
  GetReportsBaseInput,
  GetThemeAdminBaseInput,
  GetThemeBaseInput,
  GetThemesAdminBaseInput,
  GetThemesBaseInput,
  MyReportActionBaseInput,
  ReportActionBaseInput,
  ReportPaginationBaseInput,
  ThemeActionBaseInput,
  ThemePaginationBaseInput,
  UpdateMyReportBaseInput,
  UpdateReportBaseInput,
  UpdateThemeBaseInput,
} from '@org/base-types';

export type ThemePaginationInput = ThemePaginationBaseInput;
export type GetThemesInput = Protected<GetThemesBaseInput>;
export type GetThemeInput = Protected<GetThemeBaseInput>;
export type GetThemesAdminInput = AdminProtected<GetThemesAdminBaseInput>;
export type GetThemeAdminInput = AdminProtected<GetThemeAdminBaseInput>;
export type CreateThemeInput = AdminProtected<CreateThemeBaseInput>;
export type UpdateThemeInput = AdminProtected<UpdateThemeBaseInput>;
export type ThemeActionInput = AdminProtected<ThemeActionBaseInput>;

export type ReportPaginationInput = ReportPaginationBaseInput;
export type GetMyReportsInput = Protected<GetMyReportsBaseInput>;
export type GetMyReportInput = Protected<GetMyReportBaseInput>;
export type GetReportsInput = AdminProtected<GetReportsBaseInput>;
export type GetAdminReportInput = AdminProtected<GetAdminReportBaseInput>;
export type CreateReportInput = Protected<CreateReportBaseInput>;
export type UpdateMyReportInput = Protected<UpdateMyReportBaseInput>;
export type UpdateReportInput = AdminProtected<UpdateReportBaseInput>;
export type AssignReportInput = AdminProtected<AssignReportBaseInput>;
export type ChangeReportStatusInput =
  AdminProtected<ChangeReportStatusBaseInput>;
export type ReportActionInput = AdminProtected<ReportActionBaseInput>;
export type MyReportActionInput = Protected<MyReportActionBaseInput>;
