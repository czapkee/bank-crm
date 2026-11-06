import { Body, Inject, OnModuleInit, Param } from '@nestjs/common'
import { CARD_ADMIN_ROLES } from '@org/gateway-authorization'
import {
  DELETEProtectedMethod,
  GETProtectedMethod,
  HTTPController,
  PATCHProtectedMethod,
  POSTProtected,
  QUERYProtectedMethod,
  ValidateInputParam,
} from '@org/gateway-decorators'
import {
  ChangePaymentStatusDto,
  CreatePaymentDto,
  PaymentPaginationDto,
} from '@org/gateway-dto'
import { PaymentGatewayMapService } from '@org/gateway-map'
import { firstValueFrom } from 'rxjs'

import type { ClientGrpc } from '@nestjs/microservices'
import type { PaymentAdminServiceObservableContract, ValidateInput } from '@org/grpc-types'
import type { PaginatedPaymentsOutput, PaymentOutput } from '@org/shared-types'

@HTTPController({
  microserviceName: 'Card',
  serviceName: 'PaymentAdmin',
})
export class PaymentAdminController implements OnModuleInit {
  private paymentAdminContract!: PaymentAdminServiceObservableContract

  constructor(
    @Inject('CARD_CLIENT') private readonly client: ClientGrpc,
    private readonly map: PaymentGatewayMapService,
  ) {}

  onModuleInit(): void {
    this.paymentAdminContract = this.client.getService<PaymentAdminServiceObservableContract>(
      'PaymentAdminService',
    )
  }

  @QUERYProtectedMethod({
    path: 'payments',
    summary: 'Получение списка платежей',
    operationDesc: 'Возвращает постраничный список платежей банка с фильтрами',
    roles: CARD_ADMIN_ROLES,
  })
  async getPayments(
    @ValidateInputParam() validation: ValidateInput,
    @Body() pagination: PaymentPaginationDto,
  ): Promise<PaginatedPaymentsOutput> {
    const response = await firstValueFrom(
      this.paymentAdminContract.GetPayments({
        validation,
        pagination: this.map.mapPaymentPaginationRequest(pagination),
      }),
    )
    return this.map.mapPaginatedPayments(response)
  }

  @GETProtectedMethod({
    path: 'payments/:id',
    summary: 'Получение платежа',
    operationDesc: 'Возвращает платёж банка по идентификатору',
    roles: CARD_ADMIN_ROLES,
  })
  async getPayment(
    @ValidateInputParam() validation: ValidateInput,
    @Param('id') id: string,
  ): Promise<PaymentOutput> {
    const response = await firstValueFrom(this.paymentAdminContract.GetPayment({ validation, id }))
    return this.map.mapPayment(response)
  }

  @QUERYProtectedMethod({
    path: 'cards/:cardId/payments',
    summary: 'Получение платежей карты',
    operationDesc: 'Возвращает постраничный список платежей указанной карты',
    roles: CARD_ADMIN_ROLES,
  })
  async getCardPayments(
    @ValidateInputParam() validation: ValidateInput,
    @Param('cardId') cardId: string,
    @Body() pagination: PaymentPaginationDto,
  ): Promise<PaginatedPaymentsOutput> {
    const response = await firstValueFrom(
      this.paymentAdminContract.GetCardPayments({
        validation,
        cardId,
        pagination: this.map.mapPaymentPaginationRequest(pagination),
      }),
    )
    return this.map.mapPaginatedPayments(response)
  }

  @POSTProtected({
    path: 'cards/:cardId/payments',
    summary: 'Создание платежа',
    operationDesc: 'Создаёт платёж по указанной карте',
    roles: CARD_ADMIN_ROLES,
  })
  async createPayment(
    @ValidateInputParam() validation: ValidateInput,
    @Param('cardId') cardId: string,
    @Body() dto: CreatePaymentDto,
  ): Promise<PaymentOutput> {
    const response = await firstValueFrom(
      this.paymentAdminContract.CreatePayment({
        validation,
        cardId,
        ...this.map.mapCreatePaymentRequest(dto),
      }),
    )
    return this.map.mapPayment(response)
  }

  @PATCHProtectedMethod({
    path: 'payments/:id/status',
    summary: 'Изменение статуса платежа',
    operationDesc: 'Изменяет статус платежа банка',
    roles: CARD_ADMIN_ROLES,
  })
  async changePaymentStatus(
    @ValidateInputParam() validation: ValidateInput,
    @Param('id') id: string,
    @Body() dto: ChangePaymentStatusDto,
  ): Promise<PaymentOutput> {
    const response = await firstValueFrom(
      this.paymentAdminContract.ChangePaymentStatus({
        validation,
        id,
        ...this.map.mapChangePaymentStatusRequest(dto),
      }),
    )
    return this.map.mapPayment(response)
  }

  @DELETEProtectedMethod({
    path: 'payments/:id',
    summary: 'Удаление платежа',
    operationDesc: 'Удаляет платёж банка',
    roles: CARD_ADMIN_ROLES,
  })
  async deletePayment(
    @ValidateInputParam() validation: ValidateInput,
    @Param('id') id: string,
  ): Promise<void> {
    await firstValueFrom(this.paymentAdminContract.DeletePayment({ validation, id }))
  }
}
