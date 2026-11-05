import { Body, Inject, OnModuleInit, Param } from '@nestjs/common'
import { CARD_ADMIN_ROLES } from '@org/gateway-authorization'
import {
  DELETEProtectedMethod,
  GETProtectedMethod,
  HTTPController,
  PATCHProtectedMethod,
  POSTProtected,
  PUTProtectedMethod,
  QUERYProtectedMethod,
  ValidateInputParam,
} from '@org/gateway-decorators'
import {
  CardPaginationDto,
  ChangeCardStatusDto,
  CreateCardDto,
  UpdateCardDto,
} from '@org/gateway-dto'
import { CardGatewayMapService } from '@org/gateway-map'
import { firstValueFrom } from 'rxjs'

import type { ClientGrpc } from '@nestjs/microservices'
import type { CardAdminServiceObservableContract, ValidateInput } from '@org/grpc-types'
import type { CardOutput, PaginatedCardsOutput } from '@org/shared-types'

@HTTPController({
  microserviceName: 'Card',
  serviceName: 'CardAdmin',
})
export class CardAdminController implements OnModuleInit {
  private cardAdminContract!: CardAdminServiceObservableContract

  constructor(
    @Inject('CARD_CLIENT') private readonly client: ClientGrpc,
    private readonly map: CardGatewayMapService,
  ) {}

  onModuleInit(): void {
    this.cardAdminContract = this.client.getService<CardAdminServiceObservableContract>('CardAdminService')
  }

  @QUERYProtectedMethod({
    path: 'cards',
    summary: 'Получение списка карт',
    operationDesc: 'Возвращает постраничный список карт банка с фильтрами',
    roles: CARD_ADMIN_ROLES,
  })
  async getCards(
    @ValidateInputParam() validation: ValidateInput,
    @Body() pagination: CardPaginationDto,
  ): Promise<PaginatedCardsOutput> {
    const response = await firstValueFrom(
      this.cardAdminContract.GetCards({
        validation,
        pagination: this.map.mapCardPaginationRequest(pagination),
      }),
    )
    return this.map.mapPaginatedCards(response)
  }

  @GETProtectedMethod({
    path: 'cards/:id',
    summary: 'Получение карты',
    operationDesc: 'Возвращает карту банка по идентификатору',
    roles: CARD_ADMIN_ROLES,
  })
  async getCard(
    @ValidateInputParam() validation: ValidateInput,
    @Param('id') id: string,
  ): Promise<CardOutput> {
    const response = await firstValueFrom(this.cardAdminContract.GetCard({ validation, id }))
    return this.map.mapCard(response)
  }

  @QUERYProtectedMethod({
    path: 'users/:userId/cards',
    summary: 'Получение карт клиента',
    operationDesc: 'Возвращает постраничный список карт указанного клиента',
    roles: CARD_ADMIN_ROLES,
  })
  async getUserCards(
    @ValidateInputParam() validation: ValidateInput,
    @Param('userId') userId: string,
    @Body() pagination: CardPaginationDto,
  ): Promise<PaginatedCardsOutput> {
    const response = await firstValueFrom(
      this.cardAdminContract.GetUserCards({
        validation,
        userId,
        pagination: this.map.mapCardPaginationRequest(pagination),
      }),
    )
    return this.map.mapPaginatedCards(response)
  }

  @POSTProtected({
    path: 'cards',
    summary: 'Создание карты',
    operationDesc: 'Создаёт банковскую карту для клиента',
    roles: CARD_ADMIN_ROLES,
  })
  async createCard(
    @ValidateInputParam() validation: ValidateInput,
    @Body() dto: CreateCardDto,
  ): Promise<CardOutput> {
    const response = await firstValueFrom(
      this.cardAdminContract.CreateCard({
        validation,
        ...this.map.mapCreateCardRequest(dto),
      }),
    )
    return this.map.mapCard(response)
  }

  @PUTProtectedMethod({
    path: 'cards/:id',
    summary: 'Обновление карты',
    operationDesc: 'Обновляет данные банковской карты',
    roles: CARD_ADMIN_ROLES,
  })
  async updateCard(
    @ValidateInputParam() validation: ValidateInput,
    @Param('id') id: string,
    @Body() dto: UpdateCardDto,
  ): Promise<CardOutput> {
    const response = await firstValueFrom(
      this.cardAdminContract.UpdateCard({
        validation,
        id,
        ...this.map.mapUpdateCardRequest(dto),
      }),
    )
    return this.map.mapCard(response)
  }

  @PATCHProtectedMethod({
    path: 'cards/:id/status',
    summary: 'Изменение статуса карты',
    operationDesc: 'Изменяет статус банковской карты',
    roles: CARD_ADMIN_ROLES,
  })
  async changeCardStatus(
    @ValidateInputParam() validation: ValidateInput,
    @Param('id') id: string,
    @Body() dto: ChangeCardStatusDto,
  ): Promise<CardOutput> {
    const response = await firstValueFrom(
      this.cardAdminContract.ChangeCardStatus({
        validation,
        id,
        ...this.map.mapChangeCardStatusRequest(dto),
      }),
    )
    return this.map.mapCard(response)
  }

  @PATCHProtectedMethod({
    path: 'cards/:id/block',
    summary: 'Блокировка карты',
    operationDesc: 'Блокирует банковскую карту',
    roles: CARD_ADMIN_ROLES,
  })
  async blockCard(
    @ValidateInputParam() validation: ValidateInput,
    @Param('id') id: string,
  ): Promise<CardOutput> {
    const response = await firstValueFrom(this.cardAdminContract.BlockCard({ validation, id }))
    return this.map.mapCard(response)
  }

  @PATCHProtectedMethod({
    path: 'cards/:id/unblock',
    summary: 'Разблокировка карты',
    operationDesc: 'Разблокирует банковскую карту',
    roles: CARD_ADMIN_ROLES,
  })
  async unblockCard(
    @ValidateInputParam() validation: ValidateInput,
    @Param('id') id: string,
  ): Promise<CardOutput> {
    const response = await firstValueFrom(this.cardAdminContract.UnblockCard({ validation, id }))
    return this.map.mapCard(response)
  }

  @DELETEProtectedMethod({
    path: 'cards/:id',
    summary: 'Удаление карты',
    operationDesc: 'Удаляет банковскую карту',
    roles: CARD_ADMIN_ROLES,
  })
  async deleteCard(
    @ValidateInputParam() validation: ValidateInput,
    @Param('id') id: string,
  ): Promise<void> {
    await firstValueFrom(this.cardAdminContract.DeleteCard({ validation, id }))
  }
}
