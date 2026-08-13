'use client';

import { useState } from 'react';
import { FormField, Input, Textarea, Select, Checkbox } from '@/components/admin/FormFields';
import SubmitButton from '@/components/admin/SubmitButton';
import { ImageUploader } from '@/components/admin/FileUploader';
import { updatePhotoAction } from '../actions';
import { readImageExif, formatDevice, type ExifInfo } from '@/lib/exif';
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
  const [exif, setExif] = useState<ExifInfo>({
    make: photo.exif_make ?? '',
    model: photo.exif_model ?? '',
    lens: photo.exif_lens ?? '',
    fNumber: photo.exif_f_number ?? '',
    exposure: photo.exif_exposure ?? '',
    iso: photo.exif_iso ?? '',
    focal: photo.exif_focal ?? '',
    date: '',
  });
  const [date, setDate] = useState<string>(photo.date ?? '');
  const [readingExif, setReadingExif] = useState(false);

  const handleImageChange = (url: string, key: string) => {
    setImageUrl(url);
    setImageKey(key);
  };

  const handleFileSelected = async (file: File) => {
    setReadingExif(true);
    const info = await readImageExif(file);
    setExif(info);
    setDate((prev) => prev || info.date);
    setReadingExif(false);
  };

  return (
    <form
      action={updatePhotoAction}
      className="bg-white rounded-lg border border-admin-border p-6 space-y-1"
    >
      <input type="hidden" name="id" value={photo.id} />
      <input type="hidden" name="image_url" value={imageUrl} />
      <input type="hidden" name="image_key" value={imageKey} />
      <input type="hidden" name="exif_make" value={exif.make} />
      <input type="hidden" name="exif_model" value={exif.model} />

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
        onFileSelected={handleFileSelected}
        maxSize={10 * 1024 * 1024}
        hint="支持 JPG、PNG、GIF、WebP 格式，最大 10MB"
      />

      <div className="rounded-md bg-gray-50 border border-admin-border p-4 space-y-3 mt-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-admin-ink">EXIF 拍摄信息</span>
          {readingExif && (
            <span className="text-xs text-admin-muted">读取中...</span>
          )}
        </div>
        <div className="grid grid-cols-2 gap-3">
          <FormField label="拍摄设备" name="exif_device_display">
            <Input
              name="exif_device_display"
              value={formatDevice(exif)}
              readOnly
              placeholder="更换图片后自动读取"
              className="bg-gray-100 cursor-not-allowed"
            />
          </FormField>
          <FormField label="拍摄镜头" name="exif_lens">
            <Input
              name="exif_lens"
              value={exif.lens}
              readOnly
              placeholder="更换图片后自动读取"
              className="bg-gray-100 cursor-not-allowed"
            />
          </FormField>
          <FormField label="光圈" name="exif_f_number">
            <Input
              name="exif_f_number"
              value={exif.fNumber}
              readOnly
              placeholder="更换图片后自动读取"
              className="bg-gray-100 cursor-not-allowed"
            />
          </FormField>
          <FormField label="快门" name="exif_exposure">
            <Input
              name="exif_exposure"
              value={exif.exposure}
              readOnly
              placeholder="更换图片后自动读取"
              className="bg-gray-100 cursor-not-allowed"
            />
          </FormField>
          <FormField label="ISO" name="exif_iso">
            <Input
              name="exif_iso"
              value={exif.iso}
              readOnly
              placeholder="更换图片后自动读取"
              className="bg-gray-100 cursor-not-allowed"
            />
          </FormField>
          <FormField label="焦距" name="exif_focal">
            <Input
              name="exif_focal"
              value={exif.focal}
              readOnly
              placeholder="更换图片后自动读取"
              className="bg-gray-100 cursor-not-allowed"
            />
          </FormField>
        </div>
      </div>

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
        <Input
          name="date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
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
