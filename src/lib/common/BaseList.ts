import { factory } from 'di-factory';
import TYPES from 'src/lib/core/types';
import { inject } from 'src/lib/core/di';
import LoggerService from 'src/lib/services/base/LoggerService';
import RedisService from 'src/lib/services/base/RedisService';

const DEFAULT_TTL_EXPIRE_SECONDS = -1;
const DEFAULT_MAX_ITEMS = Number.POSITIVE_INFINITY;

export interface IConfig {
  TTL_EXPIRE_SECONDS: number;
  MAX_ITEMS: number;
}

export const BaseList = factory(class {
  
  readonly redisService = inject<RedisService>(TYPES.redisService);
  readonly loggerService = inject<LoggerService>(TYPES.loggerService);

  constructor(readonly connectionKey: string, readonly config: Partial<IConfig> = {}) {
    if (!config.MAX_ITEMS) {
      this.config.MAX_ITEMS = DEFAULT_MAX_ITEMS;
    }
    if (!config.TTL_EXPIRE_SECONDS) {
      this.config.TTL_EXPIRE_SECONDS = DEFAULT_TTL_EXPIRE_SECONDS;
    }
  }

  async _enforceMaxItems(): Promise<void> {
    this.loggerService.debug(`BaseList _enforceMaxItems connection=${this.connectionKey}`);
    const redis = await this.redisService.getRedis();
    let length = await this.length();
    while (length > this.config.MAX_ITEMS) {
      await redis.lpop(this.connectionKey);
      length--;
    }
  }

  async pushWithKeepExpire(value: any): Promise<void> {
    this.loggerService.debug(`BaseList pushWithKeepExpire connection=${this.connectionKey}`, { value });
    const redis = await this.redisService.getRedis();
    const ttl = await redis.pttl(this.connectionKey);
    await redis.rpush(this.connectionKey, JSON.stringify(value));
    if (this.config.TTL_EXPIRE_SECONDS === -1) {
      await redis.persist(this.connectionKey);
      return;
    }
    await redis.pexpire(this.connectionKey, ttl === -2 ? this.config.TTL_EXPIRE_SECONDS : ttl);
    await this._enforceMaxItems();
  }

  async push(value: any): Promise<void> {
    this.loggerService.debug(`BaseList push connection=${this.connectionKey}`, { value });
    const redis = await this.redisService.getRedis();
    await redis.rpush(this.connectionKey, JSON.stringify(value));
    if (this.config.TTL_EXPIRE_SECONDS === -1) {
      await redis.persist(this.connectionKey);
      return;
    } 
    await redis.expire(this.connectionKey, this.config.TTL_EXPIRE_SECONDS);
    await this._enforceMaxItems();
  }

  async pop(): Promise<any | null> {
    this.loggerService.debug(`BaseList pop connection=${this.connectionKey}`);
    const redis = await this.redisService.getRedis();
    const value = await redis.rpop(this.connectionKey);
    if (this.config.TTL_EXPIRE_SECONDS === -1) {
      await redis.persist(this.connectionKey);
      return value ? JSON.parse(value) : null;
    } 
    await redis.expire(this.connectionKey, this.config.TTL_EXPIRE_SECONDS);
    return value ? JSON.parse(value) : null;
  }

  async shift(): Promise<any | null> {
    this.loggerService.debug(`BaseList shift connection=${this.connectionKey}`);
    const redis = await this.redisService.getRedis();
    const value = await redis.lpop(this.connectionKey);
    if (this.config.TTL_EXPIRE_SECONDS === -1) {
      await redis.persist(this.connectionKey);
      return value ? JSON.parse(value) : null;
    } 
    await redis.expire(this.connectionKey, this.config.TTL_EXPIRE_SECONDS);
    return value ? JSON.parse(value) : null;
  }

  async length(): Promise<number> {
    this.loggerService.debug(`BaseList length connection=${this.connectionKey}`);
    const redis = await this.redisService.getRedis();
    return await redis.llen(this.connectionKey);
  }

  async getFirst(): Promise<any | null> {
    this.loggerService.debug(`BaseList getFirst connection=${this.connectionKey}`);
    const redis = await this.redisService.getRedis();
    const value = await redis.lindex(this.connectionKey, 0);
    return value ? JSON.parse(value) : null;
  }

  async *[Symbol.asyncIterator](): AsyncIterableIterator<any> {
    this.loggerService.debug(`BaseList iterate connection=${this.connectionKey}`);
    const redis = await this.redisService.getRedis();
    const length = await this.length();
    for (let i = 0; i < length; i++) {
      const value = await redis.lindex(this.connectionKey, i);
      if (value) {
        yield JSON.parse(value);
      }
    }
  }

  iterate(): AsyncIterableIterator<any> {
    return this[Symbol.asyncIterator]();
  }

  async clear(): Promise<void> {
    this.loggerService.debug(`BaseList clear connection=${this.connectionKey}`);
    const redis = await this.redisService.getRedis();
    await redis.del(this.connectionKey);
  }
})

export type TBaseList = InstanceType<ReturnType<typeof BaseList>>;

export default BaseList;
