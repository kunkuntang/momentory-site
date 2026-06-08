import classnames from 'classnames/bind';
import localStyle from './index.module.css';
import AlbumCard from '../../components/AlbumCard';
import PageHero from '../../components/PageHero';
import siteData from '../../data/siteData';

const cx = classnames.bind(localStyle);

function AlbumsPage() {
  return (
    <main className={cx('page-main')}>
      <PageHero
        title="相册"
        description="按主题整理的照片集合，方便在不同时间、地点和情绪之间重新进入现场。"
        backgroundImageUrl="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1800&q=82"
      />
      <section className={cx('section')}>
        <div className={cx('section-inner')}>
          <div className={cx('album-grid')}>
            {siteData.latestAlbums.map((album) => (
              <AlbumCard key={album.id} album={album} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

export default AlbumsPage;
