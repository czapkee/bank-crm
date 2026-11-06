import { Controller } from '@nestjs/common'
import { GrpcMethod } from '@nestjs/microservices'

import { CardAdminFeatureService } from './card-admin-feature.service.js'

import type {
  CardActionInput,
  CardAdminServiceContract,
  CardOutput,
  ChangeCardStatusInput,
  CreateCardInput,
  Empty,
  GetCardInput,
  GetCardsInput,
  GetUserCardsInput,
  PaginatedCardsOutput,
  UpdateCardInput,
} from '@org/grpc-types'

@Controller()
export class CardAdminFeatureController implements CardAdminServiceContract {
  constructor(private readonly service: CardAdminFeatureService) {}

  @GrpcMethod('CardAdminService', 'GetCards')
  async GetCards(data: GetCardsInput): Promise<PaginatedCardsOutput> {
    return await this.service.GetCards(data)
  }

  @GrpcMethod('CardAdminService', 'GetCard')
  async GetCard(data: GetCardInput): Promise<CardOutput> {
    return await this.service.GetCard(data)
  }

  @GrpcMethod('CardAdminService', 'GetUserCards')
  async GetUserCards(data: GetUserCardsInput): Promise<PaginatedCardsOutput> {
    return await this.service.GetUserCards(data)
  }

  @GrpcMethod('CardAdminService', 'CreateCard')
  async CreateCard(data: CreateCardInput): Promise<CardOutput> {
    return await this.service.CreateCard(data)
  }

  @GrpcMethod('CardAdminService', 'UpdateCard')
  async UpdateCard(data: UpdateCardInput): Promise<CardOutput> {
    return await this.service.UpdateCard(data)
  }

  @GrpcMethod('CardAdminService', 'ChangeCardStatus')
  async ChangeCardStatus(data: ChangeCardStatusInput): Promise<CardOutput> {
    return await this.service.ChangeCardStatus(data)
  }

  @GrpcMethod('CardAdminService', 'BlockCard')
  async BlockCard(data: CardActionInput): Promise<CardOutput> {
    return await this.service.BlockCard(data)
  }

  @GrpcMethod('CardAdminService', 'UnblockCard')
  async UnblockCard(data: CardActionInput): Promise<CardOutput> {
    return await this.service.UnblockCard(data)
  }

  @GrpcMethod('CardAdminService', 'DeleteCard')
  async DeleteCard(data: CardActionInput): Promise<Empty> {
    return await this.service.DeleteCard(data)
  }
}
