import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class CacheService {
  constructor(@Inject(CACHE_MANAGER) private readonly cache: Cache) {}

  async get<T>(key: string): Promise<T | null> {
    return await this.cache.get<T>(key);
  }

  async set<T = any>(key: string, value: T, ttl?: number) {
    await this.cache.set(key, value, ttl);
  }

  async del(key: string) {
    await this.cache.del(key);
  }

  async clear() {
    await this.cache.clear();
  }

  async onModuleDestroy() {
    await this.cache.disconnect();
  }
}
