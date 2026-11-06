import { Injectable } from '@nestjs/common'
import { UserDatabaseUtil, UserMapUtil, UserPasswordUtil, UserValidateUtil } from '@org/user-utils'

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
  constructor(
    private readonly db: UserDatabaseUtil,
    private readonly validate: UserValidateUtil,
    private readonly password: UserPasswordUtil,
    private readonly map: UserMapUtil,
  ) {}

  async GetClients(data: GetClientsInput): Promise<PaginatedClientsOutput> {
    await this.validate.validateEmployeeAccess(data.validation.accessToken)
    const result = await this.db.getClients(data.pagination)

    return {
      pagination: result.pagination,
      clients: result.clients.map((client) => this.map.mapClient(client)),
    }
  }

  async GetClient(data: GetClientInput): Promise<ClientOutput> {
    await this.validate.validateEmployeeAccess(data.validation.accessToken)
    const auth = await this.validate.validateClientExists(data.id)

    return this.map.mapClient(auth)
  }

  async CreateClient(data: CreateClientInput): Promise<ClientOutput> {
    await this.validate.validateEmployeeAccess(data.validation.accessToken)
    this.validate.validatePasswordsMatch(data.password, data.confirmationPassword)
    await this.validate.validateClientEmailAvailable(data.email)
    await this.validate.validateProfileUnique(data)
    const passwordHash = await this.password.hashPassword(data.password)
    const auth = await this.db.createClientWithProfile(data, passwordHash)

    return this.map.mapClient(auth)
  }

  async UpdateClient(data: UpdateClientInput): Promise<ClientOutput> {
    await this.validate.validateEmployeeAccess(data.validation.accessToken)
    const existing = await this.validate.validateClientExists(data.id)
    await this.validate.validateClientEmailAvailable(data.email ?? existing.email, existing.email)
    await this.validate.validateProfileUnique(data, data.id)
    const auth = await this.db.updateClientProfileByAdmin(data.id, data)

    return this.map.mapClient(auth)
  }

  async BlockClient(data: ClientActionInput): Promise<ClientOutput> {
    await this.validate.validateEmployeeAccess(data.validation.accessToken)
    const auth = await this.validate.validateClientExists(data.id)
    this.validate.validateClientNotBlocked(auth.user.isActive)

    return this.map.mapClient(await this.db.setClientActive(data.id, false))
  }

  async UnblockClient(data: ClientActionInput): Promise<ClientOutput> {
    await this.validate.validateEmployeeAccess(data.validation.accessToken)
    const auth = await this.validate.validateClientExists(data.id)
    this.validate.validateClientNotActive(auth.user.isActive)

    return this.map.mapClient(await this.db.setClientActive(data.id, true))
  }

  async ResetClientPassword(data: ResetClientPasswordInput): Promise<Empty> {
    await this.validate.validateEmployeeAccess(data.validation.accessToken)
    await this.validate.validateClientExists(data.id)
    this.validate.validatePasswordFormat(data.newPassword)
    const passwordHash = await this.password.hashPassword(data.newPassword)
    await this.db.updateClientPassword(data.id, passwordHash)

    return {}
  }

  async DeleteClient(data: ClientActionInput): Promise<Empty> {
    await this.validate.validateEmployeeAccess(data.validation.accessToken)
    await this.validate.validateClientExists(data.id)
    await this.db.deleteClient(data.id)

    return {}
  }
}
