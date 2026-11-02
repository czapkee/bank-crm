import { AdminProtected } from '../../utils/protected.js';

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
export type GetClientsInput = AdminProtected<GetClientsBaseInput>;
export type GetClientInput = AdminProtected<GetClientBaseInput>;
export type CreateClientInput = AdminProtected<CreateClientBaseInput>;
export type UpdateClientInput = AdminProtected<UpdateClientBaseInput>;
export type ClientActionInput = AdminProtected<ClientActionBaseInput>;
export type ResetClientPasswordInput =
  AdminProtected<ResetClientPasswordBaseInput>;
