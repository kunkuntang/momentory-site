import type { PropsWithChildren } from 'react';
import classnames from 'classnames/bind';
import Header from '../Header';
import Footer from '../Footer';
import siteData from '../../data/siteData';
import localStyle from './index.module.css';

const cx = classnames.bind(localStyle);

function Layout(props: PropsWithChildren) {
  const { children } = props;

  return (
    <div className={cx('layout')}>
      <Header logoText={siteData.site.logoText} siteName={siteData.site.name} navigation={siteData.navigation} />
      {children}
      <Footer siteName={siteData.site.name} copyright={siteData.site.copyright} />
    </div>
  );
}

export default Layout;
