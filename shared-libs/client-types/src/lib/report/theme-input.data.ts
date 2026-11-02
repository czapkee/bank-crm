import type {
  CreateThemeBaseInput,
  GetThemeAdminBaseInput,
  GetThemeBaseInput,
  GetThemesAdminBaseInput,
  GetThemesBaseInput,
  ThemeActionBaseInput,
  ThemePaginationBaseInput,
  UpdateThemeBaseInput,
} from '@org/base-types';

export type ThemePaginationInput = ThemePaginationBaseInput;
export type GetThemesInput = GetThemesBaseInput;
export type GetThemeInput = Omit<GetThemeBaseInput, 'id'>;
export type GetThemesAdminInput = GetThemesAdminBaseInput;
export type GetThemeAdminInput = Omit<GetThemeAdminBaseInput, 'id'>;
export type CreateThemeInput = CreateThemeBaseInput;
export type UpdateThemeInput = Omit<UpdateThemeBaseInput, 'id'>;
export type ThemeActionInput = Omit<ThemeActionBaseInput, 'id'>;
