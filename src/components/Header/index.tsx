'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
  const pathname = usePathname();

  return (
    <header className={cx('site-header')}>
      <Link className={cx('brand')} href="/" aria-label={`${siteName} 首页`}>
        <span className={cx('brand-mark')}>{logoText}</span>
        <span className={cx('brand-name')}>{siteName}</span>
      </Link>
      <nav className={cx('site-nav')} aria-label="主导航">
        {navigation.map((item) => (
          <Link
            key={item.url}
            className={cx({ active: pathname === item.url })}
            href={item.url}
            aria-current={pathname === item.url ? 'page' : undefined}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}

export default Header;
