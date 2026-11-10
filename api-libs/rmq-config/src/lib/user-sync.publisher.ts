import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { RMQ_MESSAGES } from '@org/rmq-messages';

import type { UserSyncMessage } from '@org/rmq-messages';

export const USER_SYNC_CLIENT = 'USER_SYNC_CLIENT';

@Injectable()
export class UserSyncPublisher {
  private readonly logger = new Logger(UserSyncPublisher.name);

  constructor(@Inject(USER_SYNC_CLIENT) private readonly client: ClientProxy) {}

  publish(message: UserSyncMessage): void {
    this.client.emit(RMQ_MESSAGES.USER_SYNC, message).subscribe({
      error: (error: unknown) => {
        this.logger.error(
          'Failed to publish user sync message',
          error instanceof Error ? error.stack : String(error),
        );
      },
    });
  }
}
