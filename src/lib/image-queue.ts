import redis from '@/lib/redis';

export const IMAGE_CONVERSION_QUEUE_KEY = 'momentory:image-conversion:queue';
export const IMAGE_CONVERSION_PENDING_KEY = 'momentory:image-conversion:pending';

export interface ImageConversionJob {
  contentHash: string;
  originalExt: string;
  /** 原图在 COS 上的 key，worker 据此拉取原图 */
  originalKey: string;
  contentType: string;
  /** 重试次数，首次入队为 1 */
  attempts?: number;
}

/**
 * 将图片变体转换任务入队。
 * 使用 pending 集合按 contentHash 去重，同一张图不会重复入队；
 * worker 取出任务后立即 SREM，处理失败时下次上传同图可重新入队。
 *
 * @returns true 表示本次实际入队；false 表示该图已在队列等待
 */
export const enqueueImageConversion = async (
  job: ImageConversionJob,
): Promise<boolean> => {
  const added = await redis.sadd(IMAGE_CONVERSION_PENDING_KEY, job.contentHash);
  if (added === 0) {
    return false;
  }
  try {
    await redis.lpush(IMAGE_CONVERSION_QUEUE_KEY, JSON.stringify(job));
  } catch (err) {
    // 入队失败则回滚去重标记，避免该图永远卡在 pending 集合
    await redis.srem(IMAGE_CONVERSION_PENDING_KEY, job.contentHash).catch(() => {});
    throw err;
  }
  return true;
};
