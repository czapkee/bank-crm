import { PaginationBaseOutput } from '../../shared/pagination.type.js';

export interface EmployeeUserBasePayload {
  id: string;
  role: number;
}

export interface EmployeeUserBaseEntity {
  id: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  role: number;
  name: string;
  surname: string;
  fatherName: string | null;
  phoneNumber: string;
  isResident: boolean;
  identifCode: string;
  numPass: string;
  codeWord: string;
  address: string;
  isActive: boolean;
}

export interface EmployeePaginationBaseOutput extends PaginationBaseOutput {
  role?: number;
  isActive?: boolean;
}

export interface PaginatedEmployeesBaseOutput {
  pagination: EmployeePaginationBaseOutput;
  employees: EmployeeUserBaseEntity[];
}
