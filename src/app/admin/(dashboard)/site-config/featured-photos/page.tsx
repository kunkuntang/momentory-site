import Link from 'next/link';
import { getAllFeaturedPhotos } from '@/lib/repositories/featuredPhotos';
import PageHeader from '@/components/admin/PageHeader';
import DataTable, { type Column } from '@/components/admin/DataTable';
import type { FeaturedPhoto } from '@/lib/repositories/featuredPhotos';

export default async function FeaturedPhotosPage() {
  const photos = await getAllFeaturedPhotos();

  const columns: Column<FeaturedPhoto>[] = [
    { key: 'id', label: 'ID', className: 'w-12' },
    {
      key: 'image_url',
      label: '缩略图',
      render: (item) =>
        item.image_url ? (
          <img
            src={item.image_url}
            alt={item.image_alt ?? ''}
            className="w-10 h-10 rounded object-cover"
          />
        ) : (
          '-'
        ),
    },
    { key: 'title', label: '标题' },
    { key: 'date', label: '日期', render: (item) => item.date ?? '-' },
    { key: 'location', label: '位置', render: (item) => item.location ?? '-' },
    { key: 'sort_order', label: '排序' },
    {
      key: 'is_active',
      label: '状态',
      render: (item) => (
        <span className={item.is_active ? 'text-green-600' : 'text-red-600'}>
          {item.is_active ? '启用' : '禁用'}
        </span>
      ),
    },
    {
      key: 'actions',
      label: '操作',
      render: (item) => (
        <Link
          href={`/admin/site-config/featured-photos/${item.id}`}
          className="text-admin-accent hover:underline text-sm"
        >
          编辑
        </Link>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="精选照片"
        action={{ label: '新建精选照片', href: '/admin/site-config/featured-photos/new' }}
      />
      <DataTable columns={columns} data={photos} />
    </div>
  );
}
