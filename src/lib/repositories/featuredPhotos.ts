import db from '../database';

export interface FeaturedPhoto {
  id: number;
  title: string;
  description: string | null;
  date: string | null;
  location: string | null;
  image_url: string;
  image_alt: string | null;
  sort_order: number;
  is_active: number;
  created_at: string;
  updated_at: string;
}

export function getActiveFeaturedPhotos(): FeaturedPhoto[] {
  const stmt = db.prepare(`
    SELECT * FROM featured_photos
    WHERE is_active = 1
    ORDER BY sort_order ASC
  `);
  return stmt.all() as FeaturedPhoto[];
}

export function getAllFeaturedPhotos(): FeaturedPhoto[] {
  const stmt = db.prepare(`
    SELECT * FROM featured_photos
    ORDER BY sort_order ASC
  `);
  return stmt.all() as FeaturedPhoto[];
}

export function getFeaturedPhotoById(id: number): FeaturedPhoto | null {
  const stmt = db.prepare(`SELECT * FROM featured_photos WHERE id = ?`);
  return (stmt.get(id) as FeaturedPhoto) || null;
}

export function createFeaturedPhoto(data: {
  title: string;
  description?: string;
  date?: string;
  location?: string;
  image_url: string;
  image_alt?: string;
  sort_order?: number;
  is_active?: boolean;
}): FeaturedPhoto {
  const stmt = db.prepare(`
    INSERT INTO featured_photos (title, description, date, location, image_url, image_alt, sort_order, is_active)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);
  const result = stmt.run(
    data.title,
    data.description ?? null,
    data.date ?? null,
    data.location ?? null,
    data.image_url,
    data.image_alt ?? null,
    data.sort_order ?? 0,
    data.is_active === false ? 0 : 1,
  );
  return getFeaturedPhotoById(result.lastInsertRowid as number) as FeaturedPhoto;
}

export function updateFeaturedPhoto(
  id: number,
  data: {
    title?: string;
    description?: string;
    date?: string;
    location?: string;
    image_url?: string;
    image_alt?: string;
    sort_order?: number;
    is_active?: boolean;
  },
): void {
  const fields: string[] = [];
  const values: (string | number | null)[] = [];

  if (data.title !== undefined) {
    fields.push('title = ?');
    values.push(data.title);
  }
  if (data.description !== undefined) {
    fields.push('description = ?');
    values.push(data.description);
  }
  if (data.date !== undefined) {
    fields.push('date = ?');
    values.push(data.date);
  }
  if (data.location !== undefined) {
    fields.push('location = ?');
    values.push(data.location);
  }
  if (data.image_url !== undefined) {
    fields.push('image_url = ?');
    values.push(data.image_url);
  }
  if (data.image_alt !== undefined) {
    fields.push('image_alt = ?');
    values.push(data.image_alt);
  }
  if (data.sort_order !== undefined) {
    fields.push('sort_order = ?');
    values.push(data.sort_order);
  }
  if (data.is_active !== undefined) {
    fields.push('is_active = ?');
    values.push(data.is_active ? 1 : 0);
  }

  if (fields.length === 0) return;

  fields.push('updated_at = CURRENT_TIMESTAMP');
  values.push(id);

  const stmt = db.prepare(`UPDATE featured_photos SET ${fields.join(', ')} WHERE id = ?`);
  stmt.run(...values);
}

export function deleteFeaturedPhoto(id: number): void {
  const stmt = db.prepare(`DELETE FROM featured_photos WHERE id = ?`);
  stmt.run(id);
}