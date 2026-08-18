'use client';

import { useMemo, useState } from 'react';

export interface PhotoPickerPhoto {
  id: number;
  image_url: string;
  image_alt: string | null;
  title: string | null;
  date: string | null;
  location: string | null;
  category_id: number | null;
}

interface PhotoPickerProps<T extends PhotoPickerPhoto> {
  photos: T[];
  categories: { id: number; name: string }[];
  selectedId: number | null;
  onSelect: (photo: T) => void;
  title?: string;
}

export default function PhotoPicker<T extends PhotoPickerPhoto>({
  photos,
  categories,
  selectedId,
  onSelect,
  title = '从照片库选择一张照片',
}: PhotoPickerProps<T>) {
  const [search, setSearch] = useState('');
  const [categoryId, setCategoryId] = useState<string>('');

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const cid = categoryId ? Number(categoryId) : null;
    return photos.filter((p) => {
      if (cid !== null && p.category_id !== cid) return false;
      if (!q) return true;
      return (
        (p.title ?? '').toLowerCase().includes(q) ||
        (p.location ?? '').toLowerCase().includes(q)
      );
    });
  }, [photos, search, categoryId]);

  return (
    <div className="bg-white rounded-lg border border-admin-border p-4">
      <div className="flex items-center justify-between gap-3 mb-3">
        <h2 className="text-sm font-medium text-admin-ink">{title}</h2>
        <div className="flex items-center gap-2">
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="px-3 py-1.5 border border-admin-border rounded-md text-sm text-admin-ink bg-white focus:outline-none focus:ring-2 focus:ring-admin-accent focus:border-transparent"
          >
            <option value="">全部分类</option>
            {categories.map((c) => (
              <option key={c.id} value={String(c.id)}>
                {c.name}
              </option>
            ))}
          </select>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="按标题或位置搜索"
            className="px-3 py-1.5 border border-admin-border rounded-md text-sm text-admin-ink focus:outline-none focus:ring-2 focus:ring-admin-accent focus:border-transparent w-64"
          />
        </div>
      </div>
      {filtered.length === 0 ? (
        <p className="text-sm text-admin-muted text-center py-8">没有匹配的照片</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-96 overflow-y-auto">
          {filtered.map((p) => {
            const active = p.id === selectedId;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => onSelect(p)}
                className={`relative text-left rounded-md border overflow-hidden transition-colors ${
                  active
                    ? 'border-admin-accent ring-2 ring-admin-accent'
                    : 'border-admin-border hover:border-admin-accent'
                }`}
              >
                <div className="aspect-square bg-admin-bg">
                  {p.image_url ? (
                    <img
                      src={p.image_url}
                      alt={p.image_alt ?? ''}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs text-admin-muted">
                      无图
                    </div>
                  )}
                </div>
                <div className="p-2">
                  <p className="text-xs text-admin-ink truncate">{p.title ?? `#${p.id}`}</p>
                  <p className="text-xs text-admin-muted truncate">{p.date ?? ''}</p>
                </div>
                {active && (
                  <span className="absolute top-1 right-1 bg-admin-accent text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    ✓
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
