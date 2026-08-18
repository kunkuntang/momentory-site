'use client';

import { useState } from 'react';
import Link from 'next/link';
import PageHeader from '@/components/admin/PageHeader';
import { FormField, Input, Textarea, Checkbox } from '@/components/admin/FormFields';
import SubmitButton from '@/components/admin/SubmitButton';
import { ImageUploader } from '@/components/admin/FileUploader';
import { createAlbumAction } from '../actions';

export default function NewAlbumPage() {
  const [coverImageUrl, setCoverImageUrl] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);

  const handleCoverImageChange = (url: string) => {
    setCoverImageUrl(url);
  };

  return (
    <div>
      <PageHeader title="新建相册" />
      <div className="max-w-lg">
        <form action={createAlbumAction} className="bg-white rounded-lg border border-admin-border p-6 pt-0 space-y-4">
          <input type="hidden" name="cover_image_url" value={coverImageUrl} />

          <FormField label="Slug" name="slug" hint="URL中的标识符，如 coast-light">
            <Input name="slug" required placeholder="coast-light" />
          </FormField>

          <FormField label="标题" name="title">
            <Input name="title" required placeholder="请输入相册标题" />
          </FormField>

          <FormField label="简介" name="summary">
            <Textarea name="summary" placeholder="请输入相册简介" />
          </FormField>

          <ImageUploader
            label="封面图片"
            name="cover_image"
            value={coverImageUrl}
            onChange={handleCoverImageChange}
            maxSize={10 * 1024 * 1024}
            hint="支持 JPG、PNG、GIF、WebP 格式，最大 10MB"
          />

          <FormField label="封面图片替代文本" name="cover_image_alt">
            <Input name="cover_image_alt" placeholder="封面图片描述" />
          </FormField>

          <FormField label="相册属性" name="album_properties">
            <div className="space-y-3">
              <Checkbox name="is_private" label="私密相册" checked={isPrivate} onChange={setIsPrivate} />
              <Checkbox name="is_hidden" label="隐藏相册" />
              {isPrivate ? (
                <Input
                  name="password"
                  type="password"
                  placeholder="请输入私密相册访问密码"
                  autoComplete="new-password"
                />
              ) : null}
            </div>
            <p className="text-xs text-admin-muted mt-1">
              私密相册需要访问密码才能查看；隐藏相册不会出现在首页和相册列表中，仅可通过链接访问。
            </p>
          </FormField>

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
