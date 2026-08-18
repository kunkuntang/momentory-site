'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FormField, Input, Textarea, Checkbox } from '@/components/admin/FormFields';
import SubmitButton from '@/components/admin/SubmitButton';
import DeleteButton from '@/components/admin/DeleteButton';
import PhotoPicker from '@/components/admin/PhotoPicker';
import {
  createFeaturedPhotoAction,
  updateFeaturedPhotoAction,
  deleteFeaturedPhotoAction,
} from '../../actions';

interface PhotoItem {
  id: number;
  image_url: string;
  image_alt: string | null;
  title: string | null;
  description: string | null;
  date: string | null;
  location: string | null;
  category_id: number | null;
}

export interface InitialFeatured {
  id: number;
  title: string;
  description: string | null;
  image_url: string;
  image_alt: string | null;
  date: string | null;
  location: string | null;
  sort_order: number;
  is_active: boolean;
}

interface NewFeaturedPhotoFormProps {
  photos: PhotoItem[];
  categories: { id: number; name: string }[];
  initial?: InitialFeatured;
}

export default function NewFeaturedPhotoForm({
  photos,
  categories,
  initial,
}: NewFeaturedPhotoFormProps) {
  const isEdit = !!initial;
  const [selectedId, setSelectedId] = useState<number | null>(
    initial ? photos.find((p) => p.image_url === initial.image_url)?.id ?? null : null,
  );
  const [title, setTitle] = useState(initial?.title ?? '');
  const [description, setDescription] = useState(initial?.description ?? '');

  const selected = photos.find((p) => p.id === selectedId) ?? null;

  // 展示与提交的照片信息：优先当前选中，编辑模式回退到原快照
  const info = selected
    ? {
        image_url: selected.image_url,
        image_alt: selected.image_alt,
        date: selected.date,
        location: selected.location,
      }
    : initial
      ? {
          image_url: initial.image_url,
          image_alt: initial.image_alt,
          date: initial.date,
          location: initial.location,
        }
      : null;

  const handleSelect = (p: PhotoItem) => {
    setSelectedId(p.id);
    setTitle(p.title ?? '');
    setDescription(p.description ?? '');
  };

  const action = isEdit ? updateFeaturedPhotoAction : createFeaturedPhotoAction;
  const submitLabel = isEdit ? '保存修改' : '创建精选照片';

  return (
    <div className="max-w-3xl space-y-6">
      <PhotoPicker
        photos={photos}
        categories={categories}
        selectedId={selectedId}
        onSelect={handleSelect}
        title={isEdit ? '可重新选择照片（选后将覆盖原照片信息）' : '从照片库选择一张照片'}
      />

      <form
        action={action}
        className="bg-white rounded-lg border border-admin-border p-6 space-y-4"
      >
        {isEdit && initial && <input type="hidden" name="id" value={initial.id} />}
        <input type="hidden" name="image_url" value={info?.image_url ?? ''} />
        <input type="hidden" name="image_alt" value={info?.image_alt ?? ''} />
        <input type="hidden" name="date" value={info?.date ?? ''} />
        <input type="hidden" name="location" value={info?.location ?? ''} />

        <FormField label="标题" name="title" hint="默认取自照片标题，可修改">
          <Input
            name="title"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="请先选择照片"
          />
        </FormField>

        <FormField label="描述" name="description" hint="默认取自照片描述，可修改">
          <Textarea
            name="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="请输入描述"
          />
        </FormField>

        <div className="rounded-md bg-gray-50 border border-admin-border p-4 space-y-3">
          <span className="text-sm font-medium text-admin-ink">
            照片信息（来自照片库，不可修改）
          </span>
          {info ? (
            <div className="flex items-start gap-3">
              {info.image_url && (
                <img
                  src={info.image_url}
                  alt={info.image_alt ?? ''}
                  className="w-20 h-20 rounded object-cover border border-admin-border flex-shrink-0"
                />
              )}
              <div className="flex-1 grid grid-cols-2 gap-2 text-sm">
                <ReadOnlyField label="日期" value={info.date ?? '-'} />
                <ReadOnlyField label="位置" value={info.location ?? '-'} />
                <ReadOnlyField label="图片Alt" value={info.image_alt ?? '-'} />
                <ReadOnlyField label="图片URL" value={info.image_url ?? '-'} />
              </div>
            </div>
          ) : (
            <p className="text-sm text-admin-muted">请先从上方选择一张照片</p>
          )}
        </div>

        <FormField label="排序" name="sort_order">
          <Input
            name="sort_order"
            type="number"
            defaultValue={initial ? String(initial.sort_order) : '0'}
          />
        </FormField>

        <div className="mb-4">
          <Checkbox
            name="is_active"
            label="启用"
            defaultChecked={initial ? initial.is_active : true}
          />
        </div>

        <div className="flex items-center gap-3">
          <SubmitButton label={submitLabel} disabled={!info} />
          <Link
            href="/admin/site-config/featured-photos"
            className="px-4 py-2 text-sm text-admin-muted hover:text-admin-ink transition-colors"
          >
            {isEdit ? '返回' : '取消'}
          </Link>
        </div>
      </form>

      {isEdit && initial && (
        <form
          action={deleteFeaturedPhotoAction}
          className="bg-white rounded-lg border border-red-200 p-6"
        >
          <h3 className="text-sm font-medium text-admin-danger mb-2">删除精选照片</h3>
          <p className="text-sm text-admin-muted mb-4">删除后无法恢复，请谨慎操作。</p>
          <input type="hidden" name="id" value={initial.id} />
          <DeleteButton />
        </form>
      )}
    </div>
  );
}

function ReadOnlyField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-admin-muted">{label}</p>
      <p className="text-sm text-admin-ink break-all" title={value}>
        {value}
      </p>
    </div>
  );
}
