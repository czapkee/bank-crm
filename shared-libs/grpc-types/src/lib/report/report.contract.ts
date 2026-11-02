import type {
  AssignReportInput,
  ChangeReportStatusInput,
  CreateReportInput,
  CreateThemeInput,
  GetAdminReportInput,
  GetMyReportInput,
  GetMyReportsInput,
  GetReportsInput,
  GetThemeAdminInput,
  GetThemeInput,
  GetThemesAdminInput,
  GetThemesInput,
  MyReportActionInput,
  ReportActionInput,
  ThemeActionInput,
  UpdateMyReportInput,
  UpdateReportInput,
  UpdateThemeInput,
} from './report-input.data.js';
import type {
  PaginatedReportsOutput,
  PaginatedThemesOutput,
  ReportOutput,
  ThemeDetailedOutput,
  ThemeOutput,
} from './report-output.data.js';
import type { Empty } from '../shared/empty.type.js';
import type { ToObservable } from '../utils/to-observable.js';

export interface ReportServiceContract {
  CreateReport(data: CreateReportInput): Promise<ReportOutput>;
  GetMyReports(data: GetMyReportsInput): Promise<PaginatedReportsOutput>;
  GetMyReport(data: GetMyReportInput): Promise<ReportOutput>;
  UpdateMyReport(data: UpdateMyReportInput): Promise<ReportOutput>;
  DeleteMyReport(data: MyReportActionInput): Promise<Empty>;
}

export interface ReportAdminServiceContract {
  GetReports(data: GetReportsInput): Promise<PaginatedReportsOutput>;
  GetReport(data: GetAdminReportInput): Promise<ReportOutput>;
  UpdateReport(data: UpdateReportInput): Promise<ReportOutput>;
  AssignReport(data: AssignReportInput): Promise<ReportOutput>;
  ChangeReportStatus(data: ChangeReportStatusInput): Promise<ReportOutput>;
  ResolveReport(data: ReportActionInput): Promise<ReportOutput>;
  DeleteReport(data: ReportActionInput): Promise<Empty>;
}

export interface ThemeServiceContract {
  GetThemes(data: GetThemesInput): Promise<PaginatedThemesOutput>;
  GetTheme(data: GetThemeInput): Promise<ThemeDetailedOutput>;
}

export interface ThemeAdminServiceContract {
  GetThemes(data: GetThemesAdminInput): Promise<PaginatedThemesOutput>;
  GetTheme(data: GetThemeAdminInput): Promise<ThemeDetailedOutput>;
  CreateTheme(data: CreateThemeInput): Promise<ThemeOutput>;
  UpdateTheme(data: UpdateThemeInput): Promise<ThemeOutput>;
  DeleteTheme(data: ThemeActionInput): Promise<Empty>;
}

export type ReportServiceObservableContract =
  ToObservable<ReportServiceContract>;
export type ReportAdminServiceObservableContract =
  ToObservable<ReportAdminServiceContract>;
export type ThemeServiceObservableContract = ToObservable<ThemeServiceContract>;
export type ThemeAdminServiceObservableContract =
  ToObservable<ThemeAdminServiceContract>;
