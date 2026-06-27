import classnames from 'classnames/bind';
import localStyle from './index.module.css';
import PageHero from '../../components/PageHero';
import siteData from '../../data/siteData';

const cx = classnames.bind(localStyle);

function AboutPage() {
  return (
    <main className={cx('page-main')}>
      <PageHero title="关于" description="一个轻量、安静、以照片为中心的私人影像空间。" />
      <section className={cx('section')}>
        <div className={cx('section-inner', 'about-layout')}>
          <div className={cx('about-copy')}>
            <h2>{siteData.about.title}</h2>
            <p>{siteData.about.description}</p>
          </div>
          <aside className={cx('about-side')}>
            <h2>个人信息</h2>
            <div>
              <p>{siteData.about.owner}</p>
              <p>{siteData.about.location}</p>
              <p>{siteData.about.email}</p>
            </div>
            <ul>
              {siteData.about.interests.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </aside>
        </div>
      </section>
    </main>
  );
}

export default AboutPage;
