import classnames from 'classnames/bind';
import localStyle from './index.module.css';
import type { Album } from '../../data/siteData';

const cx = classnames.bind(localStyle);

interface IAlbumCardProps {
  album: Album;
}

function AlbumCard(props: IAlbumCardProps) {
  const { album } = props;

  return (
    <article className={cx('album-card')}>
      <img src={album.coverImageUrl} alt={album.coverImageAlt} loading="lazy" />
      <div className={cx('album-card-body')}>
        <p className={cx('album-meta')}>
          {album.date} / {album.photoCount} 张照片
        </p>
        <h3>{album.title}</h3>
        <p>{album.summary}</p>
      </div>
    </article>
  );
}

export default AlbumCard;
