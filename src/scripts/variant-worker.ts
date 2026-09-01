import 'dotenv/config';
import { getObjectBuffer, uploadBuffer } from '@/lib/cos';
import { processImage, getCacheControl } from '@/lib/image-processor';
import {
  IMAGE_CONVERSION_QUEUE_KEY,
  IMAGE_CONVERSION_PENDING_KEY,
  type ImageConversionJob,
} from '@/lib/image-queue';
import redis from '@/lib/redis';

const MAX_ATTEMPTS = 3;
const BLOCK_TIMEOUT_SECONDS = 5;
const LOOP_ERROR_DELAY_MS = 3000;

const processJob = async (raw: string): Promise<void> => {
  let job: ImageConversionJob;
  try {
    job = JSON.parse(raw) as ImageConversionJob;
  } catch {
    console.error('[VariantWorker] invalid job payload:', raw.substring(0, 200));
    return;
  }

  const { contentHash, originalExt, originalKey, contentType } = job;
  const hashShort = contentHash.substring(0, 12);

  // 取出任务后立即移除去重标记：处理失败时用户重新上传同图可重新入队
  await redis.srem(IMAGE_CONVERSION_PENDING_KEY, contentHash).catch(() => {});

  const attempts = job.attempts ?? 1;
  console.log(
    `[VariantWorker] processing hash=${hashShort}... attempts=${attempts} originalKey=${originalKey}`,
  );
  const startTime = Date.now();

  try {
    const buffer = await getObjectBuffer(originalKey);
    const processed = await processImage(buffer, {
      name: originalKey,
      type: contentType,
    });

    const cacheControl = getCacheControl();
    await Promise.all(
      processed.variants.map(async (v) => {
        await uploadBuffer(v.buffer, v.key, {
          CacheControl: cacheControl,
          ContentType: v.contentType,
        });
        console.log(
          `[VariantWorker] uploaded variant ${v.key} (${(v.sizeBytes / 1024).toFixed(1)}KB)`,
        );
      }),
    );

    console.log(
      `[VariantWorker] done hash=${hashShort}... variants=${processed.variants.length} in ${Date.now() - startTime}ms`,
    );
  } catch (err) {
    const nextAttempts = attempts + 1;
    if (nextAttempts <= MAX_ATTEMPTS) {
      console.warn(
        `[VariantWorker] failed hash=${hashShort}..., retrying ${nextAttempts}/${MAX_ATTEMPTS}:`,
        err instanceof Error ? err.message : String(err),
      );
      await redis
        .lpush(
          IMAGE_CONVERSION_QUEUE_KEY,
          JSON.stringify({ ...job, attempts: nextAttempts }),
        )
        .catch((e) => {
          console.error('[VariantWorker] failed to re-queue job:', e);
        });
    } else {
      console.error(
        `[VariantWorker] giving up hash=${hashShort}... after ${MAX_ATTEMPTS} attempts:`,
        err,
      );
    }
  }
};

const main = async (): Promise<void> => {
  console.log(
    `[VariantWorker] started, blocking on queue "${IMAGE_CONVERSION_QUEUE_KEY}"...`,
  );
  for (;;) {
    try {
      const result = await redis.blpop(
        IMAGE_CONVERSION_QUEUE_KEY,
        BLOCK_TIMEOUT_SECONDS,
      );
      if (!result) continue;
      await processJob(result[1]);
    } catch (err) {
      console.error('[VariantWorker] loop error:', err);
      await new Promise((resolve) => setTimeout(resolve, LOOP_ERROR_DELAY_MS));
    }
  }
};

const shutdown = (signal: string): void => {
  console.log(`[VariantWorker] received ${signal}, exiting...`);
  redis.disconnect();
  process.exit(0);
};

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

main();
