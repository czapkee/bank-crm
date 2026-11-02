import { PaginationBaseOutput } from '../shared/pagination.type.js';

export interface ThemeBaseOutput {
  id: string;
  name: string;
  description: string | null;
  parentId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface ThemeDetailedBaseOutput extends ThemeBaseOutput {
  children: ThemeBaseOutput[];
}

export interface ThemePaginationBaseOutput extends PaginationBaseOutput {
  parentId?: string;
}

export interface PaginatedThemesBaseOutput {
  pagination: ThemePaginationBaseOutput;
  themes: ThemeBaseOutput[];
}
