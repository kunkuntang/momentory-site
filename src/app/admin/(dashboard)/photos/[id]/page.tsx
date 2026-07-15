import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getPhotoById, getAllCategories } from '@/lib/repositories/photos';
import { getAllAlbums } from '@/lib/repositories/albums';
import PageHeader from '@/components/admin/PageHeader';
import { FormField, Input, Textarea, Select, Checkbox } from '@/components/admin/FormFields';
import SubmitButton from '@/components/admin/SubmitButton';
import DeleteButton from '@/components/admin/DeleteButton';
import { updatePhotoAction, deletePhotoAction } from '../actions';

interface EditPhotoPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditPhotoPage({ params }: EditPhotoPageProps) {
  const { id } = await params;
  const photo = getPhotoById(Number(id));
  if (!photo) notFound();

  const albums = getAllAlbums();
  const categories = getAllCategories();

  return (
    <div>
      <PageHeader title="编辑照片" />
      <div className="max-w-2xl space-y-6">
        <form
          action={updatePhotoAction}
          className="bg-white rounded-lg border border-admin-border p-6 space-y-1"
        >
          <input type="hidden" name="id" value={photo.id} />

          <FormField label="所属相册" name="album_id">
            <Select name="album_id" required defaultValue={String(photo.album_id)}>
              {albums.map((album) => (
                <option key={album.id} value={String(album.id)}>
                  {album.title}
                </option>
              ))}
            </Select>
          </FormField>

          <FormField label="图片URL" name="image_url" hint="图片URL">
            <Input name="image_url" defaultValue={photo.image_url} required />
          </FormField>

          <FormField label="图片Alt" name="image_alt">
            <Input name="image_alt" defaultValue={photo.image_alt ?? ''} />
          </FormField>

          <FormField label="标题" name="title">
            <Input name="title" defaultValue={photo.title ?? ''} />
          </FormField>

          <FormField label="描述" name="description">
            <Textarea name="description" defaultValue={photo.description ?? ''} />
          </FormField>

          <FormField label="分类" name="category_id">
            <Select
              name="category_id"
              defaultValue={photo.category_id !== null ? String(photo.category_id) : ''}
            >
              <option value="">无分类</option>
              {categories.map((category) => (
                <option key={category.id} value={String(category.id)}>
                  {category.name}
                </option>
              ))}
            </Select>
          </FormField>

          <div className="mb-4">
            <Checkbox name="is_live" label="Live照片" defaultChecked={!!photo.is_live} />
          </div>

          <FormField label="Live动态视频URL" name="live_mp4_url" hint="Live动态视频URL">
            <Input name="live_mp4_url" defaultValue={photo.live_mp4_url ?? ''} />
          </FormField>

          <FormField label="日期" name="date">
            <Input name="date" type="date" defaultValue={photo.date ?? ''} />
          </FormField>

          <FormField label="位置" name="location">
            <Input name="location" defaultValue={photo.location ?? ''} />
          </FormField>

          <FormField label="排序" name="sort_order">
            <Input name="sort_order" type="number" defaultValue={String(photo.sort_order)} />
          </FormField>

          <div className="flex items-center gap-3">
            <SubmitButton label="保存修改" />
            <Link
              href="/admin/photos"
              className="px-4 py-2 text-sm text-admin-muted hover:text-admin-ink transition-colors"
            >
              返回
            </Link>
          </div>
        </form>

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
