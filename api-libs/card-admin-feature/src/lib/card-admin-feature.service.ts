import { Injectable } from '@nestjs/common'

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

@Injectable()
export class CardAdminFeatureService implements CardAdminServiceContract {
  async GetCards(_data: GetCardsInput): Promise<PaginatedCardsOutput> {
    throw new Error('Method not implemented')
  }

  async GetCard(_data: GetCardInput): Promise<CardOutput> {
    throw new Error('Method not implemented')
  }

  async GetUserCards(_data: GetUserCardsInput): Promise<PaginatedCardsOutput> {
    throw new Error('Method not implemented')
  }

  async CreateCard(_data: CreateCardInput): Promise<CardOutput> {
    throw new Error('Method not implemented')
  }

  async UpdateCard(_data: UpdateCardInput): Promise<CardOutput> {
    throw new Error('Method not implemented')
  }

  async ChangeCardStatus(_data: ChangeCardStatusInput): Promise<CardOutput> {
    throw new Error('Method not implemented')
  }

  async BlockCard(_data: CardActionInput): Promise<CardOutput> {
    throw new Error('Method not implemented')
  }

  async UnblockCard(_data: CardActionInput): Promise<CardOutput> {
    throw new Error('Method not implemented')
  }

  async DeleteCard(_data: CardActionInput): Promise<Empty> {
    throw new Error('Method not implemented')
  }
}
