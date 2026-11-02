import type {
  ClientChangePasswordInput,
  ClientDeleteAccountInput,
  ClientLoginInput,
  ClientRefreshInput,
  ClientRegisterInput,
  ClientUpdateProfileInput,
} from './client/client-input.data.js';
import type {
  ClientAuthOutput,
  ClientUserEntity,
  ClientUserPayload,
} from './client/client-output.data.js';
import type {
  ClientActionInput,
  CreateClientInput,
  GetClientInput,
  GetClientsInput,
  ResetClientPasswordInput,
  UpdateClientInput,
} from './employee/client-input.data.js';
import type {
  ClientOutput,
  PaginatedClientsOutput,
} from './employee/client-output.data.js';
import type {
  ChangeEmployeeRoleInput,
  CreateEmployeeInput,
  EmployeeActionInput,
  EmployeeChangePasswordInput,
  EmployeeDeleteAccountInput,
  EmployeeLoginInput,
  EmployeeRefreshInput,
  EmployeeRegisterInput,
  EmployeeUpdateProfileInput,
  GetEmployeeInput,
  GetEmployeesInput,
  ResetEmployeePasswordInput,
  UpdateEmployeeInput,
} from './employee/employee-input.data.js';
import type {
  EmployeeAuthOutput,
  EmployeeUserEntity,
  EmployeeUserPayload,
  PaginatedEmployeesOutput,
} from './employee/employee-output.data.js';
import type { Empty } from '../shared/empty.type.js';
import type {
  ClientValidateInput,
  EmployeeValidateInput,
} from '../shared/validation.type.js';
import type { ToObservable } from '../utils/to-observable.js';

export interface ClientServiceContract {
  Register(data: ClientRegisterInput): Promise<ClientAuthOutput>;
  Login(data: ClientLoginInput): Promise<ClientAuthOutput>;
  Refresh(data: ClientRefreshInput): Promise<ClientAuthOutput>;
  Validate(data: ClientValidateInput): Promise<ClientUserPayload>;
  GetMe(data: ClientValidateInput): Promise<ClientUserEntity>;
  UpdateProfile(data: ClientUpdateProfileInput): Promise<ClientUserEntity>;
  ChangePassword(data: ClientChangePasswordInput): Promise<Empty>;
  DeleteAccount(data: ClientDeleteAccountInput): Promise<Empty>;
}

export interface EmployeeServiceContract {
  Register(data: EmployeeRegisterInput): Promise<EmployeeAuthOutput>;
  Login(data: EmployeeLoginInput): Promise<EmployeeAuthOutput>;
  Refresh(data: EmployeeRefreshInput): Promise<EmployeeAuthOutput>;
  Validate(data: EmployeeValidateInput): Promise<EmployeeUserPayload>;
  GetMe(data: EmployeeValidateInput): Promise<EmployeeUserEntity>;
  UpdateProfile(data: EmployeeUpdateProfileInput): Promise<EmployeeUserEntity>;
  ChangePassword(data: EmployeeChangePasswordInput): Promise<Empty>;
  DeleteAccount(data: EmployeeDeleteAccountInput): Promise<Empty>;
}

export interface ClientAdminServiceContract {
  GetClients(data: GetClientsInput): Promise<PaginatedClientsOutput>;
  GetClient(data: GetClientInput): Promise<ClientOutput>;
  CreateClient(data: CreateClientInput): Promise<ClientOutput>;
  UpdateClient(data: UpdateClientInput): Promise<ClientOutput>;
  BlockClient(data: ClientActionInput): Promise<ClientOutput>;
  UnblockClient(data: ClientActionInput): Promise<ClientOutput>;
  ResetClientPassword(data: ResetClientPasswordInput): Promise<Empty>;
  DeleteClient(data: ClientActionInput): Promise<Empty>;
}

export interface EmployeeAdminServiceContract {
  GetEmployees(data: GetEmployeesInput): Promise<PaginatedEmployeesOutput>;
  GetEmployee(data: GetEmployeeInput): Promise<EmployeeUserEntity>;
  CreateEmployee(data: CreateEmployeeInput): Promise<EmployeeUserEntity>;
  UpdateEmployee(data: UpdateEmployeeInput): Promise<EmployeeUserEntity>;
  ChangeEmployeeRole(
    data: ChangeEmployeeRoleInput,
  ): Promise<EmployeeUserEntity>;
  BlockEmployee(data: EmployeeActionInput): Promise<EmployeeUserEntity>;
  UnblockEmployee(data: EmployeeActionInput): Promise<EmployeeUserEntity>;
  ResetEmployeePassword(data: ResetEmployeePasswordInput): Promise<Empty>;
  DeleteEmployee(data: EmployeeActionInput): Promise<Empty>;
}

export type ClientServiceObservableContract =
  ToObservable<ClientServiceContract>;
export type EmployeeServiceObservableContract =
  ToObservable<EmployeeServiceContract>;
export type ClientAdminServiceObservableContract =
  ToObservable<ClientAdminServiceContract>;
export type EmployeeAdminServiceObservableContract =
  ToObservable<EmployeeAdminServiceContract>;
