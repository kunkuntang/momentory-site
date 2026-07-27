import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getPhotoById, getAllCategories } from '@/lib/repositories/photos';
import { getAllAlbums } from '@/lib/repositories/albums';
import PageHeader from '@/components/admin/PageHeader';
import SubmitButton from '@/components/admin/SubmitButton';
import DeleteButton from '@/components/admin/DeleteButton';
import EditPhotoForm from './EditPhotoForm';
import { deletePhotoAction } from '../actions';

interface EditPhotoPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditPhotoPage({ params }: EditPhotoPageProps) {
  const { id } = await params;
  const photo = await getPhotoById(Number(id));
  if (!photo) notFound();

  const albums = await getAllAlbums();
  const categories = await getAllCategories();

  return (
    <div>
      <PageHeader title="编辑照片" />
      <div className="max-w-2xl space-y-6">
        <EditPhotoForm photo={photo} albums={albums} categories={categories} />
        
        <div className="flex items-center gap-3">
          <Link
            href="/admin/photos"
            className="px-4 py-2 text-sm text-admin-muted hover:text-admin-ink transition-colors"
          >
            返回
          </Link>
        </div>

        <form
          action={deletePhotoAction}
          className="bg-white rounded-lg border border-red-200 p-6"
        >
          <h3 className="text-sm font-medium text-admin-danger mb-2">删除照片</h3>
          <p className="text-sm text-admin-muted mb-4">删除后无法恢复，请谨慎操作。</p>
          <input type="hidden" name="id" value={photo.id} />
          <DeleteButton />
        </form>
      </div>
    </div>
  );
}