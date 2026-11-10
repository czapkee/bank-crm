import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { RMQ_QUEUES } from '@org/rmq-messages';

import { LOG_CLIENT, LogPublisher } from './log.publisher.js';
import { buildRmqUrl } from './rmq-url.util.js';

import type { ClientProviderOptions } from '@nestjs/microservices';

@Global()
@Module({
  imports: [
    ConfigModule,
    ClientsModule.registerAsync([
      {
        name: LOG_CLIENT,
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (config: ConfigService): ClientProviderOptions => ({
          name: LOG_CLIENT,
          transport: Transport.RMQ,
          options: {
            urls: [buildRmqUrl(config)],
            queue: RMQ_QUEUES.LOG,
            queueOptions: {
              durable: true,
            },
          },
        }),
      },
    ]),
  ],
  providers: [LogPublisher],
  exports: [ClientsModule, LogPublisher],
})
export class RmqModule {}
