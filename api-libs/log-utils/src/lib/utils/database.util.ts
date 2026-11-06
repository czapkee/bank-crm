import { Injectable } from '@nestjs/common'
import { LogDatabaseService } from '@org/log-database'

@Injectable()
export class LogDatabaseUtil {
  constructor(protected readonly db: LogDatabaseService) {}
}
