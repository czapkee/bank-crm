import { Replace } from '../shared/replace.type.js';

import type {
  PaginatedThemesBaseOutput,
  ThemeBaseOutput,
  ThemeDetailedBaseOutput,
  ThemePaginationBaseOutput,
} from '@org/base-types';

export type ThemeOutput = ThemeBaseOutput;
export type ThemeDetailedOutput = Replace<
  ThemeDetailedBaseOutput,
  { children: ThemeOutput[] }
>;
export type ThemePaginationOutput = ThemePaginationBaseOutput;
export type PaginatedThemesOutput = Replace<
  PaginatedThemesBaseOutput,
  {
    pagination: ThemePaginationOutput;
    themes: ThemeOutput[];
  }
>;
