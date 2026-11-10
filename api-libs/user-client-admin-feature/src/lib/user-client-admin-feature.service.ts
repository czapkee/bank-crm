import { Injectable } from '@nestjs/common'
import { LogPublisher, UserSyncPublisher } from '@org/rmq-config'
import { USER_LOG_ACTIONS } from '@org/rmq-messages'
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
    private readonly log: LogPublisher,
    private readonly sync: UserSyncPublisher,
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
    const actor = await this.validate.validateEmployeeAccess(data.validation.accessToken)
    this.validate.validatePasswordsMatch(data.password, data.confirmationPassword)
    await this.validate.validateClientEmailAvailable(data.email)
    await this.validate.validateProfileUnique(data)
    const passwordHash = await this.password.hashPassword(data.password)
    const auth = await this.db.createClientWithProfile(data, passwordHash)

    this.sync.publish({ action: 'upsert', userId: auth.user.id })

    this.log.publish({
      service: 'user',
      entity: 'Client',
      method: 'CreateClient',
      action: USER_LOG_ACTIONS.CLIENT_ADMIN_CREATE,
      userId: actor.user.id,
      data: { clientId: auth.user.id, email: data.email },
    })

    return this.map.mapClient(auth)
  }

  async UpdateClient(data: UpdateClientInput): Promise<ClientOutput> {
    const actor = await this.validate.validateEmployeeAccess(data.validation.accessToken)
    const existing = await this.validate.validateClientExists(data.id)
    await this.validate.validateClientEmailAvailable(data.email ?? existing.email, existing.email)
    await this.validate.validateProfileUnique(data, data.id)
    const auth = await this.db.updateClientProfileByAdmin(data.id, data)

    this.sync.publish({ action: 'upsert', userId: data.id })

    this.log.publish({
      service: 'user',
      entity: 'Client',
      method: 'UpdateClient',
      action: USER_LOG_ACTIONS.CLIENT_ADMIN_UPDATE,
      userId: actor.user.id,
      data: { clientId: data.id, changes: { ...data } },
    })

    return this.map.mapClient(auth)
  }

  async BlockClient(data: ClientActionInput): Promise<ClientOutput> {
    const actor = await this.validate.validateEmployeeAccess(data.validation.accessToken)
    const auth = await this.validate.validateClientExists(data.id)
    this.validate.validateClientNotBlocked(auth.user.isActive)
    const blocked = await this.db.setClientActive(data.id, false)

    this.log.publish({
      service: 'user',
      entity: 'Client',
      method: 'BlockClient',
      action: USER_LOG_ACTIONS.CLIENT_ADMIN_BLOCK,
      userId: actor.user.id,
      data: { clientId: data.id },
    })

    return this.map.mapClient(blocked)
  }

  async UnblockClient(data: ClientActionInput): Promise<ClientOutput> {
    const actor = await this.validate.validateEmployeeAccess(data.validation.accessToken)
    const auth = await this.validate.validateClientExists(data.id)
    this.validate.validateClientNotActive(auth.user.isActive)
    const unblocked = await this.db.setClientActive(data.id, true)

    this.log.publish({
      service: 'user',
      entity: 'Client',
      method: 'UnblockClient',
      action: USER_LOG_ACTIONS.CLIENT_ADMIN_UNBLOCK,
      userId: actor.user.id,
      data: { clientId: data.id },
    })

    return this.map.mapClient(unblocked)
  }

  async ResetClientPassword(data: ResetClientPasswordInput): Promise<Empty> {
    const actor = await this.validate.validateEmployeeAccess(data.validation.accessToken)
    await this.validate.validateClientExists(data.id)
    this.validate.validatePasswordFormat(data.newPassword)
    const passwordHash = await this.password.hashPassword(data.newPassword)
    await this.db.updateClientPassword(data.id, passwordHash)

    this.log.publish({
      service: 'user',
      entity: 'Client',
      method: 'ResetClientPassword',
      action: USER_LOG_ACTIONS.CLIENT_ADMIN_RESET_PASSWORD,
      userId: actor.user.id,
      data: { clientId: data.id },
    })

    return {}
  }

  async DeleteClient(data: ClientActionInput): Promise<Empty> {
    const actor = await this.validate.validateEmployeeAccess(data.validation.accessToken)
    await this.validate.validateClientExists(data.id)
    await this.db.deleteClient(data.id)

    this.sync.publish({ action: 'delete', userId: data.id })

    this.log.publish({
      service: 'user',
      entity: 'Client',
      method: 'DeleteClient',
      action: USER_LOG_ACTIONS.CLIENT_ADMIN_DELETE,
      userId: actor.user.id,
      data: { clientId: data.id },
    })

    return {}
  }
}
