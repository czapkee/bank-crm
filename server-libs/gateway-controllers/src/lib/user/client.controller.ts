import { Body, Inject, OnModuleInit } from '@nestjs/common'
import {
  DELETEProtectedMethod,
  GETProtectedMethod,
  HTTPController,
  PATCHProtectedMethod,
  POSTMethod,
  ValidateInputParam,
} from '@org/gateway-decorators'
import {
  ClientChangePasswordDto,
  ClientDeleteAccountDto,
  ClientLoginDto,
  ClientRefreshDto,
  ClientRegisterDto,
  ClientUpdateProfileDto,
} from '@org/gateway-dto'
import { firstValueFrom } from 'rxjs'

import type { ClientGrpc } from '@nestjs/microservices'
import type { ClientServiceObservableContract, ValidateInput } from '@org/grpc-types'
import type { ClientAuthOutput, ClientUserEntity } from '@org/shared-types'

@HTTPController({
  microserviceName: 'User',
  serviceName: 'Client',
})
export class ClientController implements OnModuleInit {
  private clientContract!: ClientServiceObservableContract

  constructor(@Inject('USER_CLIENT') private readonly client: ClientGrpc) {}

  onModuleInit(): void {
    this.clientContract = this.client.getService<ClientServiceObservableContract>('ClientService')
  }

  @POSTMethod({
    path: 'register',
    summary: 'Регистрация клиента',
    operationDesc: 'Создаёт учётную запись клиента банка и возвращает пару токенов',
  })
  async register(@Body() dto: ClientRegisterDto): Promise<ClientAuthOutput> {
    return await firstValueFrom(this.clientContract.Register(dto))
  }

  @POSTMethod({
    path: 'login',
    summary: 'Авторизация клиента',
    operationDesc: 'Выполняет вход клиента банка и возвращает пару токенов',
  })
  async login(@Body() dto: ClientLoginDto): Promise<ClientAuthOutput> {
    return await firstValueFrom(this.clientContract.Login(dto))
  }

  @POSTMethod({
    path: 'refresh',
    summary: 'Обновление токенов клиента',
    operationDesc: 'Обновляет пару токенов клиента по токену обновления',
  })
  async refresh(@Body() dto: ClientRefreshDto): Promise<ClientAuthOutput> {
    return await firstValueFrom(this.clientContract.Refresh(dto))
  }

  @GETProtectedMethod({
    path: 'me',
    summary: 'Получение профиля клиента',
    operationDesc: 'Возвращает профиль текущего авторизованного клиента',
  })
  async getMe(@ValidateInputParam() validation: ValidateInput): Promise<ClientUserEntity> {
    return await firstValueFrom(this.clientContract.GetMe(validation))
  }

  @PATCHProtectedMethod({
    path: 'me',
    summary: 'Обновление профиля клиента',
    operationDesc: 'Обновляет данные профиля текущего авторизованного клиента',
  })
  async updateProfile(
    @ValidateInputParam() validation: ValidateInput,
    @Body() dto: ClientUpdateProfileDto,
  ): Promise<ClientUserEntity> {
    return await firstValueFrom(this.clientContract.UpdateProfile({ validation, ...dto }))
  }

  @PATCHProtectedMethod({
    path: 'change-password',
    summary: 'Смена пароля клиента',
    operationDesc: 'Меняет пароль текущего авторизованного клиента после проверки старого пароля',
  })
  async changePassword(
    @ValidateInputParam() validation: ValidateInput,
    @Body() dto: ClientChangePasswordDto,
  ): Promise<void> {
    await firstValueFrom(this.clientContract.ChangePassword({ validation, ...dto }))
  }

  @DELETEProtectedMethod({
    path: 'me',
    summary: 'Удаление учётной записи клиента',
    operationDesc: 'Удаляет учётную запись текущего авторизованного клиента после подтверждения паролем',
  })
  async deleteAccount(
    @ValidateInputParam() validation: ValidateInput,
    @Body() dto: ClientDeleteAccountDto,
  ): Promise<void> {
    await firstValueFrom(this.clientContract.DeleteAccount({ validation, ...dto }))
  }
}
