import type {
  ClientActionBaseInput,
  ClientPaginationBaseInput,
  CreateClientBaseInput,
  GetClientBaseInput,
  GetClientsBaseInput,
  ResetClientPasswordBaseInput,
  UpdateClientBaseInput,
} from '@org/base-types';

export type ClientPaginationInput = ClientPaginationBaseInput;
export type GetClientsInput = GetClientsBaseInput;
export type GetClientInput = Omit<GetClientBaseInput, 'id'>;
export type CreateClientInput = CreateClientBaseInput;
export type UpdateClientInput = Omit<UpdateClientBaseInput, 'id'>;
export type ClientActionInput = Omit<ClientActionBaseInput, 'id'>;
export type ResetClientPasswordInput = Omit<ResetClientPasswordBaseInput, 'id'>;
