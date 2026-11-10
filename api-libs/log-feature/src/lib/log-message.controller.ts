import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { LogDatabaseUtil } from '@org/log-utils';
import { RMQ_MESSAGES } from '@org/rmq-messages';

import type { LogMessage } from '@org/rmq-messages';

@Controller()
export class LogMessageController {
  private readonly logger = new Logger(LogMessageController.name);

  constructor(private readonly db: LogDatabaseUtil) {}

  @EventPattern(RMQ_MESSAGES.LOG_CREATE)
  async handleLogMessage(@Payload() data: LogMessage): Promise<void> {
    try {
      await this.db.createLog(data);
    } catch (error) {
      this.logger.error(
        `Failed to save log message: ${data.action}`,
        error instanceof Error ? error.stack : String(error),
      );
    }
  }
}
