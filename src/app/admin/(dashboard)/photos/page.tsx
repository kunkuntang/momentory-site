import Link from 'next/link';
import { getAllPhotos, getAllCategories } from '@/lib/repositories/photos';
import { getAllAlbums } from '@/lib/repositories/albums';
import PageHeader from '@/components/admin/PageHeader';
import DataTable, { type Column } from '@/components/admin/DataTable';
import type { PhotoWithAlbum } from '@/lib/repositories/photos';
import PhotoFilters from './PhotoFilters';

export default async function PhotosPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const search = typeof params.search === 'string' ? params.search : '';
  const albumId = typeof params.albumId === 'string' ? params.albumId : '';
  const categoryId = typeof params.categoryId === 'string' ? params.categoryId : '';

  const [photos, albums, categories] = await Promise.all([
    getAllPhotos({
      search,
      albumId: albumId ? Number(albumId) : null,
      categoryId: categoryId ? Number(categoryId) : null,
    }),
    getAllAlbums(),
    getAllCategories(),
  ]);

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
        description={`共 ${photos.length} 张照片`}
        action={{ label: '新建照片', href: '/admin/photos/new' }}
      />
      <PhotoFilters
        albums={albums.map((a) => ({ id: a.id, title: a.title }))}
        categories={categories.map((c) => ({ id: c.id, name: c.name }))}
        initialSearch={search}
        initialAlbumId={albumId}
        initialCategoryId={categoryId}
      />
      <DataTable columns={columns} data={photos} />
    </div>
  );
}
