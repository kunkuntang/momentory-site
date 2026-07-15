import Link from 'next/link';
import { Users, Shield, Image, FolderOpen, Settings } from 'lucide-react';
import { getAllUsers } from '@/lib/repositories/users';
import { getAllRoles } from '@/lib/repositories/userRoles';
import { getAllPhotos } from '@/lib/repositories/photos';
import { getAllAlbums } from '@/lib/repositories/albums';
import { getAllFeaturedPhotos } from '@/lib/repositories/featuredPhotos';

export default function DashboardPage() {
  const users = getAllUsers();
  const roles = getAllRoles();
  const photos = getAllPhotos();
  const albums = getAllAlbums();
  const featured = getAllFeaturedPhotos();

  const stats = [
    { label: '用户', value: users.length, icon: Users, href: '/admin/users', color: 'text-blue-600' },
    { label: '角色', value: roles.length, icon: Shield, href: '/admin/roles', color: 'text-purple-600' },
    { label: '照片', value: photos.length, icon: Image, href: '/admin/photos', color: 'text-green-600' },
    { label: '相册', value: albums.length, icon: FolderOpen, href: '/admin/albums', color: 'text-orange-600' },
    { label: '精选照片', value: featured.length, icon: Settings, href: '/admin/site-config', color: 'text-pink-600' },
  ];

  return (
    <div>
      <h1 className="text-xl font-semibold text-admin-ink mb-6">仪表盘</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link
              key={stat.label}
              href={stat.href}
              className="bg-white rounded-lg border border-admin-border p-5 hover:shadow-sm transition-shadow"
            >
              <div className="flex items-center justify-between mb-3">
                <Icon size={20} className={stat.color} />
              </div>
              <p className="text-2xl font-semibold text-admin-ink">{stat.value}</p>
              <p className="text-sm text-admin-muted mt-1">{stat.label}</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
