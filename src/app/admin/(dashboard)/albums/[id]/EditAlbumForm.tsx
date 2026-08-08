'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FormField, Input, Textarea, Checkbox } from '@/components/admin/FormFields';
import SubmitButton from '@/components/admin/SubmitButton';
import { ImageUploader } from '@/components/admin/FileUploader';
import { updateAlbumAction } from '../actions';
import type { AlbumWithPhotos } from '@/lib/repositories/albums';

interface EditAlbumFormProps {
  album: AlbumWithPhotos;
}

export default function EditAlbumForm({ album }: EditAlbumFormProps) {
  const [coverImageUrl, setCoverImageUrl] = useState(album.cover_image_url ?? '');

  const handleCoverImageChange = (url: string) => {
    setCoverImageUrl(url);
  };

  return (
    <form action={updateAlbumAction} className="bg-white rounded-lg border border-admin-border p-6 pt-0 space-y-4">
      <input type="hidden" name="id" value={album.id} />
      <input type="hidden" name="cover_image_url" value={coverImageUrl} />

      <FormField label="Slug" name="slug" hint="URL中的标识符，如 coast-light">
        <Input name="slug" defaultValue={album.slug} required />
      </FormField>

      <FormField label="标题" name="title">
        <Input name="title" defaultValue={album.title} required />
      </FormField>

      <FormField label="简介" name="summary">
        <Textarea name="summary" defaultValue={album.summary ?? ''} />
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
  );
}
