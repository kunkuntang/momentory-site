import Link from 'next/link';
import { getAllAlbums } from '@/lib/repositories/albums';
import { getAllCategories } from '@/lib/repositories/photos';
import PageHeader from '@/components/admin/PageHeader';
import { FormField, Input, Textarea, Select, Checkbox } from '@/components/admin/FormFields';
import SubmitButton from '@/components/admin/SubmitButton';
import { createPhotoAction } from '../actions';

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
          <form
            action={createPhotoAction}
            className="bg-white rounded-lg border border-admin-border p-6 space-y-1"
          >
            <FormField label="所属相册" name="album_id">
              <Select name="album_id" required>
                {albums.map((album) => (
                  <option key={album.id} value={album.id}>
                    {album.title}
                  </option>
                ))}
              </Select>
            </FormField>

          <FormField label="图片URL" name="image_url" hint="图片URL">
            <Input name="image_url" required placeholder="请输入图片URL" />
          </FormField>

          <FormField label="图片Alt" name="image_alt">
            <Input name="image_alt" placeholder="请输入图片替代文本" />
          </FormField>

          <FormField label="标题" name="title">
            <Input name="title" placeholder="请输入标题" />
          </FormField>

          <FormField label="描述" name="description">
            <Textarea name="description" placeholder="请输入描述" />
          </FormField>

          <FormField label="分类" name="category_id">
            <Select name="category_id">
              <option value="">无分类</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </Select>
          </FormField>

          <div className="mb-4">
            <Checkbox name="is_live" label="Live照片" />
          </div>

          <FormField label="Live动态视频URL" name="live_mp4_url" hint="Live动态视频URL">
            <Input name="live_mp4_url" placeholder="请输入Live动态视频URL" />
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

          <div className="flex items-center gap-3">
            <SubmitButton label="创建照片" />
            <Link
              href="/admin/photos"
              className="px-4 py-2 text-sm text-admin-muted hover:text-admin-ink transition-colors"
            >
              取消
            </Link>
          </div>
          </form>
        )}
      </div>
    </div>
  );
}
