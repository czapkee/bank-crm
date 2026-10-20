import { BaseOptions } from './shared.type.js';

export interface MicroserviceBootstrapOptions<T> extends BaseOptions<T> {
  rabbitMQ?: boolean;
}
