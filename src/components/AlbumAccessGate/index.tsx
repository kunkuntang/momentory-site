import { FormEvent, PropsWithChildren, useEffect, useState } from 'react';
import classnames from 'classnames/bind';
import localStyle from './index.module.css';

const cx = classnames.bind(localStyle);
const ACCESS_STORAGE_KEY = 'momentory.albumAccessGranted';
const configuredPassword = import.meta.env.VITE_ALBUM_PASSWORD?.trim() ?? '';

interface IAlbumAccessGateProps extends PropsWithChildren {
  title?: string;
  description?: string;
}

function AlbumAccessGate(props: IAlbumAccessGateProps) {
  const {
    children,
    title = '相册需要密码访问',
    description = '输入密码后即可查看站内相册内容。本次设备解锁后，在当前浏览器里会保持访问状态。',
  } = props;
  const [password, setPassword] = useState('');
  const [hasAccess, setHasAccess] = useState(!configuredPassword);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (!configuredPassword) {
      setHasAccess(true);
      return;
    }

    const isGranted = window.sessionStorage.getItem(ACCESS_STORAGE_KEY) === 'true';
    setHasAccess(isGranted);
  }, []);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (password === configuredPassword) {
      window.sessionStorage.setItem(ACCESS_STORAGE_KEY, 'true');
      setHasAccess(true);
      setErrorMessage('');
      setPassword('');
      return;
    }

    setErrorMessage('密码不正确，请重试。');
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
        />
        <button className={cx('submit')} type="submit">
          解锁相册
        </button>
      </form>
      {errorMessage ? <p className={cx('error')}>{errorMessage}</p> : null}
    </div>
  );
}

export default AlbumAccessGate;
