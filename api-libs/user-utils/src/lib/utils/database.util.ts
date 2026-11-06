import { Injectable } from '@nestjs/common'
import { GRPC_TO_ROLE } from '@org/enums'
import { PaginationUtil } from '@org/shared-utils'
import { UserDatabaseService } from '@org/user-database'
import { AUTH_CONFIG } from '@org/validation-config'

import type { Roles as DbRoles, AuthClient, AuthEmployee, User, UserWhereInput } from '@org/user-database'

export interface UserProfileData {
  name?: string
  surname?: string
  fatherName?: string
  phoneNumber?: string
  isResident?: boolean
  identifCode?: string
  numPass?: string
  codeWord?: string
  address?: string
}

export interface CreateClientData extends UserProfileData {
  email: string
}

export interface CreateEmployeeData extends UserProfileData {
  email: string
  role: number
}

export interface UpdateClientData extends UserProfileData {
  email?: string
}

export interface UpdateEmployeeData extends UserProfileData {
  email?: string
  role?: number
}

export interface ClientPaginationData {
  page?: number
  limit?: number
  search?: string
  isActive?: boolean
  isResident?: boolean
}

export interface EmployeePaginationData {
  page?: number
  limit?: number
  search?: string
  role?: number
  isActive?: boolean
}

export interface PaginationData {
  page: number
  limit: number
  total: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
  search?: string
  isActive?: boolean
  isResident?: boolean
  role?: number
}

export type ClientAuthWithUser = AuthClient & { user: User }

export type EmployeeAuthWithUser = AuthEmployee & { user: User }

export interface ClientListResult {
  clients: ClientAuthWithUser[]
  pagination: PaginationData
}

export interface EmployeeListResult {
  employees: EmployeeAuthWithUser[]
  pagination: PaginationData
}

export interface UserProfileFields {
  name?: string
  surname?: string
  fatherName?: string
  phoneNumber?: string
  isResident?: boolean
  identtifCode?: string
  numPass?: string
  codeWord?: string
  address?: string
}

function mapProfileFields(data: UserProfileData): UserProfileFields {
  return {
    name: data.name,
    surname: data.surname,
    fatherName: data.fatherName,
    phoneNumber: data.phoneNumber,
    isResident: data.isResident,
    identtifCode: data.identifCode,
    numPass: data.numPass,
    codeWord: data.codeWord,
    address: data.address,
  }
}

@Injectable()
export class UserDatabaseUtil {
  constructor(
    protected readonly db: UserDatabaseService,
    protected readonly pagination: PaginationUtil,
  ) {}

  findClientAuthByEmail(email: string): Promise<ClientAuthWithUser | null> {
    return this.db.authClient.findUnique({
      where: { email },
      include: { user: true },
    })
  }

  findEmployeeAuthByEmail(email: string): Promise<EmployeeAuthWithUser | null> {
    return this.db.authEmployee.findUnique({
      where: { email },
      include: { user: true },
    })
  }

  findClientAuthByUserId(userId: string): Promise<ClientAuthWithUser | null> {
    return this.db.authClient.findUnique({
      where: { userId },
      include: { user: true },
    })
  }

  findEmployeeAuthByUserId(userId: string): Promise<EmployeeAuthWithUser | null> {
    return this.db.authEmployee.findUnique({
      where: { userId },
      include: { user: true },
    })
  }

  async createClient(email: string, passwordHash: string): Promise<ClientAuthWithUser> {
    return await this.db.$transaction(async (tx) => {
      const user = await tx.user.create({ data: {} })

      return await tx.authClient.create({
        data: { email, passwordHash, userId: user.id },
        include: { user: true },
      })
    })
  }

  async createClientWithProfile(data: CreateClientData, passwordHash: string): Promise<ClientAuthWithUser> {
    const { email, ...profile } = data

    return await this.db.$transaction(async (tx) => {
      const user = await tx.user.create({ data: mapProfileFields(profile) })

      return await tx.authClient.create({
        data: { email, passwordHash, userId: user.id },
        include: { user: true },
      })
    })
  }

