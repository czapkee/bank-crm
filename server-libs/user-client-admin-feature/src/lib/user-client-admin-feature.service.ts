import { Injectable } from '@nestjs/common'

import type {
  ClientActionInput,
  ClientAdminServiceContract,
  ClientOutput,
  CreateClientInput,
  Empty,
  GetClientInput,
  GetClientsInput,
  PaginatedClientsOutput,
  ResetClientPasswordInput,
  UpdateClientInput,
} from '@org/grpc-types'

@Injectable()
export class UserClientAdminFeatureService implements ClientAdminServiceContract {
  async GetClients(_data: GetClientsInput): Promise<PaginatedClientsOutput> {
    throw new Error('Method not implemented')
  }

  async GetClient(_data: GetClientInput): Promise<ClientOutput> {
    throw new Error('Method not implemented')
  }

  async CreateClient(_data: CreateClientInput): Promise<ClientOutput> {
    throw new Error('Method not implemented')
  }

  async UpdateClient(_data: UpdateClientInput): Promise<ClientOutput> {
    throw new Error('Method not implemented')
  }

  async BlockClient(_data: ClientActionInput): Promise<ClientOutput> {
    throw new Error('Method not implemented')
  }

  async UnblockClient(_data: ClientActionInput): Promise<ClientOutput> {
    throw new Error('Method not implemented')
  }

  async ResetClientPassword(_data: ResetClientPasswordInput): Promise<Empty> {
    throw new Error('Method not implemented')
  }

  async DeleteClient(_data: ClientActionInput): Promise<Empty> {
    throw new Error('Method not implemented')
  }
}
