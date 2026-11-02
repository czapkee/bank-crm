import { Roles } from '@org/enums';

import { Replace } from '../../shared/replace.type.js';

import type {
  ChangeEmployeeRoleBaseInput,
  ChangePasswordBaseInput,
  CreateEmployeeBaseInput,
  DeleteAccountBaseInput,
  EmployeeActionBaseInput,
  EmployeePaginationBaseInput,
  GetEmployeeBaseInput,
  GetEmployeesBaseInput,
  LoginBaseInput,
  RefreshBaseInput,
  RegisterBaseInput,
  ResetEmployeePasswordBaseInput,
  UpdateEmployeeBaseInput,
  UpdateProfileBaseInput,
} from '@org/base-types';

export type EmployeeRegisterInput = RegisterBaseInput;
export type EmployeeLoginInput = LoginBaseInput;
export type EmployeeRefreshInput = RefreshBaseInput;
export type EmployeeChangePasswordInput = ChangePasswordBaseInput;
export type EmployeeUpdateProfileInput = UpdateProfileBaseInput;
export type EmployeeDeleteAccountInput = DeleteAccountBaseInput;

export type EmployeePaginationInput = Replace<
  EmployeePaginationBaseInput,
  { role?: Roles }
>;
export type GetEmployeesInput = Replace<
  GetEmployeesBaseInput,
  { pagination: EmployeePaginationInput }
>;
export type GetEmployeeInput = Omit<GetEmployeeBaseInput, 'id'>;
export type CreateEmployeeInput = Replace<
  CreateEmployeeBaseInput,
  { role: Roles }
>;
export type UpdateEmployeeInput = Replace<
  Omit<UpdateEmployeeBaseInput, 'id'>,
  { role?: Roles }
>;
export type ChangeEmployeeRoleInput = Replace<
  Omit<ChangeEmployeeRoleBaseInput, 'id'>,
  { role: Roles }
>;
export type EmployeeActionInput = Omit<EmployeeActionBaseInput, 'id'>;
export type ResetEmployeePasswordInput = Omit<
  ResetEmployeePasswordBaseInput,
  'id'
>;
