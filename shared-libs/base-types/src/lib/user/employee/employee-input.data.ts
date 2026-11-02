import { PaginationBaseInput } from '../../shared/pagination.type.js';

export interface EmployeePaginationBaseInput extends PaginationBaseInput {
  role?: number;
  isActive?: boolean;
}

export interface GetEmployeesBaseInput {
  pagination: EmployeePaginationBaseInput;
}

export interface GetEmployeeBaseInput {
  id: string;
}

export interface CreateEmployeeBaseInput {
  email: string;
  password: string;
  confirmationPassword: string;
  name: string;
  surname: string;
  fatherName?: string;
  phoneNumber: string;
  isResident: boolean;
  identifCode: string;
  numPass: string;
  codeWord: string;
  address: string;
  role: number;
}

export interface UpdateEmployeeBaseInput {
  id: string;
  email?: string;
  name?: string;
  surname?: string;
  fatherName?: string;
  phoneNumber?: string;
  isResident?: boolean;
  identifCode?: string;
  numPass?: string;
  codeWord?: string;
  address?: string;
  role?: number;
}

export interface ChangeEmployeeRoleBaseInput {
  id: string;
  role: number;
}

export interface EmployeeActionBaseInput {
  id: string;
}

export interface ResetEmployeePasswordBaseInput {
  id: string;
  newPassword: string;
}
