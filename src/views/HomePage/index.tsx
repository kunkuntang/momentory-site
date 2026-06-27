'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import classnames from 'classnames/bind';
import localStyle from './index.module.css';
import AlbumCard from '../../components/AlbumCard';
import SectionHeader from '../../components/SectionHeader';
import TextLink from '../../components/TextLink';
import siteData from '../../data/siteData';

const cx = classnames.bind(localStyle);
const IMAGE_SLIDE_DURATION = 5.2;

gsap.registerPlugin(useGSAP, ScrollTrigger);

function HomePage() {
  const pageRef = useRef<HTMLElement | null>(null);
  const heroRef = useRef<HTMLElement | null>(null);
  const videoRefs = useRef<Record<number, HTMLVideoElement | null>>({});
  const imageProgressTweenRef = useRef<gsap.core.Tween | null>(null);
  const [activeSlide, setActiveSlide] = useState(0);
  const [slideProgress, setSlideProgress] = useState(0);

  const goToSlide = useCallback((index: number) => {
    setActiveSlide(index);
  }, []);

  const goToNextSlide = useCallback(() => {
    setActiveSlide((current) => (current + 1) % siteData.heroSlides.length);
  }, []);

  useGSAP(
    () => {
      const createReplayableScrollAnimation = (sectionSelector: string, itemSelector: string) => {
        const section = document.querySelector(sectionSelector);
        const items = gsap.utils.toArray<HTMLElement>(itemSelector, section);

        if (!section || items.length === 0) return;

        const resetItems = () => {
          gsap.killTweensOf(items);
          gsap.set(items, {
            y: 42,
            opacity: 0,
          });
        };

        const playItems = () => {
          gsap.killTweensOf(items);
          gsap.to(items, {
            y: 0,
            opacity: 1,
            duration: 0.86,
            ease: 'power3.out',
            stagger: 0.1,
            overwrite: true,
          });
        };

        resetItems();

        ScrollTrigger.create({
          trigger: section,
          start: 'top 78%',
          end: 'bottom 18%',
          onEnter: playItems,
          onEnterBack: playItems,
          onLeave: resetItems,
          onLeaveBack: resetItems,
        });
      };

      const createReplayableItemAnimations = (sectionSelector: string, itemSelector: string) => {
        const section = document.querySelector(sectionSelector);
        const items = gsap.utils.toArray<HTMLElement>(itemSelector, section);

        items.forEach((item) => {
          const resetItem = () => {
            gsap.killTweensOf(item);
            gsap.set(item, {
              y: 42,
              opacity: 0,
            });
          };

          const playItem = () => {
            gsap.killTweensOf(item);
            gsap.to(item, {
              y: 0,
              opacity: 1,
              duration: 0.86,
              ease: 'power3.out',
              overwrite: true,
            });
          };

          resetItem();

          ScrollTrigger.create({
            trigger: item,
            start: 'top 82%',
            end: 'bottom 12%',
            onEnter: playItem,
            onEnterBack: playItem,
            onLeave: resetItem,
            onLeaveBack: resetItem,
          });
        });
      };

      createReplayableScrollAnimation('[data-latest-albums-section]', '[data-latest-motion]');
      createReplayableItemAnimations('[data-featured-section]', '[data-featured-motion]');
    },
    { scope: pageRef },
  );

  useGSAP(
    () => {
      const profileSection = document.querySelector('[data-motion-section]');
      const profileItems = gsap.utils.toArray<HTMLElement>('[data-motion-card]', profileSection);

      if (!profileSection || profileItems.length === 0) return;

      gsap.from(profileItems, {
        y: 28,
        opacity: 0,
        duration: 0.82,
        ease: 'power3.out',
        stagger: 0.08,
        scrollTrigger: {
          trigger: profileSection,
          start: 'top 82%',
        },
      });
    },
    { scope: pageRef },
  );

  useGSAP(
    () => {
      const slides = gsap.utils.toArray<HTMLElement>('[data-hero-slide]');
      const activeElement = slides[activeSlide];

      gsap.set(slides, { autoAlpha: 0, zIndex: 0 });

      if (!activeElement) return;

      gsap.set(activeElement, { autoAlpha: 1, zIndex: 1 });
      gsap.fromTo(
        activeElement.querySelector('[data-hero-media]'),
        { scale: 1.06 },
        { scale: 1, duration: 1.3, ease: 'power2.out' },
      );
      gsap.fromTo(
        activeElement.querySelectorAll('[data-hero-copy-item]'),
        { y: 26, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.82, ease: 'power3.out', stagger: 0.09 },
      );
    },
    { dependencies: [activeSlide], scope: heroRef, revertOnUpdate: true },
  );

  useEffect(() => {
    imageProgressTweenRef.current?.kill();
    setSlideProgress(0);

    Object.values(videoRefs.current).forEach((video) => {
      video?.pause();
    });

    const slide = siteData.heroSlides[activeSlide];
    if (slide.type === 'video') {
      const video = videoRefs.current[activeSlide];
      if (!video) return undefined;

      const syncProgress = () => {
        const duration = Number.isFinite(video.duration) && video.duration > 0 ? video.duration : 0;
        setSlideProgress(duration ? video.currentTime / duration : 0);
      };

      const handleEnded = () => {
        setSlideProgress(1);
        goToNextSlide();
      };

      const handleError = () => {
        goToNextSlide();
      };

      video.currentTime = 0;
      video.muted = true;
      video.playsInline = true;
      video.addEventListener('timeupdate', syncProgress);
      video.addEventListener('ended', handleEnded);
      video.addEventListener('error', handleError);
      video.addEventListener('loadedmetadata', syncProgress);
      void video.play();

      return () => {
        video.pause();
        video.removeEventListener('timeupdate', syncProgress);
        video.removeEventListener('ended', handleEnded);
        video.removeEventListener('error', handleError);
        video.removeEventListener('loadedmetadata', syncProgress);
      };
    }

    const progressValue = { value: 0 };
    imageProgressTweenRef.current = gsap.to(progressValue, {
      value: 1,
      duration: IMAGE_SLIDE_DURATION,
      ease: 'none',
      onUpdate: () => setSlideProgress(progressValue.value),
      onComplete: goToNextSlide,
    });

    return () => {
      imageProgressTweenRef.current?.kill();
    };
  }, [activeSlide, goToNextSlide]);

  return (
    <main ref={pageRef}>
      <section ref={heroRef} className={cx('hero')} aria-label="照片轮播">
        {siteData.heroSlides.map((slide, index) => (
          <article
            key={slide.title}
            className={cx('hero-slide', { 'is-active': index === activeSlide })}
            data-hero-slide
          >
            {slide.type === 'video' ? (
              <video
                ref={(element) => {
                  videoRefs.current[index] = element;
                }}
                data-hero-media
                src={slide.videoUrl}
                poster={slide.posterImageUrl}
                muted
                playsInline
                preload="metadata"
                aria-label={slide.imageAlt}
              />
            ) : (
              <img data-hero-media src={slide.imageUrl} alt={slide.imageAlt} />
            )}
            <div className={cx('hero-copy')}>
              <p className={cx('eyebrow')} data-hero-copy-item>
                {slide.date} / {slide.location}
              </p>
              <h1 data-hero-copy-item>{slide.title}</h1>
              <p data-hero-copy-item>{slide.caption}</p>
            </div>
          </article>
        ))}
        <div
          className={cx('hero-progress', { 'is-visible': siteData.heroSlides[activeSlide].type === 'video' })}
          aria-hidden="true"
        >
          <span style={{ transform: `scaleX(${slideProgress})` }} />
        </div>
        <div className={cx('hero-dots')} aria-label="轮播控制">
          {siteData.heroSlides.map((slide, index) => (
            <button
              key={slide.title}
              type="button"
              className={cx({ 'is-active': index === activeSlide })}
              aria-label={`查看第 ${index + 1} 张照片`}
              aria-pressed={index === activeSlide}
              onClick={() => goToSlide(index)}
            />
          ))}
        </div>
      </section>

      <section className={cx('section')} data-latest-albums-section>
        <div className={cx('section-inner')}>
          <div data-latest-motion>
            <SectionHeader title="最新相册" action={<TextLink to="/albums">展示更多</TextLink>} />
          </div>
          <div className={cx('album-grid')}>
            {siteData.latestAlbums.map((album) => (
              <div key={album.id} data-latest-motion>
                <AlbumCard album={album} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={cx('section', 'featured')} data-featured-section>
        <div className={cx('section-inner')}>
          <div data-featured-motion>
            <SectionHeader title="精选图片" />
          </div>
          <div className={cx('feature-list')}>
            {siteData.featuredPhotos.map((photo, index) => (
              <article key={photo.title} className={cx('feature-item')} data-featured-motion style={{ zIndex: index + 1 }}>
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

      <section className={cx('section', 'profile-band')} data-motion-section>
        <div className={cx('section-inner')}>
          <div className={cx('profile-card')} data-motion-card>
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
