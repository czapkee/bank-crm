import { Roles } from '@org/enums';

import { Replace } from '../../shared/replace.type.js';

import type {
  AuthBaseOutput,
  EmployeePaginationBaseOutput,
  EmployeeUserBaseEntity,
  EmployeeUserBasePayload,
  PaginatedEmployeesBaseOutput,
} from '@org/base-types';

export type EmployeeAuthOutput = AuthBaseOutput
export type EmployeeUserPayload = Replace<
  EmployeeUserBasePayload,
  { role: Roles }
>;
export type EmployeeUserEntity = Replace<
  EmployeeUserBaseEntity,
  { role: Roles }
>;
export type EmployeePaginationOutput = Replace<
  EmployeePaginationBaseOutput,
  { role?: Roles }
>;
export type PaginatedEmployeesOutput = Replace<
  PaginatedEmployeesBaseOutput,
  {
    pagination: EmployeePaginationOutput;
    employees: EmployeeUserEntity[];
  }
>;
