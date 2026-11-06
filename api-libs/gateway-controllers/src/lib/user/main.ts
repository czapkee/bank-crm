import { ClientAdminController } from './client-admin.controller.js'
import { ClientController } from './client.controller.js'
import { EmployeeAdminController } from './employee-admin.controller.js'
import { EmployeeController } from './employee.controller.js'

export const USER_CONTROLLERS = [
  ClientController,
  EmployeeController,
  ClientAdminController,
  EmployeeAdminController,
]
