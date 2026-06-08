import { Outlet } from 'react-router-dom';
import classnames from 'classnames/bind';
import Header from '../Header';
import Footer from '../Footer';
import siteData from '../../data/siteData';
import localStyle from './index.module.css';

const cx = classnames.bind(localStyle);

function Layout() {
  return (
    <div className={cx('layout')}>
      <Header logoText={siteData.site.logoText} siteName={siteData.site.name} navigation={siteData.navigation} />
      <Outlet />
      <Footer siteName={siteData.site.name} copyright={siteData.site.copyright} />
    </div>
  );
}

export default Layout;
