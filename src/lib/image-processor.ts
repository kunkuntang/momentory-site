import sharp from 'sharp';
import crypto from 'crypto';

export const IMAGE_SIZES = [
  { width: 400, height: 267, label: 'thumbnail' },
  { width: 800, height: 533, label: 'small' },
  { width: 1200, height: 800, label: 'medium' },
  { width: 2400, height: 1600, label: 'large' },
] as const;

export type ImageFormat = 'webp' | 'avif';
export type ImageSize = (typeof IMAGE_SIZES)[number];

export interface ProcessedImageVariant {
  key: string;
  buffer: Buffer;
  width: number;
  height: number;
  format: string;
  contentType: string;
  sizeBytes: number;
}

export interface ProcessedImageResult {
  contentHash: string;
  originalExt: string;
  original: ProcessedImageVariant;
  variants: ProcessedImageVariant[];
}

const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/avif',
  'image/gif',
  'image/tiff',
  'image/bmp',
];

const MAX_FILE_SIZE = 50 * 1024 * 1024;

const CACHE_CONTROL_IMMUTABLE = 'public, max-age=31536000, immutable';

export const getCacheControl = (): string => CACHE_CONTROL_IMMUTABLE;

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

export const validateImage = (file: File): ValidationResult => {
  if (!file) {
    return { valid: false, error: '请选择要上传的文件' };
  }
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: `不支持的图片格式: ${file.type}。支持的格式: JPEG, PNG, WebP, AVIF, GIF, TIFF, BMP`,
    };
  }
  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `文件过大: ${(file.size / 1024 / 1024).toFixed(2)}MB，最大支持 ${MAX_FILE_SIZE / 1024 / 1024}MB`,
    };
  }
  return { valid: true };
};

export const computeContentHash = (buffer: Buffer): string => {
  return crypto.createHash('sha256').update(buffer).digest('hex');
};

const getContentType = (format: string): string => {
  switch (format) {
    case 'webp':
      return 'image/webp';
    case 'avif':
      return 'image/avif';
    case 'jpeg':
    case 'jpg':
      return 'image/jpeg';
    case 'png':
      return 'image/png';
    case 'gif':
      return 'image/gif';
    default:
      return `image/${format}`;
  }
};

const getExtFromMime = (mime: string): string => {
  switch (mime) {
    case 'image/jpeg':
      return 'jpg';
    case 'image/png':
      return 'png';
    case 'image/webp':
      return 'webp';
    case 'image/avif':
      return 'avif';
    case 'image/gif':
      return 'gif';
    case 'image/tiff':
      return 'tiff';
    case 'image/bmp':
      return 'bmp';
    default:
      return 'bin';
  }
};

const buildVariantKey = (
  contentHash: string,
  width: number,
  format: string,
): string => `${contentHash}-${width}.${format}`;

const buildOriginalKey = (contentHash: string, ext: string): string =>
  `${contentHash}.${ext}`;

export interface ImageUrls {
  original: string;
  webp: Record<number, string>;
  avif: Record<number, string>;
  widths: number[];
}

export const buildImageUrls = (
  baseUrlFn: (key: string) => string,
  contentHash: string,
  originalExt: string,
): ImageUrls => {
  const widths = IMAGE_SIZES.map((s) => s.width);
  const webp: Record<number, string> = {};
  const avif: Record<number, string> = {};
  for (const size of IMAGE_SIZES) {
    webp[size.width] = baseUrlFn(buildVariantKey(contentHash, size.width, 'webp'));
    avif[size.width] = baseUrlFn(buildVariantKey(contentHash, size.width, 'avif'));
  }
  return {
    original: baseUrlFn(buildOriginalKey(contentHash, originalExt)),
    webp,
    avif,
    widths,
  };
};

export const buildSrcSet = (
  urlsByWidth: Record<number, string>,
): string => {
  return IMAGE_SIZES.map((s) => `${urlsByWidth[s.width]} ${s.width}w`).join(', ');
};

export const buildSizesAttr = (): string =>
  '(max-width: 480px) 400px, (max-width: 900px) 800px, (max-width: 1400px) 1200px, 2400px';

export const VARIANT_FORMATS = [
  { format: 'webp' as const, quality: 80, contentType: 'image/webp' },
  { format: 'avif' as const, quality: 60, contentType: 'image/avif' },
];

