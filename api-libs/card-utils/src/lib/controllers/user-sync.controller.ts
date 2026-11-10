import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { RMQ_MESSAGES } from '@org/rmq-messages';

import { CardDatabaseUtil } from '../utils/database.util.js';

import type { UserSyncMessage } from '@org/rmq-messages';

@Controller()
export class CardUserSyncController {
  constructor(private readonly db: CardDatabaseUtil) {}

  @EventPattern(RMQ_MESSAGES.USER_SYNC)
  async handleUserSync(@Payload() message: UserSyncMessage): Promise<void> {
    if (message.action === 'delete') {
      await this.db.deleteUserSnapshot(message.userId);
      return;
    }

    await this.db.syncUserSnapshot(message.userId);
  }
}
