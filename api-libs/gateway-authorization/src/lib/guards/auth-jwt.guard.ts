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
import type { AuthTokenPayload } from '@org/shared-types'

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

    const payload: AuthTokenPayload = request.user
    const validation: ValidateInput = {
      accessToken: authHeader.slice('Bearer '.length),
    }

    try {
      request.user =
        payload.type === 'client'
          ? await firstValueFrom(this.clientService.Validate(validation))
          : await firstValueFrom(this.employeeService.Validate(validation))
    } catch {
      throw new UnauthorizedException(AUTH_MESSAGES.UNAUTHORIZED)
    }

    return true
  }
}
