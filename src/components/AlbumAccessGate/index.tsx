'use client';

import { FormEvent, PropsWithChildren, useEffect, useState } from 'react';
import classnames from 'classnames/bind';
import { verifyAlbumPasswordAction } from '@/lib/actions/albumAccess';
import localStyle from './index.module.css';

const cx = classnames.bind(localStyle);

interface IAlbumAccessGateProps extends PropsWithChildren {
  title?: string;
  description?: string;
  storageKey?: string;
  albumSlug?: string;
}

function AlbumAccessGate(props: IAlbumAccessGateProps) {
  const {
    children,
    title = '相册需要密码访问',
    description = '输入密码后即可查看站内相册内容。本次设备解锁后，在当前浏览器里会保持访问状态。',
    storageKey = 'momentory.albumAccessGranted',
    albumSlug,
  } = props;
  const [password, setPassword] = useState('');
  const [hasAccess, setHasAccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    const isGranted = window.sessionStorage.getItem(storageKey) === 'true';
    setHasAccess(isGranted);
  }, [storageKey]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!password) {
      return;
    }

    setIsVerifying(true);
    setErrorMessage('');

    try {
      const ok = await verifyAlbumPasswordAction(albumSlug ?? '', password);
      if (ok) {
        window.sessionStorage.setItem(storageKey, 'true');
        setHasAccess(true);
        setPassword('');
        return;
      }
      setErrorMessage('密码不正确，请重试。');
    } catch {
      setErrorMessage('校验失败，请稍后再试。');
    } finally {
      setIsVerifying(false);
    }
  };

  if (hasAccess) {
    return <>{children}</>;
  }

  return (
    <div className={cx('gate')}>
      <h3>{title}</h3>
      <p>{description}</p>
      <form className={cx('form')} onSubmit={handleSubmit}>
        <input
          className={cx('input')}
          type="password"
          autoComplete="current-password"
          placeholder="输入访问密码"
          value={password}
          onChange={(event) => {
            setPassword(event.target.value);
            if (errorMessage) {
              setErrorMessage('');
            }
          }}
          disabled={isVerifying}
        />
        <button className={cx('submit')} type="submit" disabled={isVerifying}>
          {isVerifying ? '校验中…' : '解锁相册'}
        </button>
      </form>
      {errorMessage ? <p className={cx('error')}>{errorMessage}</p> : null}
    </div>
  );
}

export default AlbumAccessGate;
