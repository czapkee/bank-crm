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
      dateFrom: pagination.dateFrom === undefined ? undefined : new Date(pagination.dateFrom).toISOString(),
      dateTo: pagination.dateTo === undefined ? undefined : new Date(pagination.dateTo).toISOString(),
    }
  }

  mapCreateCardRequest(dto: CreateCardInput): GrpcCreateCardInput {
    return {
      cardNumber: dto.cardNumber,
      accountNumber: dto.accountNumber,
      dateOfExpire: new Date(dto.dateOfExpire).toISOString(),
      balance: dto.balance,
      status: dto.status === undefined ? undefined : CARD_STATUSES_TO_GRPC[dto.status],
      userId: dto.userId,
    }
  }

  mapUpdateCardRequest(dto: UpdateCardInput): GrpcUpdateCardInput {
    return {
      ...(dto.accountNumber === undefined ? {} : { accountNumber: dto.accountNumber }),
      ...(dto.dateOfExpire === undefined
        ? {}
        : { dateOfExpire: new Date(dto.dateOfExpire).toISOString() }),
      ...(dto.balance === undefined ? {} : { balance: dto.balance }),
      ...(dto.status === undefined ? {} : { status: CARD_STATUSES_TO_GRPC[dto.status] }),
    }
  }

  mapChangeCardStatusRequest(dto: ChangeCardStatusInput): GrpcChangeCardStatusInput {
    return {
      status: CARD_STATUSES_TO_GRPC[dto.status],
    }
  }

  mapPaginatedCards(output: GrpcPaginatedCardsOutput): PaginatedCardsOutput {
    return {
      pagination: this.mapCardPagination(output.pagination),
      cards: (output.cards ?? []).map((card) => this.mapCard(card)),
    }
  }
}
