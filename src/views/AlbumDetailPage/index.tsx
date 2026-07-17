import classnames from 'classnames/bind';
import Link from 'next/link';
import AlbumAccessGate from '../../components/AlbumAccessGate';
import PageHero from '../../components/PageHero';
import type { AlbumWithPhotos } from '../../lib/repositories/albums';
import localStyle from './index.module.css';

const cx = classnames.bind(localStyle);

interface IAlbumDetailPageProps {
  album: AlbumWithPhotos;
}

function AlbumDetailPage(props: IAlbumDetailPageProps) {
  const { album } = props;

  const formatDate = (date: Date | string) => {
    const d = new Date(date);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
  };

  const gallery = (
    <div className={cx('gallery-grid')}>
      {album.photos.map((photo, index) => (
        <figure key={`${album.id}-${index}`} className={cx('photo-card')}>
          <img src={photo.image_url} alt={photo.image_alt ?? ''} loading="lazy" />
        </figure>
      ))}
    </div>
  );

  return (
    <main className={cx('page-main')}>
      <PageHero
        title={album.title}
        description={album.summary ?? ''}
        backgroundImageUrl={album.cover_image_url ?? ''}
      />
      <section className={cx('section')}>
        <div className={cx('section-inner')}>
          <Link href="/albums" className={cx('back-link')}>
            返回相册列表
          </Link>
          <div className={cx('album-head')}>
            <p className={cx('album-meta')}>
              {formatDate(album.created_at)} / {(album as any).photo_count || album.photos.length} 张照片 {album.is_private ? '/ 私密相册' : ''}
            </p>
          </div>
          {album.is_private ? (
            <AlbumAccessGate
              storageKey={`momentory.albumAccessGranted.${album.slug}`}
              title="这是一个私密相册"
              description="请输入访问密码后查看该相册内的全部图片。当前浏览器会记住这本相册的解锁状态。"
            >
              {gallery}
            </AlbumAccessGate>
          ) : (
            gallery
          )}
        </div>
      </section>
    </main>
  );
}

export default AlbumDetailPage;