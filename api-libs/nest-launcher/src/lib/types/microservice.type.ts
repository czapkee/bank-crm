import { BaseOptions } from './shared.type.js';

export interface RabbitMQOptions {
  queue: string;
  exchange?: string;
  routingKey?: string;
  exchangeType?: 'direct' | 'fanout' | 'topic' | 'headers';
}

export interface MicroserviceBootstrapOptions<T> extends BaseOptions<T> {
  rabbitMQ?: boolean | RabbitMQOptions;
}
