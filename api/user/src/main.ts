import { microservice } from '@org/nest-launcher';

import { AppModule } from './app.module';

void microservice<AppModule>({
  scope: 'BANK-CRM',
  name: 'User',
  module: AppModule,
  rabbitMQ: false,
  logs: true,
});
