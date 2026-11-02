import { AdminProtected, Protected } from '../../utils/protected.js';

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
export type EmployeeChangePasswordInput = Protected<ChangePasswordBaseInput>;
export type EmployeeUpdateProfileInput = Protected<UpdateProfileBaseInput>;
export type EmployeeDeleteAccountInput = Protected<DeleteAccountBaseInput>;

export type EmployeePaginationInput = EmployeePaginationBaseInput;
export type GetEmployeesInput = AdminProtected<GetEmployeesBaseInput>;
export type GetEmployeeInput = AdminProtected<GetEmployeeBaseInput>;
export type CreateEmployeeInput = AdminProtected<CreateEmployeeBaseInput>;
export type UpdateEmployeeInput = AdminProtected<UpdateEmployeeBaseInput>;
export type ChangeEmployeeRoleInput =
  AdminProtected<ChangeEmployeeRoleBaseInput>;
export type EmployeeActionInput = AdminProtected<EmployeeActionBaseInput>;
export type ResetEmployeePasswordInput =
  AdminProtected<ResetEmployeePasswordBaseInput>;
