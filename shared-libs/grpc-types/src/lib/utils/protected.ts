import type {
  ClientValidateInput,
  EmployeeValidateInput,
} from '../shared/validation.type.js';

export type Protected<T> = T & { validation: ClientValidateInput };

export type AdminProtected<T> = T & { validation: EmployeeValidateInput };
