import Link from 'next/link';
import { getAllPhotos } from '@/lib/repositories/photos';
import PageHeader from '@/components/admin/PageHeader';
import DataTable, { type Column } from '@/components/admin/DataTable';
import type { PhotoWithAlbum } from '@/lib/repositories/photos';

export default function PhotosPage() {
  const photos = getAllPhotos();

  const columns: Column<PhotoWithAlbum>[] = [
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
    { key: 'title', label: '标题', render: (item) => item.title ?? '-' },
    {
      key: 'album_title',
      label: '所属相册',
      render: (item) => item.album_title ?? '-',
    },
    {
      key: 'category_name',
      label: '分类',
      render: (item) => item.category_name ?? '-',
    },
    { key: 'date', label: '日期', render: (item) => item.date ?? '-' },
    { key: 'location', label: '位置', render: (item) => item.location ?? '-' },
    {
      key: 'is_live',
      label: 'Live',
      render: (item) => (item.is_live ? '是' : '否'),
    },
    { key: 'sort_order', label: '排序' },
    {
      key: 'actions',
      label: '操作',
      render: (item) => (
        <Link
          href={`/admin/photos/${item.id}`}
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
        title="照片管理"
        action={{ label: '新建照片', href: '/admin/photos/new' }}
      />
      <DataTable columns={columns} data={photos} />
    </div>
  );
}
