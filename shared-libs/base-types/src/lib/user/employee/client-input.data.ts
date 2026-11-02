import { PaginationBaseInput } from '../../shared/pagination.type.js';

export interface ClientPaginationBaseInput extends PaginationBaseInput {
  isActive?: boolean;
  isResident?: boolean;
}

export interface GetClientsBaseInput {
  pagination: ClientPaginationBaseInput;
}

export interface GetClientBaseInput {
  id: string;
}

export interface CreateClientBaseInput {
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
}

export interface UpdateClientBaseInput {
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
}

export interface ClientActionBaseInput {
  id: string;
}

export interface ResetClientPasswordBaseInput {
  id: string;
  newPassword: string;
}
