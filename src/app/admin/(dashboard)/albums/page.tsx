import Link from 'next/link';
import { getAllAlbums, type AlbumWithPhotoCount } from '@/lib/repositories/albums';
import PageHeader from '@/components/admin/PageHeader';
import DataTable, { type Column } from '@/components/admin/DataTable';

export default function AlbumsPage() {
  const albums = getAllAlbums();

  const columns: Column<AlbumWithPhotoCount>[] = [
    { key: 'id', label: 'ID', className: 'w-12' },
    {
      key: 'cover_image_url',
      label: '封面',
      render: (item) =>
        item.cover_image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.cover_image_url}
            alt={item.cover_image_alt ?? ''}
            className="w-10 h-10 rounded object-cover"
          />
        ) : (
          <div className="w-10 h-10 rounded bg-admin-bg border border-admin-border" />
        ),
    },
    { key: 'slug', label: 'Slug' },
    { key: 'title', label: '标题' },
    {
      key: 'photo_count',
      label: '照片数',
      render: (item) => item.photo_count,
    },
    {
      key: 'is_private',
      label: '是否私密',
      render: (item) => (item.is_private ? '是' : '否'),
    },
    { key: 'created_at', label: '创建时间' },
    {
      key: 'actions',
      label: '操作',
      render: (item) => (
        <Link
          href={`/admin/albums/${item.id}`}
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
        title="相册管理"
        description={`共 ${albums.length} 个相册`}
        action={{ label: '新建相册', href: '/admin/albums/new' }}
      />
      <DataTable columns={columns} data={albums} />
    </div>
  );
}
