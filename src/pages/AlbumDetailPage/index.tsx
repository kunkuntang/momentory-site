import classnames from 'classnames/bind';
import { Link, Navigate, useParams } from 'react-router-dom';
import AlbumAccessGate from '../../components/AlbumAccessGate';
import PageHero from '../../components/PageHero';
import { findAlbumById } from '../../data/siteData';
import localStyle from './index.module.css';

const cx = classnames.bind(localStyle);

function AlbumDetailPage() {
  const { albumId = '' } = useParams();
  const album = findAlbumById(albumId);

  if (!album) {
    return <Navigate to="/albums" replace />;
  }

  const gallery = (
    <div className={cx('gallery-grid')}>
      {album.photos.map((photo, index) => (
        <figure key={`${album.id}-${index}`} className={cx('photo-card')}>
          <img src={photo.imageUrl} alt={photo.imageAlt} loading="lazy" />
        </figure>
      ))}
    </div>
  );

  return (
    <main className={cx('page-main')}>
      <PageHero
        title={album.title}
        description={album.summary}
        backgroundImageUrl={album.coverImageUrl}
      />
      <section className={cx('section')}>
        <div className={cx('section-inner')}>
          <Link to="/albums" className={cx('back-link')}>
            返回相册列表
          </Link>
          <div className={cx('album-head')}>
            <p className={cx('album-meta')}>
              {album.date} / {album.photoCount} 张照片 {album.isPrivate ? '/ 私密相册' : ''}
            </p>
          </div>
          {album.isPrivate ? (
            <AlbumAccessGate
              storageKey={`momentory.albumAccessGranted.${album.id}`}
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
