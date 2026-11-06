import { Body, Inject, OnModuleInit, Param } from '@nestjs/common'
import {
  HTTPController,
  POSTProtected,
  QUERYProtectedMethod,
  ValidateInputParam,
} from '@org/gateway-decorators'
import { PaymentPaginationDto, WriteOffCardDto } from '@org/gateway-dto'
import { PaymentGatewayMapService } from '@org/gateway-map'
import { firstValueFrom } from 'rxjs'

import type { ClientGrpc } from '@nestjs/microservices'
import type { PaymentServiceObservableContract, ValidateInput } from '@org/grpc-types'
import type { PaginatedPaymentsOutput, PaymentOutput } from '@org/shared-types'

@HTTPController({
  microserviceName: 'Card',
  serviceName: 'Payment',
})
export class PaymentController implements OnModuleInit {
  private paymentContract!: PaymentServiceObservableContract

  constructor(
    @Inject('CARD_CLIENT') private readonly client: ClientGrpc,
    private readonly map: PaymentGatewayMapService,
  ) {}

  onModuleInit(): void {
    this.paymentContract = this.client.getService<PaymentServiceObservableContract>('PaymentService')
  }

  @POSTProtected({
    path: 'cards/:cardId/write-off',
    summary: 'Списание средств с карты',
    operationDesc: 'Выполняет платёж по банковской карте текущего клиента',
  })
  async writeOffCard(
    @ValidateInputParam() validation: ValidateInput,
    @Param('cardId') cardId: string,
    @Body() dto: WriteOffCardDto,
  ): Promise<PaymentOutput> {
    const response = await firstValueFrom(
      this.paymentContract.WriteOffCard({
        validation,
        cardId,
        ...this.map.mapWriteOffCardRequest(dto),
      }),
    )
    return this.map.mapPayment(response)
  }

  @QUERYProtectedMethod({
    path: 'my',
    summary: 'Получение моих платежей',
    operationDesc: 'Возвращает постраничный список платежей текущего клиента',
  })
  async getMyPayments(
    @ValidateInputParam() validation: ValidateInput,
    @Body() pagination: PaymentPaginationDto,
  ): Promise<PaginatedPaymentsOutput> {
    const response = await firstValueFrom(
      this.paymentContract.GetMyPayments({
        validation,
        pagination: this.map.mapPaymentPaginationRequest(pagination),
      }),
    )
    return this.map.mapPaginatedPayments(response)
  }

  @QUERYProtectedMethod({
    path: 'my/:cardId',
    summary: 'Получение моих платежей по карте',
    operationDesc: 'Возвращает постраничный список платежей текущего клиента по указанной карте',
  })
  async getMyCardPayments(
    @ValidateInputParam() validation: ValidateInput,
    @Param('cardId') cardId: string,
    @Body() pagination: PaymentPaginationDto,
  ): Promise<PaginatedPaymentsOutput> {
    const response = await firstValueFrom(
      this.paymentContract.GetMyCardPayments({
        validation,
        cardId,
        pagination: this.map.mapPaymentPaginationRequest(pagination),
      }),
    )
    return this.map.mapPaginatedPayments(response)
  }
}
