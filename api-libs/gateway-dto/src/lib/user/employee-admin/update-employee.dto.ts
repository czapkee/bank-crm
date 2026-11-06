import { Email } from '../../decorators/shared/email.decorator.js'
import { Name } from '../../decorators/shared/name.decorator.js'
import { Phone } from '../../decorators/shared/phone.decorator.js'
import { Address } from '../../decorators/user/address.decorator.js'
import { CodeWord } from '../../decorators/user/code-word.decorator.js'
import { FatherName } from '../../decorators/user/father-name.decorator.js'
import { IdentifCode } from '../../decorators/user/identif-code.decorator.js'
import { IsResident } from '../../decorators/user/is-resident.decorator.js'
import { NumPass } from '../../decorators/user/num-pass.decorator.js'
import { Role } from '../../decorators/user/role.decorator.js'
import { Surname } from '../../decorators/user/surname.decorator.js'

import type { Roles } from '@org/enums'
import type { UpdateEmployeeInput } from '@org/shared-types'

export class UpdateEmployeeDto implements UpdateEmployeeInput {
  @Email(false)
  email?: string

  @Name(false)
  name?: string

  @Surname(false)
  surname?: string

  @FatherName()
  fatherName?: string

  @Phone(false)
  phoneNumber?: string

  @IsResident(false)
  isResident?: boolean

  @IdentifCode(false)
  identifCode?: string

  @NumPass(false)
  numPass?: string

  @CodeWord(false)
  codeWord?: string

  @Address(false)
  address?: string

  @Role(false)
  role?: Roles
}
