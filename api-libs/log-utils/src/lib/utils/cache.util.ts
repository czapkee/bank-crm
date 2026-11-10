import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRedis } from '@nestjs-modules/ioredis';
import { Redis } from 'ioredis';

const VERSION_KEY = 'bank-crm:logs:version';
const CACHE_PREFIX = 'bank-crm:logs';

@Injectable()
export class LogCacheUtil {
  private readonly ttl: number;

  constructor(
    @InjectRedis() private readonly redis: Redis,
    config: ConfigService,
  ) {
    this.ttl = Number(config.get<string>('BANK_CRM_LOG_CACHE_TTL', '60'));
  }

  private async getVersion(): Promise<number> {
    const version = await this.redis.get(VERSION_KEY);

    return version === null ? 0 : Number(version);
  }

  private async buildKey(scope: string): Promise<string> {
    const version = await this.getVersion();

    return `${CACHE_PREFIX}:v${version}:${scope}`;
  }

  async get<T>(scope: string): Promise<T | null> {
    try {
      const key = await this.buildKey(scope);
      const value = await this.redis.get(key);

      return value === null ? null : (JSON.parse(value) as T);
    } catch {
      return null;
    }
  }

  async set(scope: string, value: unknown): Promise<void> {
    try {
      const key = await this.buildKey(scope);

      await this.redis.set(key, JSON.stringify(value), 'EX', this.ttl);
    } catch {
      return;
    }
  }

  async invalidate(): Promise<void> {
    try {
      await this.redis.incr(VERSION_KEY);
    } catch {
      return;
    }
  }
}
