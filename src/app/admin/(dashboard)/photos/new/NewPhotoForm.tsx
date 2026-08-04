'use client';

import { useState } from 'react';
import { FormField, Input, Textarea, Select, Switch } from '@/components/admin/FormFields';
import SubmitButton from '@/components/admin/SubmitButton';
import { ImageUploader, VideoUploader } from '@/components/admin/FileUploader';
import { createPhotoAction } from '../actions';

interface Album {
  id: number;
  title: string;
}

interface Category {
  id: number;
  name: string;
}

interface NewPhotoFormProps {
  albums: Album[];
  categories: Category[];
}

export default function NewPhotoForm({ albums, categories }: NewPhotoFormProps) {
  const [imageUrl, setImageUrl] = useState('');
  const [imageKey, setImageKey] = useState('');
  const [isLive, setIsLive] = useState(false);
  const [liveMp4Url, setLiveMp4Url] = useState('');

  const handleImageChange = (url: string, key: string) => {
    setImageUrl(url);
    setImageKey(key);
  };

  const handleLiveMp4Change = (url: string) => {
    setLiveMp4Url(url);
  };

  return (
    <form
      action={createPhotoAction}
      className="bg-white rounded-lg border border-admin-border p-6 space-y-4"
    >
      <input type="hidden" name="image_url" value={imageUrl} />
      <input type="hidden" name="image_key" value={imageKey} />

      <FormField label="所属相册" name="album_id">
        <Select name="album_id" required>
          {albums.map((album) => (
            <option key={album.id} value={album.id}>
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

      <FormField label="Live照片" name="is_live">
        <Switch name="is_live" label="Live照片" checked={isLive} onChange={setIsLive} />
      </FormField>

      {isLive && (
        <>
          <input type="hidden" name="live_mp4_url" value={liveMp4Url} />
          <VideoUploader
            label="Live动态视频"
            name="live_mp4"
            value={liveMp4Url}
            onChange={handleLiveMp4Change}
            maxSize={50 * 1024 * 1024}
            hint="支持 MP4、MOV、AVI 格式，最大 50MB"
          />
        </>
      )}

      <FormField label="日期" name="date">
        <Input name="date" type="date" />
      </FormField>

      <FormField label="位置" name="location">
        <Input name="location" placeholder="请输入位置" />
      </FormField>

      <FormField label="排序" name="sort_order">
        <Input name="sort_order" type="number" defaultValue="0" />
      </FormField>

      <SubmitButton label="创建照片" disabled={!imageUrl} />
    </form>
  );
}