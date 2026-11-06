import { Body, Inject, OnModuleInit, Req, Res } from '@nestjs/common'
import { CookieService } from '@org/gateway-authorization'
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
  ClientRegisterDto,
  ClientUpdateProfileDto,
} from '@org/gateway-dto'
import { firstValueFrom } from 'rxjs'

import type { ClientGrpc } from '@nestjs/microservices'
import type { ClientServiceObservableContract, ValidateInput } from '@org/grpc-types'
import type { ClientAuthResponse, ClientUserEntity } from '@org/shared-types'
import type { Request, Response } from 'express'

@HTTPController({
  microserviceName: 'User',
  serviceName: 'Client',
})
export class ClientController implements OnModuleInit {
  private clientContract!: ClientServiceObservableContract

  constructor(
    @Inject('USER_CLIENT') private readonly client: ClientGrpc,
    private readonly cookie: CookieService,
  ) {}

  onModuleInit(): void {
    this.clientContract = this.client.getService<ClientServiceObservableContract>('ClientService')
  }

  @POSTMethod({
    path: 'register',
    summary: 'Регистрация клиента',
    operationDesc: 'Создаёт учётную запись клиента банка и возвращает токен доступа',
  })
  async register(@Body() dto: ClientRegisterDto, @Res({ passthrough: true }) res: Response): Promise<ClientAuthResponse> {
    const response = await firstValueFrom(this.clientContract.Register(dto))
    this.cookie.setRefreshToken(res, response.refreshToken)

    return { accessToken: response.accessToken }
  }

  @POSTMethod({
    path: 'login',
    summary: 'Авторизация клиента',
    operationDesc: 'Выполняет вход клиента банка и возвращает токен доступа',
  })
  async login(@Body() dto: ClientLoginDto, @Res({ passthrough: true }) res: Response): Promise<ClientAuthResponse> {
    const response = await firstValueFrom(this.clientContract.Login(dto))
    this.cookie.setRefreshToken(res, response.refreshToken)

    return { accessToken: response.accessToken }
  }

  @POSTMethod({
    path: 'refresh',
    summary: 'Обновление токенов клиента',
    operationDesc: 'Обновляет токен доступа клиента по токену обновления из cookie',
  })
  async refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response): Promise<ClientAuthResponse> {
    const refreshToken = this.cookie.getRefreshToken(req)

    try {
      const response = await firstValueFrom(this.clientContract.Refresh({ refreshToken }))
      this.cookie.setRefreshToken(res, response.refreshToken)

      return { accessToken: response.accessToken }
    } catch (error) {
      this.cookie.removeRefreshToken(res)
      throw error
    }
  }

  @POSTMethod({
    path: 'logout',
    summary: 'Выход клиента',
    operationDesc: 'Удаляет токен обновления клиента из cookie',
  })
  async logout(@Res({ passthrough: true }) res: Response): Promise<void> {
    this.cookie.removeRefreshToken(res)
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
