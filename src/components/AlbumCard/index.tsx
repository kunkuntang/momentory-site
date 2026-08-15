import classnames from 'classnames/bind';
import { Lock } from 'lucide-react';
import Link from 'next/link';
import localStyle from './index.module.css';
import type { Album } from '../../lib/repositories/albums';
import { deriveResponsiveFromOriginalUrl } from '../../lib/responsive-image';

const cx = classnames.bind(localStyle);

interface IAlbumCardProps {
  album: Album;
}

function AlbumCard(props: IAlbumCardProps) {
  const { album } = props;

  const formatDate = (date: Date | string) => {
    const d = new Date(date);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
  };

  const coverResponsive = deriveResponsiveFromOriginalUrl(album.cover_image_url ?? '');

  return (
    <Link href={`/albums/${album.slug}`} className={cx('album-card')}>
      <article>
        <div className={cx('album-cover')}>
          <picture>
            {coverResponsive.avifSrcSet && (
              <source type="image/avif" srcSet={coverResponsive.avifSrcSet} sizes={coverResponsive.sizes} />
            )}
            {coverResponsive.webpSrcSet && (
              <source type="image/webp" srcSet={coverResponsive.webpSrcSet} sizes={coverResponsive.sizes} />
            )}
            <img
              src={album.cover_image_url ?? ''}
              alt={album.cover_image_alt ?? ''}
              loading="lazy"
              decoding="async"
            />
          </picture>
          {album.is_private ? (
            <span className={cx('private-badge')} aria-label="私密相册">
              <Lock size={16} strokeWidth={2.2} />
              私密相册
            </span>
          ) : null}
        </div>
        <div className={cx('album-card-body')}>
          <p className={cx('album-meta')}>
            {formatDate(album.created_at)} / {(album as any).photo_count || 0} 张照片 {album.is_private ? '/ 私密相册' : ''}
          </p>
          <h3>{album.title}</h3>
          <p>{album.summary}</p>
        </div>
      </article>
    </Link>
  );
}

export default AlbumCard;