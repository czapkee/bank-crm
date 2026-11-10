import { microservice } from '@org/nest-launcher';

import { AppModule } from './app.module';

void microservice<AppModule>({
  scope: 'BANK_CRM',
  name: 'Log',
  module: AppModule,
  rabbitMQ: true,
  logs: true,
});
