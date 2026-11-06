import { Injectable } from '@nestjs/common'
import { CARD_STATUSES_TO_GRPC, CardStatuses, GRPC_TO_CARD_STATUSES } from '@org/enums'

import type {
  GrpcCardPaginationInput,
  GrpcChangeCardStatusInput,
  GrpcCreateCardInput,
  GrpcUpdateCardInput,
} from './types/grpc-input.types.js'
import type {
  GrpcCardOutput,
  GrpcCardPaginationOutput,
  GrpcPaginatedCardsOutput,
} from './types/grpc-output.types.js'
import type {
  CardOutput,
  CardPaginationInput,
  CardPaginationOutput,
  ChangeCardStatusInput,
  CreateCardInput,
  PaginatedCardsOutput,
  UpdateCardInput,
} from '@org/shared-types'

@Injectable()
export class CardGatewayMapService {
  mapCardStatus(status: number): CardStatuses {
    return GRPC_TO_CARD_STATUSES[status]
  }

  mapCard(card: GrpcCardOutput): CardOutput {
    return {
      ...card,
      status: this.mapCardStatus(card.status),
    }
  }

  mapCardPagination(pagination: GrpcCardPaginationOutput): CardPaginationOutput {
    return {
      ...pagination,
      status: pagination.status === undefined ? undefined : this.mapCardStatus(pagination.status),
    }
  }

  mapCardPaginationRequest(pagination: CardPaginationInput): GrpcCardPaginationInput {
    return {
      ...pagination,
      status: pagination.status === undefined ? undefined : CARD_STATUSES_TO_GRPC[pagination.status],
    }
  }

  mapCreateCardRequest(dto: CreateCardInput): GrpcCreateCardInput {
    return {
      ...dto,
      status: dto.status === undefined ? undefined : CARD_STATUSES_TO_GRPC[dto.status],
    }
  }

  mapUpdateCardRequest(dto: UpdateCardInput): GrpcUpdateCardInput {
    return {
      ...dto,
      status: dto.status === undefined ? undefined : CARD_STATUSES_TO_GRPC[dto.status],
    }
  }

  mapChangeCardStatusRequest(dto: ChangeCardStatusInput): GrpcChangeCardStatusInput {
    return {
      ...dto,
      status: CARD_STATUSES_TO_GRPC[dto.status],
    }
  }

  mapPaginatedCards(output: GrpcPaginatedCardsOutput): PaginatedCardsOutput {
    return {
      pagination: this.mapCardPagination(output.pagination),
      cards: output.cards.map((card) => this.mapCard(card)),
    }
  }
}