export const resolveOriginalExt = (file: File): string =>
  file.name.split('.').pop() || getExtFromMime(file.type);

export interface ExpectedVariantKey {
  key: string;
  width: number;
  height: number;
  format: ImageFormat;
  contentType: string;
}

export const buildExpectedKeys = (
  contentHash: string,
  originalExt: string,
): { original: string; variants: ExpectedVariantKey[] } => {
  const variants: ExpectedVariantKey[] = [];
  for (const fmt of VARIANT_FORMATS) {
    for (const size of IMAGE_SIZES) {
      variants.push({
        key: buildVariantKey(contentHash, size.width, fmt.format),
        width: size.width,
        height: size.height,
        format: fmt.format,
        contentType: fmt.contentType,
      });
    }
  }
  return { original: buildOriginalKey(contentHash, originalExt), variants };
};

export const getImageMetadata = async (
  buffer: Buffer,
): Promise<{ width: number; height: number }> => {
  const meta = await sharp(buffer, { failOn: 'none' }).metadata();
  return { width: meta.width ?? 0, height: meta.height ?? 0 };
};

export const processImage = async (
  buffer: Buffer,
  file: File,
): Promise<ProcessedImageResult> => {
  const startTime = Date.now();
  const contentHash = computeContentHash(buffer);
  const originalExt =
    file.name.split('.').pop() || getExtFromMime(file.type);

  const originalPipeline = sharp(buffer, { failOn: 'none' });
  const originalMeta = await originalPipeline.metadata();
  const originalContentType = file.type || getContentType(originalExt);

  const original: ProcessedImageVariant = {
    key: buildOriginalKey(contentHash, originalExt),
    buffer,
    width: originalMeta.width ?? 0,
    height: originalMeta.height ?? 0,
    format: originalExt,
    contentType: originalContentType,
    sizeBytes: buffer.length,
  };

  console.log(
    `[ImageProcessor] contentHash=${contentHash.substring(0, 12)}... original=${original.width}x${original.height} size=${(buffer.length / 1024).toFixed(1)}KB format=${originalExt}`,
  );

  const variants: ProcessedImageVariant[] = [];

  const tasks: Array<Promise<void>> = [];

  for (const fmt of VARIANT_FORMATS) {
    for (const size of IMAGE_SIZES) {
      tasks.push(
        (async () => {
          try {
            let encodePipeline;
            if (fmt.format === 'webp') {
              encodePipeline = sharp(buffer, { failOn: 'none' })
                .rotate()
                .resize(size.width, size.height, {
                  fit: 'cover',
                  withoutEnlargement: false,
                })
                .webp({
                  quality: fmt.quality,
                  effort: 6,
                  alphaQuality: 90,
                  smartSubsample: true,
                });
            } else {
              encodePipeline = sharp(buffer, { failOn: 'none' })
                .rotate()
                .resize(size.width, size.height, {
                  fit: 'cover',
                  withoutEnlargement: false,
                })
                .avif({
                  quality: fmt.quality,
                  effort: 8,
                  chromaSubsampling: '4:2:0',
                });
            }

            const { data, info } = await encodePipeline.toBuffer({
              resolveWithObject: true,
            });

            const variant: ProcessedImageVariant = {
              key: buildVariantKey(contentHash, size.width, fmt.format),
              buffer: data,
              width: info.width,
              height: info.height,
              format: fmt.format,
              contentType: fmt.contentType,
              sizeBytes: data.length,
            };

            variants.push(variant);
            console.log(
              `[ImageProcessor] generated ${fmt.format}-${size.label} ${info.width}x${info.height} size=${(data.length / 1024).toFixed(1)}KB key=${variant.key}`,
            );
          } catch (err) {
            console.error(
              `[ImageProcessor] ERROR generating ${fmt.format}-${size.label}:`,
              err,
            );
            throw err;
          }
        })(),
      );
    }
  }

  await Promise.all(tasks);

  const totalKB =
    variants.reduce((sum, v) => sum + v.sizeBytes, 0) / 1024 +
    buffer.length / 1024;
  const elapsed = Date.now() - startTime;
  console.log(
    `[ImageProcessor] done: 1 original + ${variants.length} variants, total=${totalKB.toFixed(1)}KB, elapsed=${elapsed}ms`,
  );

  return {
    contentHash,
    originalExt,
    original,
    variants,
  };
};
