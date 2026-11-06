import { Controller } from '@nestjs/common'
import { GrpcMethod } from '@nestjs/microservices'

import { CardFeatureService } from './card-feature.service.js'

import type {
  CardOutput,
  CardServiceContract,
  GetMyCardInput,
  GetMyCardsInput,
  PaginatedCardsOutput,
} from '@org/grpc-types'

@Controller()
export class CardFeatureController implements CardServiceContract {
  constructor(private readonly service: CardFeatureService) {}

  @GrpcMethod('CardService', 'GetMyCards')
  async GetMyCards(data: GetMyCardsInput): Promise<PaginatedCardsOutput> {
    return await this.service.GetMyCards(data)
  }

  @GrpcMethod('CardService', 'GetMyCard')
  async GetMyCard(data: GetMyCardInput): Promise<CardOutput> {
    return await this.service.GetMyCard(data)
  }
}
