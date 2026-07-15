import Link from 'next/link';
import PageHeader from '@/components/admin/PageHeader';
import { FormField, Input, Textarea, Checkbox } from '@/components/admin/FormFields';
import SubmitButton from '@/components/admin/SubmitButton';
import { createAlbumAction } from '../actions';

export default function NewAlbumPage() {
  return (
    <div>
      <PageHeader title="新建相册" />
      <div className="max-w-lg">
        <form action={createAlbumAction} className="bg-white rounded-lg border border-admin-border p-6">
          <FormField label="Slug" name="slug" hint="URL中的标识符，如 coast-light">
            <Input name="slug" required placeholder="coast-light" />
          </FormField>

          <FormField label="标题" name="title">
            <Input name="title" required placeholder="请输入相册标题" />
          </FormField>

          <FormField label="简介" name="summary">
            <Textarea name="summary" placeholder="请输入相册简介" />
          </FormField>

          <FormField label="封面图片 URL" name="cover_image_url" hint="图片URL">
            <Input name="cover_image_url" placeholder="https://..." />
          </FormField>

          <FormField label="封面图片替代文本" name="cover_image_alt">
            <Input name="cover_image_alt" placeholder="封面图片描述" />
          </FormField>

          <div className="mb-4">
            <Checkbox name="is_private" label="私密相册" />
          </div>

          <div className="flex items-center gap-3">
            <SubmitButton label="创建相册" />
            <Link
              href="/admin/albums"
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
