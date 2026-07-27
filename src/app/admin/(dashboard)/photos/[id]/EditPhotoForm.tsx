'use client';

import { useState } from 'react';
import { FormField, Input, Textarea, Select, Checkbox } from '@/components/admin/FormFields';
import SubmitButton from '@/components/admin/SubmitButton';
import { ImageUploader } from '@/components/admin/FileUploader';
import { updatePhotoAction } from '../actions';
import type { Photo } from '../../../../../../prisma/generated/client/client';

interface Album {
  id: number;
  title: string;
}

interface Category {
  id: number;
  name: string;
}

interface EditPhotoFormProps {
  photo: Photo;
  albums: Album[];
  categories: Category[];
}

export default function EditPhotoForm({ photo, albums, categories }: EditPhotoFormProps) {
  const [imageUrl, setImageUrl] = useState(photo.image_url);
  const [imageKey, setImageKey] = useState('');

  const handleImageChange = (url: string, key: string) => {
    setImageUrl(url);
    setImageKey(key);
  };

  return (
    <form
      action={updatePhotoAction}
      className="bg-white rounded-lg border border-admin-border p-6 space-y-1"
    >
      <input type="hidden" name="id" value={photo.id} />
      <input type="hidden" name="image_url" value={imageUrl} />
      <input type="hidden" name="image_key" value={imageKey} />

      <FormField label="所属相册" name="album_id">
        <Select name="album_id" required defaultValue={String(photo.album_id)}>
          {albums.map((album) => (
            <option key={album.id} value={String(album.id)}>
              {album.title}
            </option>
          ))}
        </Select>
      </FormField>

      <ImageUploader
        label="图片"
        name="image"
        value={imageUrl}
        onChange={handleImageChange}
        maxSize={10 * 1024 * 1024}
        hint="支持 JPG、PNG、GIF、WebP 格式，最大 10MB"
      />

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

      <SubmitButton label="保存修改" disabled={!imageUrl} />
    </form>
  );
}