import { USER_MESSAGES } from '@org/validation-messages'

import { BooleanField } from '../shared/boolean.decorator.js'

export function IsActive(required = false): PropertyDecorator {
  return BooleanField({
    description: 'Признак активности',
    required,
    message: required ? USER_MESSAGES.IS_ACTIVE_VALIDATION.NOT_EMPTY : USER_MESSAGES.IS_ACTIVE_VALIDATION.TYPE,
  })
}
