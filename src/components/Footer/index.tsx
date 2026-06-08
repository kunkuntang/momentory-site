import classnames from 'classnames/bind';
import localStyle from './index.module.css';

const cx = classnames.bind(localStyle);

interface IFooterProps {
  siteName: string;
  copyright: string;
}

function Footer(props: IFooterProps) {
  const { siteName, copyright } = props;

  return (
    <footer className={cx('site-footer')}>
      <span>{siteName}</span>
      <span>{copyright}</span>
    </footer>
  );
}

export default Footer;
