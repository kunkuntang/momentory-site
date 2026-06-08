import { useEffect, useState } from 'react';
import classnames from 'classnames/bind';
import localStyle from './index.module.css';
import AlbumCard from '../../components/AlbumCard';
import SectionHeader from '../../components/SectionHeader';
import TextLink from '../../components/TextLink';
import siteData from '../../data/siteData';

const cx = classnames.bind(localStyle);

function HomePage() {
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % siteData.heroSlides.length);
    }, 5200);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <main>
      <section className={cx('hero')} aria-label="照片轮播">
        {siteData.heroSlides.map((slide, index) => (
          <article key={slide.title} className={cx('hero-slide', { 'is-active': index === activeSlide })}>
            <img src={slide.imageUrl} alt={slide.imageAlt} />
            <div className={cx('hero-copy')}>
              <p className={cx('eyebrow')}>
                {slide.date} / {slide.location}
              </p>
              <h1>{slide.title}</h1>
              <p>{slide.caption}</p>
            </div>
          </article>
        ))}
        <div className={cx('hero-dots')} aria-label="轮播控制">
          {siteData.heroSlides.map((slide, index) => (
            <button
              key={slide.title}
              type="button"
              className={cx({ 'is-active': index === activeSlide })}
              aria-label={`查看第 ${index + 1} 张照片`}
              aria-pressed={index === activeSlide}
              onClick={() => setActiveSlide(index)}
            />
          ))}
        </div>
      </section>

      <section className={cx('section')}>
        <div className={cx('section-inner')}>
          <SectionHeader title="最新相册" action={<TextLink to="/albums">展示更多</TextLink>} />
          <div className={cx('album-grid')}>
            {siteData.latestAlbums.map((album) => (
              <AlbumCard key={album.id} album={album} />
            ))}
          </div>
        </div>
      </section>

      <section className={cx('section', 'featured')}>
        <div className={cx('section-inner')}>
          <SectionHeader title="精选图片" />
          <div className={cx('feature-list')}>
            {siteData.featuredPhotos.map((photo) => (
              <article key={photo.title} className={cx('feature-item')}>
                <div className={cx('feature-image')}>
                  <img src={photo.imageUrl} alt={photo.imageAlt} loading="lazy" />
                </div>
                <div className={cx('feature-copy')}>
                  <p className={cx('album-meta')}>
                    {photo.date} / {photo.location}
                  </p>
                  <h3>{photo.title}</h3>
                  <p>{photo.description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={cx('section', 'profile-band')}>
        <div className={cx('section-inner')}>
          <div className={cx('profile-card')}>
            <img src={siteData.profile.avatarUrl} alt={siteData.profile.avatarAlt} loading="lazy" />
            <div>
              <p className={cx('album-meta')}>{siteData.profile.role}</p>
              <h2>{siteData.profile.name}</h2>
              <p>{siteData.profile.bio}</p>
            </div>
            <TextLink to="/about">关于</TextLink>
          </div>
        </div>
      </section>
    </main>
  );
}

export default HomePage;
