import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { uploadBuffer, getFileUrl } from '@/lib/cos';
import {
  validateImage,
  processImage,
  getCacheControl,
  buildImageUrls,
  buildSrcSet,
  buildSizesAttr,
  IMAGE_SIZES,
} from '@/lib/image-processor';
const crypto = require('crypto');

export const runtime = 'nodejs';
export const maxDuration = 60;

export interface UploadResponseData {
  contentHash: string;
  original: {
    url: string;
    key: string;
    width: number;
    height: number;
    sizeBytes: number;
    format: string;
  };
  variants: Array<{
    key: string;
    url: string;
    width: number;
    height: number;
    format: string;
    sizeBytes: number;
    contentType: string;
  }>;
  urls: ReturnType<typeof buildImageUrls>;
  srcset: {
    webp: string;
    avif: string;
  };
  sizes: string;
  widths: number[];
}

export async function POST(request: Request) {
  const requestId = crypto.randomBytes(6).toString('hex');
  const logPrefix = `[Upload:${requestId}]`;
  const startTime = Date.now();

  try {
    await requireAuth();
    console.log(`${logPrefix} auth OK`);

    const formData = await request.formData();
    const file = formData.get('file') as File;

    const validation = validateImage(file);
    if (!validation.valid) {
      console.warn(`${logPrefix} validation failed: ${validation.error}`);
      return NextResponse.json(
        { success: false, message: validation.error },
        { status: 400 },
      );
    }

    console.log(
      `${logPrefix} received file: name=${file.name} type=${file.type} size=${(file.size / 1024).toFixed(1)}KB`,
    );

    const buffer = Buffer.from(await file.arrayBuffer());

    const processed = await processImage(buffer, file);
    const { contentHash, originalExt, original, variants } = processed;

    console.log(
      `${logPrefix} processing done: hash=${contentHash.substring(0, 12)}... variants=${variants.length}`,
    );

    const cacheControl = getCacheControl();
    const uploadTasks: Array<Promise<void>> = [];

    uploadTasks.push(
      (async () => {
        const t0 = Date.now();
        await uploadBuffer(original.buffer, original.key, {
          CacheControl: cacheControl,
          ContentType: original.contentType,
        });
        console.log(
          `${logPrefix} uploaded original ${original.key} in ${Date.now() - t0}ms (${(original.sizeBytes / 1024).toFixed(1)}KB)`,
        );
      })(),
    );

    for (const v of variants) {
      uploadTasks.push(
        (async () => {
          const t0 = Date.now();
          try {
            await uploadBuffer(v.buffer, v.key, {
              CacheControl: cacheControl,
              ContentType: v.contentType,
            });
            console.log(
              `${logPrefix} uploaded variant ${v.key} in ${Date.now() - t0}ms (${(v.sizeBytes / 1024).toFixed(1)}KB)`,
            );
          } catch (e) {
            console.error(
              `${logPrefix} FAILED to upload variant ${v.key}:`,
              e,
            );
            throw e;
          }
        })(),
      );
    }

    const uploadStart = Date.now();
    await Promise.all(uploadTasks);
    console.log(
      `${logPrefix} all uploads finished in ${Date.now() - uploadStart}ms`,
    );

    const urls = buildImageUrls(getFileUrl, contentHash, originalExt);
    const responseData: UploadResponseData = {
      contentHash,
      original: {
        url: getFileUrl(original.key),
        key: original.key,
        width: original.width,
        height: original.height,
        sizeBytes: original.sizeBytes,
        format: original.format,
      },
      variants: variants.map((v) => ({
        key: v.key,
        url: getFileUrl(v.key),
        width: v.width,
        height: v.height,
        format: v.format,
        sizeBytes: v.sizeBytes,
        contentType: v.contentType,
      })),
      urls,
      srcset: {
        webp: buildSrcSet(urls.webp),
        avif: buildSrcSet(urls.avif),
      },
      sizes: buildSizesAttr(),
      widths: IMAGE_SIZES.map((s) => s.width),
    };

    const totalMs = Date.now() - startTime;
    console.log(
      `${logPrefix} SUCCESS total=${totalMs}ms result: original=${responseData.original.width}x${responseData.original.height}, variants=${responseData.variants.length}`,
    );

    return NextResponse.json({
      success: true,
      data: responseData,
    });
  } catch (error) {
    const totalMs = Date.now() - startTime;
    console.error(
      `${logPrefix} FAILED after ${totalMs}ms:`,
      error instanceof Error ? error.message : String(error),
      error,
    );
    return NextResponse.json(
      { success: false, message: '上传失败，请稍后重试' },
      { status: 500 },
    );
  }
}
