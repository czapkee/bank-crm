import { Body, Inject, OnModuleInit, Param } from '@nestjs/common'
import {
  GETProtectedMethod,
  HTTPController,
  QUERYProtectedMethod,
  ValidateInputParam,
} from '@org/gateway-decorators'
import { CardPaginationDto } from '@org/gateway-dto'
import { CardGatewayMapService } from '@org/gateway-map'
import { firstValueFrom } from 'rxjs'

import type { ClientGrpc } from '@nestjs/microservices'
import type { CardServiceObservableContract, ValidateInput } from '@org/grpc-types'
import type { CardOutput, PaginatedCardsOutput } from '@org/shared-types'

@HTTPController({
  microserviceName: 'Card',
  serviceName: 'Card',
})
export class CardController implements OnModuleInit {
  private cardContract!: CardServiceObservableContract

  constructor(
    @Inject('CARD_CLIENT') private readonly client: ClientGrpc,
    private readonly map: CardGatewayMapService,
  ) {}

  onModuleInit(): void {
    this.cardContract = this.client.getService<CardServiceObservableContract>('CardService')
  }

  @QUERYProtectedMethod({
    path: 'my',
    summary: 'Получение моих карт',
    operationDesc: 'Возвращает постраничный список карт текущего клиента',
  })
  async getMyCards(
    @ValidateInputParam() validation: ValidateInput,
    @Body() pagination: CardPaginationDto,
  ): Promise<PaginatedCardsOutput> {
    const response = await firstValueFrom(
      this.cardContract.GetMyCards({
        validation,
        pagination: this.map.mapCardPaginationRequest(pagination),
      }),
    )
    return this.map.mapPaginatedCards(response)
  }

  @GETProtectedMethod({
    path: 'my/:id',
    summary: 'Получение моей карты',
    operationDesc: 'Возвращает карту текущего клиента по идентификатору',
  })
  async getMyCard(
    @ValidateInputParam() validation: ValidateInput,
    @Param('id') id: string,
  ): Promise<CardOutput> {
    const response = await firstValueFrom(this.cardContract.GetMyCard({ validation, id }))
    return this.map.mapCard(response)
  }
}
