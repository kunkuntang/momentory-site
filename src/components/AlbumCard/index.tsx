import classnames from 'classnames/bind';
import { Lock } from 'lucide-react';
import Link from 'next/link';
import localStyle from './index.module.css';
import type { Album } from '../../lib/repositories/albums';

const cx = classnames.bind(localStyle);

interface IAlbumCardProps {
  album: Album;
}

function AlbumCard(props: IAlbumCardProps) {
  const { album } = props;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
  };

  return (
    <Link href={`/albums/${album.slug}`} className={cx('album-card')}>
      <article>
        <div className={cx('album-cover')}>
          <img src={album.cover_image_url ?? ''} alt={album.cover_image_alt ?? ''} loading="lazy" />
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