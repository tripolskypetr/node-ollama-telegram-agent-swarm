import { inject } from "src/lib/core/di";
import LoggerService from "./LoggerService";
import TYPES from "src/lib/core/types";
import Redis from "ioredis";
import {
  CC_REDIS_FLUSHALL,
  CC_REDIS_HOST,
  CC_REDIS_PASSWORD,
  CC_REDIS_PORT,
} from "src/config/params";
import {
  errorData,
  singleshot,
} from "functools-kit";

const config = {
  host: CC_REDIS_HOST,
  port: CC_REDIS_PORT,
  password: CC_REDIS_PASSWORD,
  retryStrategy(times: number) {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
} as const;

export class RedisService {
  private readonly loggerService = inject<LoggerService>(TYPES.loggerService);

  public getRedis = singleshot(async () => {
    const redis = new Redis(config);
    redis.on("connect", () => {
      this.loggerService.log("redisService Successfully connected to Redis", config);
    });
    redis.on("error", (error) => {
      this.loggerService.log("redisService Redis connection failed", config);
      throw error;
    });
    redis.on("close", () => {
      this.loggerService.log("redisService Redis connection closed", config);
    });
    redis.on("reconnecting", () => {
      this.loggerService.log("redisService Redis reconnecting", config);
    });
    this.makePingInterval(redis);
    return redis;
  });

  private makePingInterval = singleshot((redis: Redis) => {
    setInterval(async () => {
      try {
        await redis.ping();
        this.loggerService.log("redisService Redis connection is alive");
      } catch (error) {
        throw new class extends Error {
          constructor() {
            super("Redis ping failed");
          }
          originalError = errorData(error);
        }
      }
    }, 30000);
  });

  protected init = singleshot(async () => {
    const redis = await this.getRedis();
    if (CC_REDIS_FLUSHALL) {
      await redis.flushall();
    }
  })
}

export default RedisService;
