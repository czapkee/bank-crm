import { Limit } from '../decorators/pagination/limit.decorator.js'
import { Page } from '../decorators/pagination/page.decorator.js'
import { Search } from '../decorators/pagination/search.decorator.js'

export class BasePaginationDto {
  @Page()
  page?: number = 1

  @Limit()
  limit?: number = 10

  @Search()
  search?: string
}
