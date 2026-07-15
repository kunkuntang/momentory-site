import Link from 'next/link';
import PageHeader from '@/components/admin/PageHeader';
import { FormField, Input, Textarea, Select, Checkbox } from '@/components/admin/FormFields';
import SubmitButton from '@/components/admin/SubmitButton';
import { createCarouselItemAction } from '../../actions';

export default function NewCarouselItemPage() {
  return (
    <div>
      <PageHeader title="新建轮播项" />
      <div className="max-w-lg">
        <form
          action={createCarouselItemAction}
          className="bg-white rounded-lg border border-admin-border p-6"
        >
          <FormField label="类型" name="type">
            <Select name="type" required defaultValue="image">
              <option value="image">图片</option>
              <option value="video">视频</option>
            </Select>
          </FormField>

          <FormField label="标题" name="title">
            <Input name="title" required placeholder="请输入标题" />
          </FormField>

          <FormField label="说明文字" name="caption" hint="说明文字">
            <Textarea name="caption" placeholder="请输入说明文字" />
          </FormField>

          <FormField label="关联照片ID" name="photo_id" hint="关联照片ID，可选">
            <Input name="photo_id" type="number" placeholder="请输入关联照片ID" />
          </FormField>

          <FormField label="Live照片封面URL" name="photo_live_poster_url" hint="Live照片封面URL">
            <Input name="photo_live_poster_url" placeholder="请输入Live照片封面URL" />
          </FormField>

          <FormField label="视频URL" name="video_url" hint="视频URL">
            <Input name="video_url" placeholder="请输入视频URL" />
          </FormField>

          <FormField label="视频封面URL" name="video_poster_url" hint="视频封面URL">
            <Input name="video_poster_url" placeholder="请输入视频封面URL" />
          </FormField>

          <FormField label="日期" name="date">
            <Input name="date" type="date" />
          </FormField>

          <FormField label="位置" name="location">
            <Input name="location" placeholder="请输入位置" />
          </FormField>

          <FormField label="排序" name="sort_order">
            <Input name="sort_order" type="number" defaultValue="0" />
          </FormField>

          <div className="mb-4">
            <Checkbox name="is_active" label="启用" defaultChecked />
          </div>

          <div className="flex items-center gap-3">
            <SubmitButton label="创建轮播项" />
            <Link
              href="/admin/site-config/carousel"
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
