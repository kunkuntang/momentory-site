import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getAlbumById } from '@/lib/repositories/albums';
import PageHeader from '@/components/admin/PageHeader';
import { FormField, Input, Textarea, Checkbox } from '@/components/admin/FormFields';
import SubmitButton from '@/components/admin/SubmitButton';
import DeleteButton from '@/components/admin/DeleteButton';
import { updateAlbumAction, deleteAlbumAction } from '../actions';

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
        <form action={updateAlbumAction} className="bg-white rounded-lg border border-admin-border p-6">
          <input type="hidden" name="id" value={album.id} />

          <FormField label="Slug" name="slug" hint="URL中的标识符，如 coast-light">
            <Input name="slug" defaultValue={album.slug} required />
          </FormField>

          <FormField label="标题" name="title">
            <Input name="title" defaultValue={album.title} required />
          </FormField>

          <FormField label="简介" name="summary">
            <Textarea name="summary" defaultValue={album.summary ?? ''} />
          </FormField>

          <FormField label="封面图片 URL" name="cover_image_url" hint="图片URL">
            <Input name="cover_image_url" defaultValue={album.cover_image_url ?? ''} />
          </FormField>

          <FormField label="封面图片替代文本" name="cover_image_alt">
            <Input name="cover_image_alt" defaultValue={album.cover_image_alt ?? ''} />
          </FormField>

          <div className="mb-4">
            <Checkbox name="is_private" label="私密相册" defaultChecked={!!album.is_private} />
          </div>

          <div className="flex items-center gap-3">
            <SubmitButton label="保存修改" />
            <Link
              href="/admin/albums"
              className="px-4 py-2 text-sm text-admin-muted hover:text-admin-ink transition-colors"
            >
              返回
            </Link>
          </div>
        </form>

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
