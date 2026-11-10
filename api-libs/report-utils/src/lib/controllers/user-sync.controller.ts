import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { RMQ_MESSAGES } from '@org/rmq-messages';

import { ReportDatabaseUtil } from '../utils/database.util.js';

import type { UserSyncMessage } from '@org/rmq-messages';

@Controller()
export class ReportUserSyncController {
  constructor(private readonly db: ReportDatabaseUtil) {}

  @EventPattern(RMQ_MESSAGES.USER_SYNC)
  async handleUserSync(@Payload() message: UserSyncMessage): Promise<void> {
    if (message.action === 'delete') {
      await this.db.deleteUserSnapshot(message.userId);
      return;
    }

    await this.db.syncUserSnapshot(message.userId);
  }
}
