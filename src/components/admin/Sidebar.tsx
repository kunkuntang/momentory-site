'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  Shield,
  Image,
  FolderOpen,
  Settings,
} from 'lucide-react';
import type { Session } from '@/lib/auth';

interface SidebarProps {
  session: Session;
}

const navItems = [
  { label: '仪表盘', href: '/admin', icon: LayoutDashboard, permission: null },
  { label: '用户管理', href: '/admin/users', icon: Users, permission: 'users' },
  { label: '角色管理', href: '/admin/roles', icon: Shield, permission: 'roles' },
  { label: '照片管理', href: '/admin/photos', icon: Image, permission: 'photos' },
  { label: '相册管理', href: '/admin/albums', icon: FolderOpen, permission: 'albums' },
  { label: '站点信息', href: '/admin/site-config', icon: Settings, permission: 'site-config' },
];

export default function Sidebar({ session }: SidebarProps) {
  const pathname = usePathname();

  const visibleItems = navItems.filter((item) => {
    if (!item.permission) return true;
    return session.permissions.includes('*') || session.permissions.includes(item.permission);
  });

  return (
    <aside className="w-60 min-h-screen bg-white border-r border-admin-border flex flex-col">
      <div className="px-6 py-5 border-b border-admin-border">
        <h1 className="text-lg font-semibold text-admin-ink">Momentory</h1>
        <p className="text-xs text-admin-muted mt-0.5">后台管理系统</p>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1">
        {visibleItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.href === '/admin'
              ? pathname === '/admin'
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                isActive
                  ? 'bg-admin-accent text-white'
                  : 'text-admin-muted hover:bg-admin-bg hover:text-admin-ink'
              }`}
            >
              <Icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="px-3 py-4 border-t border-admin-border">
        <p className="px-3 text-xs text-admin-muted">当前用户</p>
        <p className="px-3 text-sm font-medium text-admin-ink">{session.username}</p>
      </div>
    </aside>
  );
}
