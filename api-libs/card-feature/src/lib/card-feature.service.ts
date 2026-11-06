import { Injectable } from '@nestjs/common'

import type {
  CardOutput,
  CardServiceContract,
  GetMyCardInput,
  GetMyCardsInput,
  PaginatedCardsOutput,
} from '@org/grpc-types'

@Injectable()
export class CardFeatureService implements CardServiceContract {
  async GetMyCards(_data: GetMyCardsInput): Promise<PaginatedCardsOutput> {
    throw new Error('Method not implemented')
  }

  async GetMyCard(_data: GetMyCardInput): Promise<CardOutput> {
    throw new Error('Method not implemented')
  }
}
