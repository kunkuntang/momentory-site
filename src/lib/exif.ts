import exifr from 'exifr';

export interface ExifInfo {
  make: string;
  model: string;
  lens: string;
  fNumber: string;
  exposure: string;
  iso: string;
  focal: string;
  date: string;
}

export const emptyExif: ExifInfo = {
  make: '',
  model: '',
  lens: '',
  fNumber: '',
  exposure: '',
  iso: '',
  focal: '',
  date: '',
};

function formatExposureTime(value: number | string | undefined | null): string {
  if (value === undefined || value === null || value === '') return '';
  if (typeof value === 'string') return value;
  if (value >= 1) return `${value}s`;
  const denom = Math.round(1 / value);
  return Number.isFinite(denom) && denom > 0 ? `1/${denom}` : '';
}

function pad(n: number) {
  return n < 10 ? `0${n}` : String(n);
}

/**
 * 把 EXIF 拍摄时间转换为 <input type="date"> 需要的 YYYY-MM-DD 格式。
 * exifr 的默认选项已经把 DateTimeOriginal 解析成 Date 对象，这里按本地时区取年月日。
 * 若传入无效值，返回空字符串。
 */
function formatShotDate(value: unknown): string {
  if (!value) return '';
  let date: Date | null = null;
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    date = value;
  } else if (typeof value === 'string' || typeof value === 'number') {
    const parsed = new Date(value);
    if (!Number.isNaN(parsed.getTime())) date = parsed;
  }
  if (!date) return '';
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

/**
 * 从图片文件中读取 EXIF 拍摄信息。
 * 读取失败或图片无 EXIF 时返回空值对象。
 */
export async function readImageExif(file: File): Promise<ExifInfo> {
  try {
    const exif = await exifr.parse(file, { tiff: true, exif: true });
    if (!exif) return { ...emptyExif };
    const shotDate =
      formatShotDate(exif.DateTimeOriginal) ||
      formatShotDate(exif.DateTimeDigitized) ||
      formatShotDate(exif.DateTime);
    return {
      make: exif.Make ? String(exif.Make).trim() : '',
      model: exif.Model ? String(exif.Model).trim() : '',
      lens: exif.LensModel ? String(exif.LensModel).trim() : '',
      fNumber: exif.FNumber !== undefined ? `f/${exif.FNumber}` : '',
      exposure: formatExposureTime(exif.ExposureTime),
      iso: exif.ISO !== undefined ? String(exif.ISO) : '',
      focal: exif.FocalLength !== undefined ? `${exif.FocalLength}mm` : '',
      date: shotDate,
    };
  } catch {
    return { ...emptyExif };
  }
}

/** 将拍摄设备品牌与型号合并为展示文本 */
export function formatDevice(exif: ExifInfo): string {
  return [exif.make, exif.model].filter(Boolean).join(' ').trim();
}
