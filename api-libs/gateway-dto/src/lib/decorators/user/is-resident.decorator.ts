import { USER_MESSAGES } from '@org/validation-messages'

import { BooleanField } from '../shared/boolean.decorator.js'

export function IsResident(required = true): PropertyDecorator {
  return BooleanField({
    description: 'Признак резидентства',
    required,
    message: required ? USER_MESSAGES.IS_RESIDENT_VALIDATION.NOT_EMPTY : USER_MESSAGES.IS_RESIDENT_VALIDATION.TYPE,
  })
}
