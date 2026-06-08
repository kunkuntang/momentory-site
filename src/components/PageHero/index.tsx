import classnames from 'classnames/bind';
import localStyle from './index.module.css';

const cx = classnames.bind(localStyle);

interface IPageHeroProps {
  title: string;
  description: string;
  backgroundImageUrl?: string;
}

function PageHero(props: IPageHeroProps) {
  const { title, description, backgroundImageUrl } = props;

  return (
    <section
      className={cx('page-hero', { 'with-image': Boolean(backgroundImageUrl) })}
      style={backgroundImageUrl ? { backgroundImage: `url(${backgroundImageUrl})` } : undefined}
    >
      <div className={cx('page-hero-inner')}>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
    </section>
  );
}

export default PageHero;
