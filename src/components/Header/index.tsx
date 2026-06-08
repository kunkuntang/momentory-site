import { NavLink } from 'react-router-dom';
import classnames from 'classnames/bind';
import localStyle from './index.module.css';
import type { NavigationItem } from '../../data/siteData';

const cx = classnames.bind(localStyle);

interface IHeaderProps {
  logoText: string;
  siteName: string;
  navigation: readonly NavigationItem[];
}

function Header(props: IHeaderProps) {
  const { logoText, siteName, navigation } = props;

  return (
    <header className={cx('site-header')}>
      <NavLink className={cx('brand')} to="/" aria-label={`${siteName} 首页`}>
        <span className={cx('brand-mark')}>{logoText}</span>
        <span className={cx('brand-name')}>{siteName}</span>
      </NavLink>
      <nav className={cx('site-nav')} aria-label="主导航">
        {navigation.map((item) => (
          <NavLink key={item.url} to={item.url} end={item.url === '/'}>
            {item.label}
          </NavLink>
        ))}
      </nav>
    </header>
  );
}

export default Header;
