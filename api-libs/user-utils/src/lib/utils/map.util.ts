import { Injectable } from '@nestjs/common'
import { Roles as AppRoles, ROLE_TO_GRPC } from '@org/enums'

import type { ClientAuthWithUser, EmployeeAuthWithUser } from './database.util.js'
import type {
  ClientUserEntity,
  ClientUserPayload,
  EmployeeUserEntity,
  EmployeeUserPayload,
} from '@org/grpc-types'
import type { Roles as DbRoles } from '@org/user-database'

@Injectable()
export class UserMapUtil {
  mapClient(auth: ClientAuthWithUser): ClientUserEntity {
    return {
      id: auth.user.id,
      email: auth.email,
      createdAt: auth.user.createdAt.toISOString(),
      updatedAt: auth.user.updatedAt.toISOString(),
      name: auth.user.name ?? '',
      surname: auth.user.surname ?? '',
      fatherName: auth.user.fatherName ?? null,
      phoneNumber: auth.user.phoneNumber ?? '',
      isResident: auth.user.isResident,
      identifCode: auth.user.identtifCode ?? '',
      numPass: auth.user.numPass ?? '',
      codeWord: auth.user.codeWord ?? '',
      address: auth.user.address ?? '',
      isActive: auth.user.isActive,
    }
  }

  mapEmployee(auth: EmployeeAuthWithUser): EmployeeUserEntity {
    return {
      id: auth.user.id,
      email: auth.email,
      createdAt: auth.user.createdAt.toISOString(),
      updatedAt: auth.user.updatedAt.toISOString(),
      role: this.mapRole(auth.role),
      name: auth.user.name ?? '',
      surname: auth.user.surname ?? '',
      fatherName: auth.user.fatherName ?? null,
      phoneNumber: auth.user.phoneNumber ?? '',
      isResident: auth.user.isResident,
      identifCode: auth.user.identtifCode ?? '',
      numPass: auth.user.numPass ?? '',
      codeWord: auth.user.codeWord ?? '',
      address: auth.user.address ?? '',
      isActive: auth.user.isActive,
    }
  }

  mapClientPayload(auth: ClientAuthWithUser): ClientUserPayload {
    return { id: auth.user.id }
  }

  mapEmployeePayload(auth: EmployeeAuthWithUser): EmployeeUserPayload {
    return { id: auth.user.id, role: this.mapRole(auth.role) }
  }

  mapRole(role: DbRoles): number {
    return ROLE_TO_GRPC[role as unknown as AppRoles]
  }
}
