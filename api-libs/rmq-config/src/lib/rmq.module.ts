import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { RMQ_QUEUES, USER_SYNC_EXCHANGE } from '@org/rmq-messages';

import { LOG_CLIENT, LogPublisher } from './log.publisher.js';
import { buildRmqUrl } from './rmq-url.util.js';
import { USER_SYNC_CLIENT, UserSyncPublisher } from './user-sync.publisher.js';

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
      {
        name: USER_SYNC_CLIENT,
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (config: ConfigService): ClientProviderOptions => ({
          name: USER_SYNC_CLIENT,
          transport: Transport.RMQ,
          options: {
            urls: [buildRmqUrl(config)],
            queue: USER_SYNC_EXCHANGE,
            exchange: USER_SYNC_EXCHANGE,
            exchangeType: 'fanout',
            queueOptions: {
              durable: true,
            },
          },
        }),
      },
    ]),
  ],
  providers: [LogPublisher, UserSyncPublisher],
  exports: [ClientsModule, LogPublisher, UserSyncPublisher],
})
export class RmqModule {}
