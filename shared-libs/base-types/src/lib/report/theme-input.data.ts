import { PaginationBaseInput } from '../shared/pagination.type.js';

export interface ThemePaginationBaseInput extends PaginationBaseInput {
  parentId?: string;
}

export interface GetThemesBaseInput {
  pagination: ThemePaginationBaseInput;
}

export interface GetThemeBaseInput {
  id: string;
}

export interface GetThemesAdminBaseInput {
  pagination: ThemePaginationBaseInput;
}

export interface GetThemeAdminBaseInput {
  id: string;
}

export interface CreateThemeBaseInput {
  name: string;
  description?: string;
  parentId?: string;
}

export interface UpdateThemeBaseInput {
  id: string;
  name?: string;
  description?: string;
  parentId?: string;
}

export interface ThemeActionBaseInput {
  id: string;
}
