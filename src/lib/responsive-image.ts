export const RESPONSIVE_WIDTHS = [400, 800, 1200, 2400] as const;

export const DEFAULT_SIZES =
  '(max-width: 480px) 400px, (max-width: 900px) 800px, (max-width: 1400px) 1200px, 2400px';

export interface ResponsiveImage {
  avifSrcSet: string | null;
  webpSrcSet: string | null;
  sizes: string;
}

/**
 * 从原图 URL 派生 AVIF/WebP 的响应式 srcset。
 * 已知命名规则：
 *   原图  {base}/{hash}.{ext}
 *   变体  {base}/{hash}-{width}.{webp|avif}
 */
export const deriveResponsiveFromOriginalUrl = (
  originalUrl: string,
  widths: readonly number[] = RESPONSIVE_WIDTHS,
): ResponsiveImage => {
  if (!originalUrl) {
    return { avifSrcSet: null, webpSrcSet: null, sizes: DEFAULT_SIZES };
  }
  try {
    const lastSlash = originalUrl.lastIndexOf('/');
    const dir = lastSlash >= 0 ? originalUrl.slice(0, lastSlash + 1) : '';
    const filename = lastSlash >= 0 ? originalUrl.slice(lastSlash + 1) : originalUrl;

    const lastDot = filename.lastIndexOf('.');
    if (lastDot <= 0) {
      return { avifSrcSet: null, webpSrcSet: null, sizes: DEFAULT_SIZES };
    }
    const hash = filename.slice(0, lastDot);

    const buildSrc = (fmt: string) =>
      widths.map((w) => `${dir}${hash}-${w}.${fmt} ${w}w`).join(', ');

    return {
      avifSrcSet: buildSrc('avif'),
      webpSrcSet: buildSrc('webp'),
      sizes: DEFAULT_SIZES,
    };
  } catch {
    return { avifSrcSet: null, webpSrcSet: null, sizes: DEFAULT_SIZES };
  }
};
