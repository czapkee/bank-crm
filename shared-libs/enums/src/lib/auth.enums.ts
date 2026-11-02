export enum Roles {
  EMPLOYEE = 'EMPLOYEE',
  HEAD_OF_DEPARTMENT = 'HEAD_OF_DEPARTMENT',
  OPERATIONIST = 'OPERATIONIST',
  SUPERADMIN = 'SUPERADMIN',
}

export const ROLE_TO_GRPC: Record<Roles, number> = {
  [Roles.EMPLOYEE]: 0,
  [Roles.HEAD_OF_DEPARTMENT]: 1,
  [Roles.OPERATIONIST]: 2,
  [Roles.SUPERADMIN]: 3,
};

export const GRPC_TO_ROLE: Record<number, Roles> = {
  0: Roles.EMPLOYEE,
  1: Roles.HEAD_OF_DEPARTMENT,
  2: Roles.OPERATIONIST,
  3: Roles.SUPERADMIN,
};