  async createEmployeeWithProfile(data: CreateEmployeeData): Promise<EmployeeAuthWithUser> {
    const { email, role, ...profile } = data
    const registrationExpiresAt = new Date(
      Date.now() + AUTH_CONFIG.TOKEN.EMPLOYEE_REGISTRATION_EXPIRE_HOURS * 60 * 60 * 1000,
    )

    return await this.db.$transaction(async (tx) => {
      const user = await tx.user.create({ data: mapProfileFields(profile) })

      return await tx.authEmployee.create({
        data: {
          email,
          role: this.mapRole(role),
          registrationExpiresAt,
          userId: user.id,
        },
        include: { user: true },
      })
    })
  }

  updateClientProfile(userId: string, data: UserProfileData): Promise<ClientAuthWithUser> {
    return this.db.authClient.update({
      where: { userId },
      data: { user: { update: mapProfileFields(data) } },
      include: { user: true },
    })
  }

  async updateClientProfileByAdmin(userId: string, data: UpdateClientData): Promise<ClientAuthWithUser> {
    const { email, ...profile } = data

    return await this.db.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: userId },
        data: mapProfileFields(profile),
      })

      return await tx.authClient.update({
        where: { userId },
        data: email === undefined ? {} : { email },
        include: { user: true },
      })
    })
  }

  updateEmployeeProfile(userId: string, data: UserProfileData): Promise<EmployeeAuthWithUser> {
    return this.db.authEmployee.update({
      where: { userId },
      data: { user: { update: mapProfileFields(data) } },
      include: { user: true },
    })
  }

  async updateEmployeeProfileByAdmin(userId: string, data: UpdateEmployeeData): Promise<EmployeeAuthWithUser> {
    const { email, role, ...profile } = data

    return await this.db.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: userId },
        data: mapProfileFields(profile),
      })

      return await tx.authEmployee.update({
        where: { userId },
        data: {
          ...(email === undefined ? {} : { email }),
          ...(role === undefined ? {} : { role: this.mapRole(role) }),
        },
        include: { user: true },
      })
    })
  }

  updateClientPassword(userId: string, passwordHash: string): Promise<ClientAuthWithUser> {
    return this.db.authClient.update({
      where: { userId },
      data: { passwordHash },
      include: { user: true },
    })
  }

  updateEmployeePassword(userId: string, passwordHash: string): Promise<EmployeeAuthWithUser> {
    return this.db.authEmployee.update({
      where: { userId },
      data: { passwordHash },
      include: { user: true },
    })
  }

  registerEmployee(userId: string, passwordHash: string): Promise<EmployeeAuthWithUser> {
    return this.db.authEmployee.update({
      where: { userId },
      data: { passwordHash, registrationExpiresAt: null },
      include: { user: true },
    })
  }

  changeEmployeeRole(userId: string, role: number): Promise<EmployeeAuthWithUser> {
    return this.db.authEmployee.update({
      where: { userId },
      data: { role: this.mapRole(role) },
      include: { user: true },
    })
  }

  setClientActive(userId: string, isActive: boolean): Promise<ClientAuthWithUser> {
    return this.db.authClient.update({
      where: { userId },
      data: { user: { update: { isActive } } },
      include: { user: true },
    })
  }

  setEmployeeActive(userId: string, isActive: boolean): Promise<EmployeeAuthWithUser> {
    return this.db.authEmployee.update({
      where: { userId },
      data: { user: { update: { isActive } } },
      include: { user: true },
    })
  }

  async deleteClient(userId: string): Promise<void> {
    await this.db.$transaction([
      this.db.authClient.delete({ where: { userId } }),
      this.db.user.delete({ where: { id: userId } }),
    ])
  }

  async deleteEmployee(userId: string): Promise<void> {
    await this.db.$transaction([
      this.db.authEmployee.delete({ where: { userId } }),
      this.db.user.delete({ where: { id: userId } }),
    ])
  }

  findUserByPhoneNumber(phoneNumber: string, excludeUserId?: string): Promise<User | null> {
    return this.db.user.findFirst({
      where: {
        phoneNumber,
        ...(excludeUserId === undefined ? {} : { NOT: { id: excludeUserId } }),
      },
    })
  }

  findUserByIdentifCode(identifCode: string, excludeUserId?: string): Promise<User | null> {
    return this.db.user.findFirst({
      where: {
        identtifCode: identifCode,
        ...(excludeUserId === undefined ? {} : { NOT: { id: excludeUserId } }),
      },
    })
  }

  findUserByNumPass(numPass: string, excludeUserId?: string): Promise<User | null> {
    return this.db.user.findFirst({
      where: {
        numPass,
        ...(excludeUserId === undefined ? {} : { NOT: { id: excludeUserId } }),
      },
    })
  }

  async getClients(data: ClientPaginationData): Promise<ClientListResult> {
    const where: UserWhereInput = {
      client: { isNot: null },
      ...(data.isActive === undefined ? {} : { isActive: data.isActive }),
      ...(data.isResident === undefined ? {} : { isResident: data.isResident }),
    }

    if (data.search) {
      where.OR = [
        { name: { contains: data.search, mode: 'insensitive' } },
        { surname: { contains: data.search, mode: 'insensitive' } },
        { phoneNumber: { contains: data.search, mode: 'insensitive' } },
        { client: { email: { contains: data.search, mode: 'insensitive' } } },
      ]
    }

    const total = await this.db.user.count({ where })
    const params = this.pagination.getPaginationParams(total, data.page, data.limit)
    const users = await this.db.user.findMany({
      where,
      include: { client: true },
      orderBy: { createdAt: 'desc' },
      skip: params.skip,
      take: params.limit,
    })

    return {
      clients: users.flatMap((user) => (user.client ? [{ ...user.client, user }] : [])),
      pagination: {
        page: params.page,
        limit: params.limit,
        total: params.total,
        totalPages: params.totalPages,
        hasNext: params.hasNext,
        hasPrev: params.hasPrev,
        search: data.search,
        isActive: data.isActive,
        isResident: data.isResident,
      },
    }
  }

  async getEmployees(data: EmployeePaginationData): Promise<EmployeeListResult> {
    const role = data.role === undefined ? undefined : this.mapRole(data.role)
    const where: UserWhereInput = {
      employee: role === undefined ? { isNot: null } : { is: { role } },
      ...(data.isActive === undefined ? {} : { isActive: data.isActive }),
    }

    if (data.search) {
      where.OR = [
        { name: { contains: data.search, mode: 'insensitive' } },
        { surname: { contains: data.search, mode: 'insensitive' } },
        { phoneNumber: { contains: data.search, mode: 'insensitive' } },
        { employee: { email: { contains: data.search, mode: 'insensitive' } } },
      ]
    }

    const total = await this.db.user.count({ where })
    const params = this.pagination.getPaginationParams(total, data.page, data.limit)
    const users = await this.db.user.findMany({
      where,
      include: { employee: true },
      orderBy: { createdAt: 'desc' },
      skip: params.skip,
      take: params.limit,
    })

    return {
      employees: users.flatMap((user) => (user.employee ? [{ ...user.employee, user }] : [])),
      pagination: {
        page: params.page,
        limit: params.limit,
        total: params.total,
        totalPages: params.totalPages,
        hasNext: params.hasNext,
        hasPrev: params.hasPrev,
        search: data.search,
        role: data.role,
        isActive: data.isActive,
      },
    }
  }

  private mapRole(role: number): DbRoles {
    return GRPC_TO_ROLE[role] as unknown as DbRoles
  }
}
