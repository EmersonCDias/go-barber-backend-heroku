import { RedisOptions } from 'ioredis';

interface ICacheConfig {
  drive: 'redis';
  config: {
    redis: RedisOptions;
  };
}

export default ({
  diver: 'redis',
  config: {
    redis: {
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
      password: process.env.REDIS_PASS || undefined,
    },
  },
} as unknown) as ICacheConfig;
