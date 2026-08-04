import { notFound } from 'next/navigation';
import { getAlbumById } from '@/lib/repositories/albums';
import PageHeader from '@/components/admin/PageHeader';
import DeleteButton from '@/components/admin/DeleteButton';
import { deleteAlbumAction } from '../actions';
import EditAlbumForm from './EditAlbumForm';

interface EditAlbumPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditAlbumPage({ params }: EditAlbumPageProps) {
  const { id } = await params;
  const album = await getAlbumById(Number(id));
  if (!album) notFound();

  return (
    <div>
      <PageHeader title="编辑相册" />
      <div className="max-w-lg space-y-6">
        <EditAlbumForm album={album} />

        <form action={deleteAlbumAction} className="bg-white rounded-lg border border-red-200 p-6">
          <h3 className="text-sm font-medium text-admin-danger mb-2">删除相册</h3>
          <p className="text-sm text-admin-muted mb-4">删除后无法恢复，请谨慎操作。</p>
          <input type="hidden" name="id" value={album.id} />
          <DeleteButton />
        </form>
      </div>
    </div>
  );
}
