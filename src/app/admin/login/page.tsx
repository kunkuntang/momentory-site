'use client';

import { useFormState } from 'react-dom';
import { Lock, User } from 'lucide-react';
import { loginAction, type LoginState } from './action';

const initialState: LoginState = {};

export default function LoginPage() {
  const [state, formAction] = useFormState(loginAction, initialState);

  return (
    <div className="min-h-screen flex items-center justify-center bg-admin-bg px-4">
      <div className="w-full max-w-sm">
        <div className="bg-white rounded-lg shadow-sm border border-admin-border p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-semibold text-admin-ink">Momentory</h1>
            <p className="text-sm text-admin-muted mt-1">后台管理系统</p>
          </div>

          <form action={formAction} className="space-y-4">
            {state?.error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-3 py-2 rounded-md">
                {state.error}
              </div>
            )}

            <div>
              <label htmlFor="username" className="block text-sm font-medium text-admin-ink mb-1">
                用户名
              </label>
              <div className="relative">
                <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-admin-muted" />
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  className="w-full pl-9 pr-3 py-2 border border-admin-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-admin-accent focus:border-transparent"
                  placeholder="请输入用户名"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-admin-ink mb-1">
                密码
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-admin-muted" />
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="w-full pl-9 pr-3 py-2 border border-admin-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-admin-accent focus:border-transparent"
                  placeholder="请输入密码"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-admin-accent text-white text-sm rounded-md hover:bg-admin-accent-dark transition-colors"
            >
              登录
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
