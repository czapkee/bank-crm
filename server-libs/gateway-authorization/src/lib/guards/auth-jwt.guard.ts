import { ExecutionContext, Inject, Injectable, OnModuleInit, UnauthorizedException } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { AUTH_MESSAGES } from '@org/validation-messages'
import { firstValueFrom } from 'rxjs'

import type { ClientGrpc } from '@nestjs/microservices'
import type {
  ClientServiceObservableContract,
  EmployeeServiceObservableContract,
  ValidateInput,
} from '@org/grpc-types'

@Injectable()
export class AuthJWTGuard extends AuthGuard('jwt') implements OnModuleInit {
  private clientService!: ClientServiceObservableContract
  private employeeService!: EmployeeServiceObservableContract

  constructor(@Inject('USER_CLIENT') private readonly client: ClientGrpc) {
    super()
  }

  onModuleInit(): void {
    this.clientService = this.client.getService<ClientServiceObservableContract>('ClientService')
    this.employeeService = this.client.getService<EmployeeServiceObservableContract>('EmployeeService')
  }

  override async canActivate(context: ExecutionContext): Promise<boolean> {
    await super.canActivate(context)

    const request = context.switchToHttp().getRequest()
    const authHeader = request.headers.authorization

    if (typeof authHeader !== 'string' || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException(AUTH_MESSAGES.TOKEN_INVALID)
    }

    const validation: ValidateInput = {
      accessToken: authHeader.replace('Bearer ', ''),
    }

    try {
      request.user = await firstValueFrom(this.clientService.Validate(validation))
    } catch {
      request.user = await firstValueFrom(this.employeeService.Validate(validation))
    }

    return true
  }
}
