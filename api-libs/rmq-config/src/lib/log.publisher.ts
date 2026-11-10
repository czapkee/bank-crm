import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { RMQ_MESSAGES } from '@org/rmq-messages';

import type { LogMessage } from '@org/rmq-messages';

export const LOG_CLIENT = 'LOG_CLIENT';

@Injectable()
export class LogPublisher {
  private readonly logger = new Logger(LogPublisher.name);

  constructor(@Inject(LOG_CLIENT) private readonly client: ClientProxy) {}

  publish(message: LogMessage): void {
    this.client.emit(RMQ_MESSAGES.LOG_CREATE, message).subscribe({
      error: (error: unknown) => {
        this.logger.error(
          'Failed to publish log message',
          error instanceof Error ? error.stack : String(error),
        );
      },
    });
  }
}
