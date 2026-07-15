import type { ReactNode } from 'react';
import { requireAuth } from '@/lib/auth';
import Sidebar from '@/components/admin/Sidebar';
import { logoutAction } from '../logout/action';

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const session = await requireAuth();

  return (
    <div className="flex min-h-screen">
      <Sidebar session={session} />
      <div className="flex-1 flex flex-col">
        <header className="h-14 bg-white border-b border-admin-border flex items-center justify-between px-6">
          <p className="text-sm text-admin-muted">管理后台</p>
          <form action={logoutAction}>
            <button
              type="submit"
              className="text-sm text-admin-muted hover:text-admin-danger transition-colors"
            >
              退出登录
            </button>
          </form>
        </header>
        <main className="flex-1 p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
