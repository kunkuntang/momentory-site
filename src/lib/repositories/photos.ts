import db from '../database';
import type { Photo } from './albums';

export interface PhotoWithAlbum extends Photo {
  album_title: string | null;
  category_name: string | null;
}

export function getPhotoById(id: number): Photo | null {
  const stmt = db.prepare(`SELECT * FROM photos WHERE id = ?`);
  return (stmt.get(id) as Photo) || null;
}

export function getAllPhotos(): PhotoWithAlbum[] {
  const stmt = db.prepare(`
    SELECT p.*, a.title as album_title, c.name as category_name
    FROM photos p
    LEFT JOIN albums a ON p.album_id = a.id
    LEFT JOIN photo_categories c ON p.category_id = c.id
    ORDER BY p.created_at DESC
  `);
  return stmt.all() as PhotoWithAlbum[];
}

export function createPhoto(data: {
  album_id: number;
  image_url: string;
  image_alt?: string;
  title?: string;
  description?: string;
  category_id?: number | null;
  is_live?: boolean;
  live_mp4_url?: string;
  date?: string;
  location?: string;
  sort_order?: number;
}): Photo {
  const stmt = db.prepare(`
    INSERT INTO photos (album_id, image_url, image_alt, title, description, category_id, is_live, live_mp4_url, date, location, sort_order)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  const result = stmt.run(
    data.album_id,
    data.image_url,
    data.image_alt ?? null,
    data.title ?? null,
    data.description ?? null,
    data.category_id ?? null,
    data.is_live ? 1 : 0,
    data.live_mp4_url ?? null,
    data.date ?? null,
    data.location ?? null,
    data.sort_order ?? 0,
  );
  return getPhotoById(result.lastInsertRowid as number) as Photo;
}

export function updatePhoto(
  id: number,
  data: {
    album_id?: number;
    image_url?: string;
    image_alt?: string;
    title?: string;
    description?: string;
    category_id?: number | null;
    is_live?: boolean;
    live_mp4_url?: string;
    date?: string;
    location?: string;
    sort_order?: number;
  },
): void {
  const fields: string[] = [];
  const values: (string | number | null)[] = [];

  if (data.album_id !== undefined) {
    fields.push('album_id = ?');
    values.push(data.album_id);
  }
  if (data.image_url !== undefined) {
    fields.push('image_url = ?');
    values.push(data.image_url);
  }
  if (data.image_alt !== undefined) {
    fields.push('image_alt = ?');
    values.push(data.image_alt);
  }
  if (data.title !== undefined) {
    fields.push('title = ?');
    values.push(data.title);
  }
  if (data.description !== undefined) {
    fields.push('description = ?');
    values.push(data.description);
  }
  if (data.category_id !== undefined) {
    fields.push('category_id = ?');
    values.push(data.category_id);
  }
  if (data.is_live !== undefined) {
    fields.push('is_live = ?');
    values.push(data.is_live ? 1 : 0);
  }
  if (data.live_mp4_url !== undefined) {
    fields.push('live_mp4_url = ?');
    values.push(data.live_mp4_url);
  }
  if (data.date !== undefined) {
    fields.push('date = ?');
    values.push(data.date);
  }
  if (data.location !== undefined) {
    fields.push('location = ?');
    values.push(data.location);
  }
  if (data.sort_order !== undefined) {
    fields.push('sort_order = ?');
    values.push(data.sort_order);
  }

  if (fields.length === 0) return;

  const stmt = db.prepare(`UPDATE photos SET ${fields.join(', ')} WHERE id = ?`);
  values.push(id);
  stmt.run(...values);
}

export function deletePhoto(id: number): void {
  const stmt = db.prepare(`DELETE FROM photos WHERE id = ?`);
  stmt.run(id);
}

export function getAllCategories(): { id: number; name: string; description: string | null }[] {
  const stmt = db.prepare(`SELECT * FROM photo_categories ORDER BY name ASC`);
  return stmt.all() as { id: number; name: string; description: string | null }[];
}
