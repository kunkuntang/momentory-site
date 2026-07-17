import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getFeaturedPhotoById } from '@/lib/repositories/featuredPhotos';
import PageHeader from '@/components/admin/PageHeader';
import { FormField, Input, Textarea, Checkbox } from '@/components/admin/FormFields';
import SubmitButton from '@/components/admin/SubmitButton';
import DeleteButton from '@/components/admin/DeleteButton';
import { updateFeaturedPhotoAction, deleteFeaturedPhotoAction } from '../../actions';

interface EditFeaturedPhotoPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditFeaturedPhotoPage({ params }: EditFeaturedPhotoPageProps) {
  const { id } = await params;
  const photo = await getFeaturedPhotoById(Number(id));
  if (!photo) notFound();

  return (
    <div>
      <PageHeader title="编辑精选照片" />
      <div className="max-w-lg space-y-6">
        <form
          action={updateFeaturedPhotoAction}
          className="bg-white rounded-lg border border-admin-border p-6"
        >
          <input type="hidden" name="id" value={photo.id} />

          <FormField label="标题" name="title">
            <Input name="title" required defaultValue={photo.title} placeholder="请输入标题" />
          </FormField>

          <FormField label="描述" name="description">
            <Textarea name="description" defaultValue={photo.description ?? ''} placeholder="请输入描述" />
          </FormField>

          <FormField label="日期" name="date">
            <Input name="date" type="date" defaultValue={photo.date ?? ''} />
          </FormField>

          <FormField label="位置" name="location">
            <Input name="location" defaultValue={photo.location ?? ''} placeholder="请输入位置" />
          </FormField>

          <FormField label="图片URL" name="image_url" hint="图片URL">
            <Input name="image_url" required defaultValue={photo.image_url} placeholder="请输入图片URL" />
          </FormField>

          <FormField label="图片Alt" name="image_alt">
            <Input name="image_alt" defaultValue={photo.image_alt ?? ''} placeholder="请输入图片替代文本" />
          </FormField>

          <FormField label="排序" name="sort_order">
            <Input name="sort_order" type="number" defaultValue={String(photo.sort_order)} />
          </FormField>

          <div className="mb-4">
            <Checkbox name="is_active" label="启用" defaultChecked={!!photo.is_active} />
          </div>

          <div className="flex items-center gap-3">
            <SubmitButton label="保存修改" />
            <Link
              href="/admin/site-config/featured-photos"
              className="px-4 py-2 text-sm text-admin-muted hover:text-admin-ink transition-colors"
            >
              返回
            </Link>
          </div>
        </form>

        <form
          action={deleteFeaturedPhotoAction}
          className="bg-white rounded-lg border border-red-200 p-6"
        >
          <h3 className="text-sm font-medium text-admin-danger mb-2">删除精选照片</h3>
          <p className="text-sm text-admin-muted mb-4">删除后无法恢复，请谨慎操作。</p>
          <input type="hidden" name="id" value={photo.id} />
          <DeleteButton />
        </form>
      </div>
    </div>
  );
}
