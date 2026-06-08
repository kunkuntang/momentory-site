import type { ReactNode } from 'react';
import classnames from 'classnames/bind';
import localStyle from './index.module.css';

const cx = classnames.bind(localStyle);

interface ISectionHeaderProps {
  title: string;
  action?: ReactNode;
}

function SectionHeader(props: ISectionHeaderProps) {
  const { title, action } = props;

  return (
    <div className={cx('section-head')}>
      <h2 className={cx('section-title')}>{title}</h2>
      {action}
    </div>
  );
}

export default SectionHeader;
