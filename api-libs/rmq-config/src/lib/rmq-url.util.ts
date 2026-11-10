import { ConfigService } from '@nestjs/config';

export function buildRmqUrl(config: ConfigService): string {
  const user = config.get<string>('BANK_CRM_RMQ_USER', 'user');
  const password = config.get<string>('BANK_CRM_RMQ_PASSWORD', 'password');
  const url = config.get<string>('BANK_CRM_RMQ_URL', 'localhost:5672');

  return `amqp://${encodeURIComponent(user)}:${encodeURIComponent(password)}@${url}`;
}
