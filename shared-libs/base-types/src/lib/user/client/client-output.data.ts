import { PaginationBaseOutput } from '../../shared/pagination.type.js';

export interface ClientUserBasePayload {
  id: string;
}

export interface ClientUserBaseEntity {
  id: string;
  email: string;
  createdAt: string;
  updatedAt: string;
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

export interface ClientPaginationBaseOutput extends PaginationBaseOutput {
  isActive?: boolean;
  isResident?: boolean;
}

export interface PaginatedClientsBaseOutput {
  pagination: ClientPaginationBaseOutput;
  clients: ClientUserBaseEntity[];
}
