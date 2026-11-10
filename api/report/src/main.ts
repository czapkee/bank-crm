import { microservice } from '@org/nest-launcher';
import { USER_SYNC_EXCHANGE, USER_SYNC_QUEUES } from '@org/rmq-messages';

import { AppModule } from './app.module';

void microservice<AppModule>({
  scope: 'BANK_CRM',
  name: 'Report',
  module: AppModule,
  rabbitMQ: {
    queue: USER_SYNC_QUEUES.REPORT,
    exchange: USER_SYNC_EXCHANGE,
    exchangeType: 'fanout',
  },
  logs: true,
});
