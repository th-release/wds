import * as redisStore from 'cache-manager-ioredis';
import { CacheModule } from '@nestjs/common';
import { REDIS_HOST, REDIS_PORT, REDIS_TTL } from './config';

export const redisModule = CacheModule.register({
  store: redisStore,
  host: REDIS_HOST,
  port: REDIS_PORT,
  ttl: REDIS_TTL,
})
