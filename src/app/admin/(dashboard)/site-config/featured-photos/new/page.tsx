import Link from 'next/link';
import PageHeader from '@/components/admin/PageHeader';
import { FormField, Input, Textarea, Checkbox } from '@/components/admin/FormFields';
import SubmitButton from '@/components/admin/SubmitButton';
import { createFeaturedPhotoAction } from '../../actions';

export default function NewFeaturedPhotoPage() {
  return (
    <div>
      <PageHeader title="新建精选照片" />
      <div className="max-w-lg">
        <form
          action={createFeaturedPhotoAction}
          className="bg-white rounded-lg border border-admin-border p-6"
        >
          <FormField label="标题" name="title">
            <Input name="title" required placeholder="请输入标题" />
          </FormField>

          <FormField label="描述" name="description">
            <Textarea name="description" placeholder="请输入描述" />
          </FormField>

          <FormField label="日期" name="date">
            <Input name="date" type="date" />
          </FormField>

          <FormField label="位置" name="location">
            <Input name="location" placeholder="请输入位置" />
          </FormField>

          <FormField label="图片URL" name="image_url" hint="图片URL">
            <Input name="image_url" required placeholder="请输入图片URL" />
          </FormField>

          <FormField label="图片Alt" name="image_alt">
            <Input name="image_alt" placeholder="请输入图片替代文本" />
          </FormField>

          <FormField label="排序" name="sort_order">
            <Input name="sort_order" type="number" defaultValue="0" />
          </FormField>

          <div className="mb-4">
            <Checkbox name="is_active" label="启用" defaultChecked />
          </div>

          <div className="flex items-center gap-3">
            <SubmitButton label="创建精选照片" />
            <Link
              href="/admin/site-config/featured-photos"
              className="px-4 py-2 text-sm text-admin-muted hover:text-admin-ink transition-colors"
            >
              取消
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
