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
  EmployeeChangePasswordDto,
  EmployeeDeleteAccountDto,
  EmployeeLoginDto,
  EmployeeRefreshDto,
  EmployeeRegisterDto,
  EmployeeUpdateProfileDto,
} from '@org/gateway-dto'
import { UserGatewayMapService } from '@org/gateway-map'
import { firstValueFrom } from 'rxjs'

import type { ClientGrpc } from '@nestjs/microservices'
import type { EmployeeServiceObservableContract, ValidateInput } from '@org/grpc-types'
import type { EmployeeAuthOutput, EmployeeUserEntity } from '@org/shared-types'

@HTTPController({
  microserviceName: 'User',
  serviceName: 'Employee',
})
export class EmployeeController implements OnModuleInit {
  private employeeContract!: EmployeeServiceObservableContract

  constructor(
    @Inject('USER_CLIENT') private readonly client: ClientGrpc,
    private readonly map: UserGatewayMapService,
  ) {}

  onModuleInit(): void {
    this.employeeContract = this.client.getService<EmployeeServiceObservableContract>('EmployeeService')
  }

  @POSTMethod({
    path: 'register',
    summary: 'Регистрация сотрудника',
    operationDesc: 'Создаёт учётную запись сотрудника банка и возвращает пару токенов',
  })
  async register(@Body() dto: EmployeeRegisterDto): Promise<EmployeeAuthOutput> {
    return await firstValueFrom(this.employeeContract.Register(dto))
  }

  @POSTMethod({
    path: 'login',
    summary: 'Авторизация сотрудника',
    operationDesc: 'Выполняет вход сотрудника банка и возвращает пару токенов',
  })
  async login(@Body() dto: EmployeeLoginDto): Promise<EmployeeAuthOutput> {
    return await firstValueFrom(this.employeeContract.Login(dto))
  }

  @POSTMethod({
    path: 'refresh',
    summary: 'Обновление токенов сотрудника',
    operationDesc: 'Обновляет пару токенов сотрудника по токену обновления',
  })
  async refresh(@Body() dto: EmployeeRefreshDto): Promise<EmployeeAuthOutput> {
    return await firstValueFrom(this.employeeContract.Refresh(dto))
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
