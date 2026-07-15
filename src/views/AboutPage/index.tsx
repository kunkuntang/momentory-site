import classnames from 'classnames/bind';
import localStyle from './index.module.css';
import PageHero from '../../components/PageHero';

const cx = classnames.bind(localStyle);

function AboutPage() {
  return (
    <main className={cx('page-main')}>
      <PageHero title="关于" description="一个轻量、安静、以照片为中心的私人影像空间。" />
      <section className={cx('section')}>
        <div className={cx('section-inner', 'about-layout')}>
          <div className={cx('about-copy')}>
            <h2>关于 Momentory</h2>
            <p>Momentory 是一个私人照片归档网站，用来整理旅行、城市漫步和日常生活中的影像片段。网站保持轻量、留白和可持续更新，让照片拥有足够安静的观看空间。</p>
          </div>
          <aside className={cx('about-side')}>
            <h2>个人信息</h2>
            <div>
              <p>摄影记录者</p>
              <p>中国 上海</p>
              <p>hello@momentory.example</p>
            </div>
            <ul>
              <li>旅行摄影</li>
              <li>城市观察</li>
              <li>自然光</li>
              <li>影像叙事</li>
            </ul>
          </aside>
        </div>
      </section>
    </main>
  );
}

export default AboutPage;