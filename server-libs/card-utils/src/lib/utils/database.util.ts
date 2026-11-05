import { Injectable } from '@nestjs/common'
import { CardDatabaseService } from '@org/card-database'

@Injectable()
export class CardDatabaseUtil {
  constructor(protected readonly db: CardDatabaseService) {}
}
