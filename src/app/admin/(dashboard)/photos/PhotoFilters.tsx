'use client';

import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

interface PhotoFiltersProps {
  albums: { id: number; title: string }[];
  categories: { id: number; name: string }[];
  initialSearch: string;
  initialAlbumId: string;
  initialCategoryId: string;
}

const inputClass =
  'px-3 py-2 border border-admin-border rounded-md text-sm text-admin-ink bg-white focus:outline-none focus:ring-2 focus:ring-admin-accent focus:border-transparent';

export default function PhotoFilters({
  albums,
  categories,
  initialSearch,
  initialAlbumId,
  initialCategoryId,
}: PhotoFiltersProps) {
  const router = useRouter();

  const navigate = useCallback(
    (params: { search?: string; albumId?: string; categoryId?: string }) => {
      const next = new URLSearchParams();
      const search = params.search ?? initialSearch;
      const albumId = params.albumId ?? initialAlbumId;
      const categoryId = params.categoryId ?? initialCategoryId;
      if (search) next.set('search', search);
      if (albumId) next.set('albumId', albumId);
      if (categoryId) next.set('categoryId', categoryId);
      const qs = next.toString();
      router.push(qs ? `/admin/photos?${qs}` : '/admin/photos');
    },
    [router, initialSearch, initialAlbumId, initialCategoryId],
  );

  const hasFilters = Boolean(initialSearch || initialAlbumId || initialCategoryId);

  return (
    <form
      key={`${initialSearch}|${initialAlbumId}|${initialCategoryId}`}
      className="bg-white rounded-lg border border-admin-border p-4 mb-4 flex flex-wrap items-end gap-3"
      onSubmit={(e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        navigate({
          search: String(formData.get('search') ?? ''),
          albumId: String(formData.get('albumId') ?? ''),
          categoryId: String(formData.get('categoryId') ?? ''),
        });
      }}
    >
      <div className="flex flex-col gap-1">
        <label htmlFor="search" className="text-xs text-admin-muted">
          标题搜索
        </label>
        <input
          id="search"
          name="search"
          type="text"
          defaultValue={initialSearch}
          placeholder="输入照片标题关键字"
          className={`${inputClass} w-56`}
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="albumId" className="text-xs text-admin-muted">
          相册
        </label>
        <select
          id="albumId"
          name="albumId"
          defaultValue={initialAlbumId}
          onChange={(e) => navigate({ albumId: e.target.value })}
          className={`${inputClass} w-44`}
        >
          <option value="">全部相册</option>
          {albums.map((album) => (
            <option key={album.id} value={String(album.id)}>
              {album.title}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="categoryId" className="text-xs text-admin-muted">
          分类
        </label>
        <select
          id="categoryId"
          name="categoryId"
          defaultValue={initialCategoryId}
          onChange={(e) => navigate({ categoryId: e.target.value })}
          className={`${inputClass} w-44`}
        >
          <option value="">全部分类</option>
          {categories.map((category) => (
            <option key={category.id} value={String(category.id)}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="submit"
          className="px-4 py-2 bg-admin-accent text-white text-sm rounded-md hover:bg-admin-accent-dark transition-colors"
        >
          搜索
        </button>
        {hasFilters && (
          <button
            type="button"
            onClick={() => navigate({ search: '', albumId: '', categoryId: '' })}
            className="px-4 py-2 border border-admin-border text-admin-muted text-sm rounded-md hover:bg-admin-bg transition-colors"
          >
            重置
          </button>
        )}
      </div>
    </form>
  );
}
