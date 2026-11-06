import { Injectable } from '@nestjs/common'
import { SHARED_CONFIG } from '@org/validation-config'

@Injectable()
export class PaginationUtil {
  getPaginationParams(
    total: number,
    page: number = SHARED_CONFIG.PAGINATION.DEFAULT_PAGE,
    limit: number = SHARED_CONFIG.PAGINATION.DEFAULT_LIMIT,
  ): {
    total: number
    page: number
    totalPages: number
    skip: number
    limit: number
    hasNext: boolean
    hasPrev: boolean
  } {
    const totalPages = Math.ceil(total / limit) || 1

    if (page > totalPages) {
      page = totalPages
    }

    if (page <= 0) {
      page = SHARED_CONFIG.PAGINATION.MIN_PAGE
    }

    const skip = (page - 1) * limit

    return {
      total,
      page,
      totalPages,
      skip,
      limit,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    }
  }
}
