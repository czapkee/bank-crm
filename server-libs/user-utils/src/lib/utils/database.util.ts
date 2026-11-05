import { Injectable } from '@nestjs/common'
import { UserDatabaseService } from '@org/user-database'

@Injectable()
export class UserDatabaseUtil {
  constructor(protected readonly db: UserDatabaseService) {}
}
