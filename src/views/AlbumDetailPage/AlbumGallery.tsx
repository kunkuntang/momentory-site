'use client';

import classnames from 'classnames/bind';
import { useState } from 'react';
import Lightbox from 'yet-another-react-lightbox';
import Slideshow from 'yet-another-react-lightbox/plugins/slideshow';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';
import 'yet-another-react-lightbox/styles.css';
import type { Photo } from '../../lib/repositories/albums';
import localStyle from './index.module.css';

const cx = classnames.bind(localStyle);

interface IAlbumGalleryProps {
  photos: Photo[];
}

function AlbumGallery(props: IAlbumGalleryProps) {
  const { photos } = props;
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const slides = photos.map((photo) => ({
    src: photo.image_url,
    alt: photo.image_alt ?? '',
    title: photo.image_alt ?? undefined,
  }));

  const handlePhotoClick = (index: number) => {
    setLightboxIndex(index);
  };

  return (
    <>
      <div className={cx('gallery-grid')}>
        {photos.map((photo, index) => (
          <figure
            key={photo.id}
            className={cx('photo-card')}
            onClick={() => handlePhotoClick(index)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handlePhotoClick(index);
              }
            }}
          >
            <img src={photo.image_url} alt={photo.image_alt ?? ''} loading="lazy" />
          </figure>
        ))}
      </div>
      <Lightbox
        open={lightboxIndex !== null}
        index={lightboxIndex ?? 0}
        slides={slides}
        plugins={[Zoom, Slideshow]}
        zoom={{ maxZoomPixelRatio: 5, scrollToZoom: true }}
        slideshow={{ autoplay: false, delay: 3500 }}
        close={() => setLightboxIndex(null)}
      />
    </>
  );
}

export default AlbumGallery;
