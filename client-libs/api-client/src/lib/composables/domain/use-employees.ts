import { ref } from 'vue'

import { request } from '../../request.js'
import { useApi } from '../use-api.js'

import type { Pagination, ListQuery } from '../../types/api.type.js'
import type { Roles } from '@org/enums'
import type { EmployeeUserEntity, PaginatedEmployeesOutput } from '@org/shared-types'
import type { Ref } from 'vue'

export interface EmployeePayload {
  email?: string
  name?: string
  surname?: string
  fatherName?: string
  phoneNumber?: string
  isResident?: boolean
  identifCode?: string
  numPass?: string
  codeWord?: string
  address?: string
  role?: Roles
}

export interface UseEmployeesReturn {
  employees: Ref<EmployeeUserEntity[]>
  pagination: Ref<Pagination | null>
  loading: Ref<boolean>
  error: Ref<string | null>
  fetchEmployees: (query?: ListQuery) => Promise<PaginatedEmployeesOutput | null>
  getEmployee: (id: string) => Promise<EmployeeUserEntity | null>
  createEmployee: (payload: EmployeePayload) => Promise<EmployeeUserEntity | null>
  updateEmployee: (id: string, payload: EmployeePayload) => Promise<EmployeeUserEntity | null>
  changeEmployeeRole: (id: string, role: Roles) => Promise<EmployeeUserEntity | null>
  blockEmployee: (id: string) => Promise<EmployeeUserEntity | null>
  unblockEmployee: (id: string) => Promise<EmployeeUserEntity | null>
  resetEmployeePassword: (id: string, newPassword: string) => Promise<boolean>
  deleteEmployee: (id: string) => Promise<boolean>
}

export function useEmployees(): UseEmployeesReturn {
  const employees = ref<EmployeeUserEntity[]>([])
  const pagination = ref<Pagination | null>(null)
  const { loading, error, run } = useApi()

  async function fetchEmployees(query: ListQuery = {}): Promise<PaginatedEmployeesOutput | null> {
    const result = await run(() =>
      request<PaginatedEmployeesOutput>('/user/employeeadmin/employees', {
        method: 'QUERY',
        body: { page: 1, limit: 10, ...query },
      }),
    )

    if (result) {
      employees.value = result.employees
      pagination.value = result.pagination
    }

    return result
  }

  async function getEmployee(id: string): Promise<EmployeeUserEntity | null> {
    return run(() => request<EmployeeUserEntity>(`/user/employeeadmin/employees/${id}`))
  }

  async function createEmployee(payload: EmployeePayload): Promise<EmployeeUserEntity | null> {
    return run(() =>
      request<EmployeeUserEntity>('/user/employeeadmin/employees', { method: 'POST', body: payload }),
    )
  }

  async function updateEmployee(id: string, payload: EmployeePayload): Promise<EmployeeUserEntity | null> {
    return run(() =>
      request<EmployeeUserEntity>(`/user/employeeadmin/employees/${id}`, {
        method: 'PUT',
        body: payload,
      }),
    )
  }

  async function changeEmployeeRole(id: string, role: Roles): Promise<EmployeeUserEntity | null> {
    return run(() =>
      request<EmployeeUserEntity>(`/user/employeeadmin/employees/${id}/role`, {
        method: 'PATCH',
        body: { role },
      }),
    )
  }

  async function blockEmployee(id: string): Promise<EmployeeUserEntity | null> {
    return run(() =>
      request<EmployeeUserEntity>(`/user/employeeadmin/employees/${id}/block`, { method: 'PATCH' }),
    )
  }

  async function unblockEmployee(id: string): Promise<EmployeeUserEntity | null> {
    return run(() =>
      request<EmployeeUserEntity>(`/user/employeeadmin/employees/${id}/unblock`, { method: 'PATCH' }),
    )
  }

  async function resetEmployeePassword(id: string, newPassword: string): Promise<boolean> {
    return (await run(() =>
      request<null>(`/user/employeeadmin/employees/${id}/reset-password`, {
        method: 'PATCH',
        body: { newPassword },
      }),
    )) !== null
  }

  async function deleteEmployee(id: string): Promise<boolean> {
    return (await run(() =>
      request<null>(`/user/employeeadmin/employees/${id}`, { method: 'DELETE' }),
    )) !== null
  }

  return {
    employees,
    pagination,
    loading,
    error,
    fetchEmployees,
    getEmployee,
    createEmployee,
    updateEmployee,
    changeEmployeeRole,
    blockEmployee,
    unblockEmployee,
    resetEmployeePassword,
    deleteEmployee,
  }
}
