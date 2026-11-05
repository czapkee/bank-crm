import type {
  AuthBaseOutput,
  ClientPaginationBaseOutput,
  ClientUserBaseEntity,
  ClientUserBasePayload,
  PaginatedClientsBaseOutput,
} from '@org/base-types';

export type ClientAuthOutput = AuthBaseOutput
export type ClientUserPayload = ClientUserBasePayload;
export type ClientUserEntity = ClientUserBaseEntity;
export type ClientOutput = ClientUserBaseEntity;
export type ClientPaginationOutput = ClientPaginationBaseOutput;
export type PaginatedClientsOutput = PaginatedClientsBaseOutput;
