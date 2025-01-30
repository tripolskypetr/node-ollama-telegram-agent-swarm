import { factory } from "di-factory";
import TYPES from "src/lib/core/types";
import { inject } from "src/lib/core/di";
import LoggerService from "src/lib/services/base/LoggerService";
import RedisService from "src/lib/services/base/RedisService";

const DEFAULT_TTL_EXPIRE_SECONDS = -1;
const DEFAULT_ITERATOR_BATCH_SIZE = 100;
const DEFAULT_MAX_ITEMS = Number.POSITIVE_INFINITY;

export interface IConfig {
  ITERATOR_BATCH_SIZE: number;
  TTL_EXPIRE_SECONDS: number;
  MAX_ITEMS: number;
}

export const BaseSet = factory(
  class {
    readonly redisService = inject<RedisService>(TYPES.redisService);
    readonly loggerService = inject<LoggerService>(TYPES.loggerService);

    constructor(
      readonly connectionKey: string,
      readonly config: Partial<IConfig> = {}
    ) {
      if (!this.config.ITERATOR_BATCH_SIZE) {
        this.config.ITERATOR_BATCH_SIZE = DEFAULT_ITERATOR_BATCH_SIZE;
      }
      if (!this.config.TTL_EXPIRE_SECONDS) {
        this.config.TTL_EXPIRE_SECONDS = DEFAULT_TTL_EXPIRE_SECONDS;
      }
      if (!this.config.MAX_ITEMS) {
        this.config.MAX_ITEMS = DEFAULT_MAX_ITEMS;
      }
    }

    private async _enforceMaxItems(): Promise<void> {
      this.loggerService.debug(
        `BaseSet _enforceMaxItems connection=${this.connectionKey}`,
      );
      const redis = await this.redisService.getRedis();
      let size = await this.size();
      while (size > this.config.MAX_ITEMS) {
        const [cursor, chunk] = await redis.sscan(this.connectionKey, 0, "COUNT", 1);
        if (chunk.length > 0) {
          await redis.srem(this.connectionKey, chunk[0]);
          size--;
        }
        if (cursor === "0") {
          break;
        }
      }
    }

    async addWithKeepExpire(value: string): Promise<void> {
      this.loggerService.debug(
        `BaseSet addWithKeepExpire connection=${this.connectionKey}`,
        { value }
      );
      const redis = await this.redisService.getRedis();
      const ttl = await redis.pttl(this.connectionKey);
      await redis.sadd(this.connectionKey, value);
      if (this.config.TTL_EXPIRE_SECONDS === -1) {
        await redis.persist(this.connectionKey);
        return;
      }
      await redis.pexpire(
        this.connectionKey,
        ttl === -2 ? this.config.TTL_EXPIRE_SECONDS : ttl
      );
      await this._enforceMaxItems();
    }

    async add(value: string): Promise<void> {
      this.loggerService.debug(`BaseSet add connection=${this.connectionKey}`, {
        value,
      });
      const redis = await this.redisService.getRedis();
      await redis.sadd(this.connectionKey, value);
      if (this.config.TTL_EXPIRE_SECONDS === -1) {
        await redis.persist(this.connectionKey);
      } else {
        await redis.expire(this.connectionKey, this.config.TTL_EXPIRE_SECONDS);
      }
      await this._enforceMaxItems();
    }

    async remove(value: string): Promise<void> {
      this.loggerService.debug(
        `BaseSet remove connection=${this.connectionKey}`,
        { value }
      );
      const redis = await this.redisService.getRedis();
      await redis.srem(this.connectionKey, value);
      if (this.config.TTL_EXPIRE_SECONDS === -1) {
        await redis.persist(this.connectionKey);
      } else {
        await redis.expire(this.connectionKey, this.config.TTL_EXPIRE_SECONDS);
      }
    }

    async has(value: string): Promise<boolean> {
      this.loggerService.debug(`BaseSet has connection=${this.connectionKey}`, {
        value,
      });
      const redis = await this.redisService.getRedis();
      return (await redis.sismember(this.connectionKey, value)) === 1;
    }

    async clear(): Promise<void> {
      this.loggerService.debug(
        `BaseSet clear connection=${this.connectionKey}`
      );
      const redis = await this.redisService.getRedis();
      await redis.del(this.connectionKey);
    }

    async size(): Promise<number> {
      this.loggerService.debug(`BaseSet size connection=${this.connectionKey}`);
      const redis = await this.redisService.getRedis();
      return await redis.scard(this.connectionKey);
    }

    async *[Symbol.asyncIterator](): AsyncIterableIterator<string> {
      this.loggerService.debug(
        `BaseSet iterate connection=${this.connectionKey}`
      );
      const redis = await this.redisService.getRedis();
      let cursor = 0;

      do {
        const [nextCursor, chunk] = await redis.sscan(
          this.connectionKey,
          cursor,
          "COUNT",
          this.config.ITERATOR_BATCH_SIZE
        );
        cursor = parseInt(nextCursor, 10);
        for (const member of chunk) {
          yield member;
        }
      } while (cursor !== 0);
    }
  }
);

export type TBaseSet = InstanceType<ReturnType<typeof BaseSet>>;

export default BaseSet;
