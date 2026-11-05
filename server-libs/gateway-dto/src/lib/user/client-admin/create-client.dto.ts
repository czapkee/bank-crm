import { Email } from '../../decorators/shared/email.decorator.js'
import { Name } from '../../decorators/shared/name.decorator.js'
import { Password } from '../../decorators/shared/password.decorator.js'
import { Phone } from '../../decorators/shared/phone.decorator.js'
import { Unvalidated } from '../../decorators/shared/unvalidated.decorator.js'
import { Address } from '../../decorators/user/address.decorator.js'
import { CodeWord } from '../../decorators/user/code-word.decorator.js'
import { FatherName } from '../../decorators/user/father-name.decorator.js'
import { IdentifCode } from '../../decorators/user/identif-code.decorator.js'
import { IsResident } from '../../decorators/user/is-resident.decorator.js'
import { NumPass } from '../../decorators/user/num-pass.decorator.js'
import { Surname } from '../../decorators/user/surname.decorator.js'

import type { CreateClientInput } from '@org/shared-types'

export class CreateClientDto implements CreateClientInput {
  @Email()
  email: string

  @Password()
  password: string

  @Unvalidated({ description: 'Подтверждение пароля', required: true })
  confirmationPassword: string

  @Name()
  name: string

  @Surname()
  surname: string

  @FatherName()
  fatherName?: string

  @Phone()
  phoneNumber: string

  @IsResident()
  isResident: boolean

  @IdentifCode()
  identifCode: string

  @NumPass()
  numPass: string

  @CodeWord()
  codeWord: string

  @Address()
  address: string
}
