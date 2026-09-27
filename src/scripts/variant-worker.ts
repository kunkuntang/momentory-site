import 'dotenv/config';
import { Worker } from 'bullmq';
import { getObjectBuffer, uploadBuffer } from '@/lib/cos';
import { processImage, getCacheControl } from '@/lib/image-processor';
import { IMAGE_CONVERSION_QUEUE_NAME, type ImageConversionJob } from '@/lib/image-queue';

const connectionConfig = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379', 10),
  username: process.env.REDIS_USERNAME || undefined,
  password: process.env.REDIS_PASSWORD || undefined,
  db: parseInt(process.env.REDIS_DB || '0', 10),
  maxRetriesPerRequest: null,
};

const worker = new Worker(
  IMAGE_CONVERSION_QUEUE_NAME,
  async (job) => {
    const { contentHash, originalKey, contentType } = job.data as ImageConversionJob;
    const hashShort = contentHash.substring(0, 12);
    const attempts = job.attemptsStarted ?? 1;

    console.log(
      `[VariantWorker] processing hash=${hashShort}... attempt=${attempts}/${job.opts.attempts} originalKey=${originalKey}`,
    );
    const startTime = Date.now();

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
  },
  {
    connection: connectionConfig,
    prefix: 'bull',
    // 单个 CPU 密集型任务一个 worker 足够，多 worker 可并行但 sharp 会竞争 CPU
    concurrency: 1,
  },
);

worker.on('completed', (job) => {
  console.log(`[VariantWorker] job ${job?.id} completed`);
});

worker.on('failed', (job, err) => {
  const hashShort = (job?.data as ImageConversionJob | undefined)?.contentHash?.substring(0, 12) ?? '?';
  console.error(
    `[VariantWorker] job ${job?.id} (hash=${hashShort}) failed after ${job?.attemptsStarted} attempts:`,
    err,
  );
});

const shutdown = async (signal: string): Promise<void> => {
  console.log(`[VariantWorker] received ${signal}, closing worker...`);
  await worker.close();
  process.exit(0);
};

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

console.log('[VariantWorker] started');
