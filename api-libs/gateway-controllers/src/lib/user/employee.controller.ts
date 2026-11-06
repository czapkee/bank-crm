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
  EmployeeChangePasswordDto,
  EmployeeDeleteAccountDto,
  EmployeeLoginDto,
  EmployeeRegisterDto,
  EmployeeUpdateProfileDto,
} from '@org/gateway-dto'
import { UserGatewayMapService } from '@org/gateway-map'
import { firstValueFrom } from 'rxjs'

import type { ClientGrpc } from '@nestjs/microservices'
import type { EmployeeServiceObservableContract, ValidateInput } from '@org/grpc-types'
import type { EmployeeAuthResponse, EmployeeUserEntity } from '@org/shared-types'
import type { Request, Response } from 'express'

@HTTPController({
  microserviceName: 'User',
  serviceName: 'Employee',
})
export class EmployeeController implements OnModuleInit {
  private employeeContract!: EmployeeServiceObservableContract

  constructor(
    @Inject('USER_CLIENT') private readonly client: ClientGrpc,
    private readonly cookie: CookieService,
    private readonly map: UserGatewayMapService,
  ) {}

  onModuleInit(): void {
    this.employeeContract = this.client.getService<EmployeeServiceObservableContract>('EmployeeService')
  }

  @POSTMethod({
    path: 'register',
    summary: 'Регистрация сотрудника',
    operationDesc: 'Устанавливает пароль для ранее созданной учётной записи сотрудника и возвращает токен доступа',
  })
  async register(
    @Body() dto: EmployeeRegisterDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<EmployeeAuthResponse> {
    const response = await firstValueFrom(this.employeeContract.Register(dto))
    this.cookie.setRefreshToken(res, response.refreshToken)

    return { accessToken: response.accessToken }
  }

  @POSTMethod({
    path: 'login',
    summary: 'Авторизация сотрудника',
    operationDesc: 'Выполняет вход сотрудника банка и возвращает токен доступа',
  })
  async login(@Body() dto: EmployeeLoginDto, @Res({ passthrough: true }) res: Response): Promise<EmployeeAuthResponse> {
    const response = await firstValueFrom(this.employeeContract.Login(dto))
    this.cookie.setRefreshToken(res, response.refreshToken)

    return { accessToken: response.accessToken }
  }

  @POSTMethod({
    path: 'refresh',
    summary: 'Обновление токенов сотрудника',
    operationDesc: 'Обновляет токен доступа сотрудника по токену обновления из cookie',
  })
  async refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response): Promise<EmployeeAuthResponse> {
    const refreshToken = this.cookie.getRefreshToken(req)

    try {
      const response = await firstValueFrom(this.employeeContract.Refresh({ refreshToken }))
      this.cookie.setRefreshToken(res, response.refreshToken)

      return { accessToken: response.accessToken }
    } catch (error) {
      this.cookie.removeRefreshToken(res)
      throw error
    }
  }

  @POSTMethod({
    path: 'logout',
    summary: 'Выход сотрудника',
    operationDesc: 'Удаляет токен обновления сотрудника из cookie',
  })
  async logout(@Res({ passthrough: true }) res: Response): Promise<void> {
    this.cookie.removeRefreshToken(res)
  }

  @GETProtectedMethod({
    path: 'me',
    summary: 'Получение профиля сотрудника',
    operationDesc: 'Возвращает профиль текущего авторизованного сотрудника',
  })
  async getMe(@ValidateInputParam() validation: ValidateInput): Promise<EmployeeUserEntity> {
    const response = await firstValueFrom(this.employeeContract.GetMe(validation))
    return this.map.mapEmployee(response)
  }

  @PATCHProtectedMethod({
    path: 'me',
    summary: 'Обновление профиля сотрудника',
    operationDesc: 'Обновляет данные профиля текущего авторизованного сотрудника',
  })
  async updateProfile(
    @ValidateInputParam() validation: ValidateInput,
    @Body() dto: EmployeeUpdateProfileDto,
  ): Promise<EmployeeUserEntity> {
    const response = await firstValueFrom(this.employeeContract.UpdateProfile({ validation, ...dto }))
    return this.map.mapEmployee(response)
  }

  @PATCHProtectedMethod({
    path: 'change-password',
    summary: 'Смена пароля сотрудника',
    operationDesc: 'Меняет пароль текущего авторизованного сотрудника после проверки старого пароля',
  })
  async changePassword(
    @ValidateInputParam() validation: ValidateInput,
    @Body() dto: EmployeeChangePasswordDto,
  ): Promise<void> {
    await firstValueFrom(this.employeeContract.ChangePassword({ validation, ...dto }))
  }

  @DELETEProtectedMethod({
    path: 'me',
    summary: 'Удаление учётной записи сотрудника',
    operationDesc: 'Удаляет учётную запись текущего авторизованного сотрудника после подтверждения паролем',
  })
  async deleteAccount(
    @ValidateInputParam() validation: ValidateInput,
    @Body() dto: EmployeeDeleteAccountDto,
  ): Promise<void> {
    await firstValueFrom(this.employeeContract.DeleteAccount({ validation, ...dto }))
  }
}
