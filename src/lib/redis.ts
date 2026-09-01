import 'dotenv/config';
import Redis from 'ioredis';

declare global {
  var redis: Redis | undefined;
}

const createRedisClient = (): Redis => {
  const client = new Redis({
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
    username: process.env.REDIS_USERNAME || undefined,
    password: process.env.REDIS_PASSWORD || undefined,
    db: parseInt(process.env.REDIS_DB || '0', 10),
    // 长驻进程使用阻塞命令（BLPOP），禁用单命令重试上限
    maxRetriesPerRequest: null,
  });

  client.on('error', (err) => {
    console.error('[Redis] client error:', err.message);
  });

  return client;
};

const redis = globalThis.redis || createRedisClient();

if (process.env.NODE_ENV !== 'production') {
  globalThis.redis = redis;
}

export default redis;
