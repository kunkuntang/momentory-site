import { ArrowRight } from 'lucide-react';
import type { ReactNode } from 'react';
import Link from 'next/link';
import classnames from 'classnames/bind';
import localStyle from './index.module.css';

const cx = classnames.bind(localStyle);

interface ITextLinkProps {
  children: ReactNode;
  to: string;
}

function TextLink(props: ITextLinkProps) {
  const { children, to } = props;

  return (
    <Link className={cx('text-link')} href={to}>
      <span>{children}</span>
      <ArrowRight size={16} aria-hidden="true" />
    </Link>
  );
}

export default TextLink;
