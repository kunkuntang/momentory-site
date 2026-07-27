import Link from 'next/link';
import { getAllAlbums } from '@/lib/repositories/albums';
import { getAllCategories } from '@/lib/repositories/photos';
import PageHeader from '@/components/admin/PageHeader';
import NewPhotoForm from './NewPhotoForm';

export default async function NewPhotoPage() {
  const albums = await getAllAlbums();
  const categories = await getAllCategories();

  return (
    <div>
      <PageHeader title="新建照片" />
      <div className="max-w-2xl">
        {albums.length === 0 ? (
          <div className="bg-white rounded-lg border border-admin-border p-6">
            <p className="text-admin-muted mb-4">暂无相册，请先创建相册。</p>
            <Link
              href="/admin/albums/new"
              className="px-4 py-2 bg-admin-accent text-white text-sm rounded-md hover:bg-admin-accent-dark transition-colors"
            >
              创建相册
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            <NewPhotoForm albums={albums} categories={categories} />
            <Link
              href="/admin/photos"
              className="px-4 py-2 text-sm text-admin-muted hover:text-admin-ink transition-colors"
            >
              取消
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}