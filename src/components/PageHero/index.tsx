import classnames from 'classnames/bind';
import localStyle from './index.module.css';

const cx = classnames.bind(localStyle);

interface IPageHeroProps {
  title: string;
  description: string;
}

function PageHero(props: IPageHeroProps) {
  const { title, description } = props;

  return (
    <section className={cx('page-hero')}>
      <div className={cx('page-hero-inner')}>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
    </section>
  );
}

export default PageHero;
