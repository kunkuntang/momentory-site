import classnames from 'classnames/bind';
import { Lock } from 'lucide-react';
import Link from 'next/link';
import localStyle from './index.module.css';
import type { Album } from '../../data/siteData';

const cx = classnames.bind(localStyle);

interface IAlbumCardProps {
  album: Album;
}

function AlbumCard(props: IAlbumCardProps) {
  const { album } = props;

  return (
    <Link href={`/albums/${album.id}`} className={cx('album-card')}>
      <article>
        <div className={cx('album-cover')}>
          <img src={album.coverImageUrl} alt={album.coverImageAlt} loading="lazy" />
          {album.isPrivate ? (
            <span className={cx('private-badge')} aria-label="私密相册">
              <Lock size={16} strokeWidth={2.2} />
              私密相册
            </span>
          ) : null}
        </div>
        <div className={cx('album-card-body')}>
          <p className={cx('album-meta')}>
            {album.date} / {album.photoCount} 张照片 {album.isPrivate ? '/ 私密相册' : ''}
          </p>
          <h3>{album.title}</h3>
          <p>{album.summary}</p>
        </div>
      </article>
    </Link>
  );
}

export default AlbumCard;
