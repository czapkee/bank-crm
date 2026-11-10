export enum USER_LOG_ACTIONS {
  CLIENT_REGISTER = 'user.client.register',
  CLIENT_LOGIN = 'user.client.login',
  CLIENT_UPDATE_PROFILE = 'user.client.update-profile',
  CLIENT_CHANGE_PASSWORD = 'user.client.change-password',
  CLIENT_DELETE_ACCOUNT = 'user.client.delete-account',
  EMPLOYEE_REGISTER = 'user.employee.register',
  EMPLOYEE_LOGIN = 'user.employee.login',
  EMPLOYEE_UPDATE_PROFILE = 'user.employee.update-profile',
  EMPLOYEE_CHANGE_PASSWORD = 'user.employee.change-password',
  EMPLOYEE_DELETE_ACCOUNT = 'user.employee.delete-account',
  CLIENT_ADMIN_CREATE = 'user.client-admin.create',
  CLIENT_ADMIN_UPDATE = 'user.client-admin.update',
  CLIENT_ADMIN_BLOCK = 'user.client-admin.block',
  CLIENT_ADMIN_UNBLOCK = 'user.client-admin.unblock',
  CLIENT_ADMIN_RESET_PASSWORD = 'user.client-admin.reset-password',
  CLIENT_ADMIN_DELETE = 'user.client-admin.delete',
  EMPLOYEE_ADMIN_CREATE = 'user.employee-admin.create',
  EMPLOYEE_ADMIN_UPDATE = 'user.employee-admin.update',
  EMPLOYEE_ADMIN_CHANGE_ROLE = 'user.employee-admin.change-role',
  EMPLOYEE_ADMIN_BLOCK = 'user.employee-admin.block',
  EMPLOYEE_ADMIN_UNBLOCK = 'user.employee-admin.unblock',
  EMPLOYEE_ADMIN_RESET_PASSWORD = 'user.employee-admin.reset-password',
  EMPLOYEE_ADMIN_DELETE = 'user.employee-admin.delete',
}

export enum CARD_LOG_ACTIONS {
  ADMIN_CREATE = 'card.card-admin.create',
  ADMIN_UPDATE = 'card.card-admin.update',
  ADMIN_CHANGE_STATUS = 'card.card-admin.change-status',
  ADMIN_BLOCK = 'card.card-admin.block',
  ADMIN_UNBLOCK = 'card.card-admin.unblock',
  ADMIN_DELETE = 'card.card-admin.delete',
  PAYMENT_ADMIN_CREATE = 'card.payment-admin.create',
  PAYMENT_ADMIN_CHANGE_STATUS = 'card.payment-admin.change-status',
  PAYMENT_ADMIN_DELETE = 'card.payment-admin.delete',
  PAYMENT_WRITE_OFF = 'card.payment.write-off',
}

export enum REPORT_LOG_ACTIONS {
  CREATE = 'report.report.create',
  UPDATE = 'report.report.update',
  DELETE = 'report.report.delete',
  ADMIN_UPDATE = 'report.report-admin.update',
  ADMIN_ASSIGN = 'report.report-admin.assign',
  ADMIN_CHANGE_STATUS = 'report.report-admin.change-status',
  ADMIN_RESOLVE = 'report.report-admin.resolve',
  ADMIN_DELETE = 'report.report-admin.delete',
}

export enum THEME_LOG_ACTIONS {
  ADMIN_CREATE = 'report.theme-admin.create',
  ADMIN_UPDATE = 'report.theme-admin.update',
  ADMIN_DELETE = 'report.theme-admin.delete',
}
