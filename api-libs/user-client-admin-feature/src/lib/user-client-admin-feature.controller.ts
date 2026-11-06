import { Controller } from '@nestjs/common'
import { GrpcMethod } from '@nestjs/microservices'

import { UserClientAdminFeatureService } from './user-client-admin-feature.service.js'

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

@Controller()
export class UserClientAdminFeatureController implements ClientAdminServiceContract {
  constructor(private readonly service: UserClientAdminFeatureService) {}

  @GrpcMethod('ClientAdminService', 'GetClients')
  async GetClients(data: GetClientsInput): Promise<PaginatedClientsOutput> {
    return await this.service.GetClients(data)
  }

  @GrpcMethod('ClientAdminService', 'GetClient')
  async GetClient(data: GetClientInput): Promise<ClientOutput> {
    return await this.service.GetClient(data)
  }

  @GrpcMethod('ClientAdminService', 'CreateClient')
  async CreateClient(data: CreateClientInput): Promise<ClientOutput> {
    return await this.service.CreateClient(data)
  }

  @GrpcMethod('ClientAdminService', 'UpdateClient')
  async UpdateClient(data: UpdateClientInput): Promise<ClientOutput> {
    return await this.service.UpdateClient(data)
  }

  @GrpcMethod('ClientAdminService', 'BlockClient')
  async BlockClient(data: ClientActionInput): Promise<ClientOutput> {
    return await this.service.BlockClient(data)
  }

  @GrpcMethod('ClientAdminService', 'UnblockClient')
  async UnblockClient(data: ClientActionInput): Promise<ClientOutput> {
    return await this.service.UnblockClient(data)
  }

  @GrpcMethod('ClientAdminService', 'ResetClientPassword')
  async ResetClientPassword(data: ResetClientPasswordInput): Promise<Empty> {
    return await this.service.ResetClientPassword(data)
  }

  @GrpcMethod('ClientAdminService', 'DeleteClient')
  async DeleteClient(data: ClientActionInput): Promise<Empty> {
    return await this.service.DeleteClient(data)
  }
}
