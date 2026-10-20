import { monolith } from '@org/nest-launcher';

import { AppModule } from './app.module';

void monolith({
  module: AppModule,
  scope: 'BANK-CRM',
  name: 'Gateway',
  logs: true,
  prefix: true,
  validation: true,
  responseMap: true,
  errorMap: true,
  compression: true,
  rateLimit: true,
  cookie: true,
  cors: true,
  swagger: true,
});
