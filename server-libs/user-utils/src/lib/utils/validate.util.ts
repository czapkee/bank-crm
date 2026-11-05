import { Injectable } from '@nestjs/common'

@Injectable()
export class UserValidateUtil {
  validateClientExists(_id: string): void {
    throw new Error('Method not implemented')
  }

  validateEmployeeExists(_id: string): void {
    throw new Error('Method not implemented')
  }
}
