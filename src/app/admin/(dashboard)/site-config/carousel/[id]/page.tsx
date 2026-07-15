import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getCarouselItemById } from '@/lib/repositories/homeCarousel';
import PageHeader from '@/components/admin/PageHeader';
import { FormField, Input, Textarea, Select, Checkbox } from '@/components/admin/FormFields';
import SubmitButton from '@/components/admin/SubmitButton';
import DeleteButton from '@/components/admin/DeleteButton';
import { updateCarouselItemAction, deleteCarouselItemAction } from '../../actions';

interface EditCarouselItemPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditCarouselItemPage({ params }: EditCarouselItemPageProps) {
  const { id } = await params;
  const item = getCarouselItemById(Number(id));
  if (!item) notFound();

  return (
    <div>
      <PageHeader title="编辑轮播项" />
      <div className="max-w-lg space-y-6">
        <form
          action={updateCarouselItemAction}
          className="bg-white rounded-lg border border-admin-border p-6"
        >
          <input type="hidden" name="id" value={item.id} />

          <FormField label="类型" name="type">
            <Select name="type" required defaultValue={item.type}>
              <option value="image">图片</option>
              <option value="video">视频</option>
            </Select>
          </FormField>

          <FormField label="标题" name="title">
            <Input name="title" required defaultValue={item.title} placeholder="请输入标题" />
          </FormField>

          <FormField label="说明文字" name="caption" hint="说明文字">
            <Textarea name="caption" defaultValue={item.caption ?? ''} placeholder="请输入说明文字" />
          </FormField>

          <FormField label="关联照片ID" name="photo_id" hint="关联照片ID，可选">
            <Input
              name="photo_id"
              type="number"
              defaultValue={item.photo_id !== null ? String(item.photo_id) : ''}
              placeholder="请输入关联照片ID"
            />
          </FormField>

          <FormField label="Live照片封面URL" name="photo_live_poster_url" hint="Live照片封面URL">
            <Input
              name="photo_live_poster_url"
              defaultValue={item.photo_live_poster_url ?? ''}
              placeholder="请输入Live照片封面URL"
            />
          </FormField>

          <FormField label="视频URL" name="video_url" hint="视频URL">
            <Input
              name="video_url"
              defaultValue={item.video_url ?? ''}
              placeholder="请输入视频URL"
            />
          </FormField>

          <FormField label="视频封面URL" name="video_poster_url" hint="视频封面URL">
            <Input
              name="video_poster_url"
              defaultValue={item.video_poster_url ?? ''}
              placeholder="请输入视频封面URL"
            />
          </FormField>

          <FormField label="日期" name="date">
            <Input name="date" type="date" defaultValue={item.date ?? ''} />
          </FormField>

          <FormField label="位置" name="location">
            <Input name="location" defaultValue={item.location ?? ''} placeholder="请输入位置" />
          </FormField>

          <FormField label="排序" name="sort_order">
            <Input name="sort_order" type="number" defaultValue={String(item.sort_order)} />
          </FormField>

          <div className="mb-4">
            <Checkbox name="is_active" label="启用" defaultChecked={!!item.is_active} />
          </div>

          <div className="flex items-center gap-3">
            <SubmitButton label="保存修改" />
            <Link
              href="/admin/site-config/carousel"
              className="px-4 py-2 text-sm text-admin-muted hover:text-admin-ink transition-colors"
            >
              返回
            </Link>
          </div>
        </form>

        <form
          action={deleteCarouselItemAction}
          className="bg-white rounded-lg border border-red-200 p-6"
        >
          <h3 className="text-sm font-medium text-admin-danger mb-2">删除轮播项</h3>
          <p className="text-sm text-admin-muted mb-4">删除后无法恢复，请谨慎操作。</p>
          <input type="hidden" name="id" value={item.id} />
          <DeleteButton />
        </form>
      </div>
    </div>
  );
}
