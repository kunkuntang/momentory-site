import 'dotenv/config';
import { Queue } from 'bullmq';

/** BullMQ 队列名（不是 Redis 原始 key，BullMQ 会自动加前缀） */
export const IMAGE_CONVERSION_QUEUE_NAME = 'image-conversion';

/** BullMQ 默认前缀，Worker 消费端需要保持一致 */
const BULLMQ_PREFIX = 'bull';

export interface ImageConversionJob {
  contentHash: string;
  originalExt: string;
  /** 原图在 COS 上的 key，worker 据此拉取原图 */
  originalKey: string;
  contentType: string;
}

const MAX_ATTEMPTS = 3;

const connectionConfig = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379', 10),
  username: process.env.REDIS_USERNAME || undefined,
  password: process.env.REDIS_PASSWORD || undefined,
  db: parseInt(process.env.REDIS_DB || '0', 10),
  maxRetriesPerRequest: null,
};

/**
 * BullMQ Queue 单例。
 * bullmq 会自己维护 Redis 连接池，不复用 redis.ts 的 IORedis 实例
 * （避免 bullmq 清理时误关闭全局连接）。
 */
export const imageQueue = new Queue(IMAGE_CONVERSION_QUEUE_NAME, {
  connection: connectionConfig,
  prefix: BULLMQ_PREFIX,
  defaultJobOptions: {
    attempts: MAX_ATTEMPTS,
    backoff: { type: 'exponential', delay: 1000 },
    removeOnComplete: true,
  },
});

/**
 * 将图片变体转换任务入队。
 * 使用 contentHash 作为 BullMQ jobId 去重：同一张图不会重复排队。
 * BullMQ 内置 attempts + exponential backoff 管理重试。
 *
 * @returns true 表示本次实际入队；false 表示该图已在队列等待或处理中
 */
export const enqueueImageConversion = async (
  job: ImageConversionJob,
): Promise<boolean> => {
  const existing = await imageQueue.getJob(job.contentHash);
  if (existing) {
    const state = await existing.getState();
    if (state === 'waiting' || state === 'active') {
      return false;
    }
    // completed / failed：旧 job 已结束，允许重新入队（BullMQ 会替换）
  }
  await imageQueue.add(IMAGE_CONVERSION_QUEUE_NAME, job, {
    jobId: job.contentHash,
  });
  return true;
};
