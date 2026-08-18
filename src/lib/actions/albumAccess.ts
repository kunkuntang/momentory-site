'use server';

import { getAlbumBySlug } from '../repositories/albums';
import { verifyPassword } from '../auth';

/**
 * 校验私密相册访问密码。
 * 优先使用相册自身的 password_hash；若未配置则回退到全局 NEXT_PUBLIC_ALBUM_PASSWORD 环境变量。
 */
export async function verifyAlbumPasswordAction(
  slug: string,
  password: string,
): Promise<boolean> {
  if (!slug || !password) return false;

  const album = await getAlbumBySlug(slug);
  if (!album || !album.is_private) return false;

  if (album.password_hash) {
    return verifyPassword(password, album.password_hash);
  }

  const globalPassword = process.env.NEXT_PUBLIC_ALBUM_PASSWORD?.trim() ?? '';
  return globalPassword ? password === globalPassword : false;
}
