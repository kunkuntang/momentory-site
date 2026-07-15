import db from '../database';

export interface HomeCarouselItem {
  id: number;
  type: 'image' | 'video';
  title: string;
  caption: string | null;
  photo_id: number | null;
  photo_live_poster_url: string | null;
  video_url: string | null;
  video_id: number | null;
  video_poster_url: string | null;
  date: string | null;
  location: string | null;
  sort_order: number;
  is_active: number;
  created_at: string;
  updated_at: string;
  image_url?: string;
  image_alt?: string;
}

export function getActiveCarouselItems(): HomeCarouselItem[] {
  const stmt = db.prepare(`
    SELECT hc.*, p.image_url, p.image_alt
    FROM home_carousel hc
    LEFT JOIN photos p ON hc.photo_id = p.id
    WHERE hc.is_active = 1
    ORDER BY hc.sort_order ASC
  `);
  return stmt.all() as HomeCarouselItem[];
}

export function getAllCarouselItems(): HomeCarouselItem[] {
  const stmt = db.prepare(`
    SELECT hc.*, p.image_url, p.image_alt
    FROM home_carousel hc
    LEFT JOIN photos p ON hc.photo_id = p.id
    ORDER BY hc.sort_order ASC
  `);
  return stmt.all() as HomeCarouselItem[];
}

export function getCarouselItemById(id: number): HomeCarouselItem | null {
  const stmt = db.prepare(`
    SELECT hc.*, p.image_url, p.image_alt
    FROM home_carousel hc
    LEFT JOIN photos p ON hc.photo_id = p.id
    WHERE hc.id = ?
  `);
  return (stmt.get(id) as HomeCarouselItem) || null;
}

export function createCarouselItem(data: {
  type: 'image' | 'video';
  title: string;
  caption?: string;
  photo_id?: number | null;
  photo_live_poster_url?: string;
  video_url?: string;
  video_id?: number | null;
  video_poster_url?: string;
  date?: string;
  location?: string;
  sort_order?: number;
  is_active?: boolean;
}): HomeCarouselItem {
  const stmt = db.prepare(`
    INSERT INTO home_carousel (type, title, caption, photo_id, photo_live_poster_url, video_url, video_id, video_poster_url, date, location, sort_order, is_active)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  const result = stmt.run(
    data.type,
    data.title,
    data.caption ?? null,
    data.photo_id ?? null,
    data.photo_live_poster_url ?? null,
    data.video_url ?? null,
    data.video_id ?? null,
    data.video_poster_url ?? null,
    data.date ?? null,
    data.location ?? null,
    data.sort_order ?? 0,
    data.is_active === false ? 0 : 1,
  );
  return getCarouselItemById(result.lastInsertRowid as number) as HomeCarouselItem;
}

export function updateCarouselItem(
  id: number,
  data: {
    type?: 'image' | 'video';
    title?: string;
    caption?: string;
    photo_id?: number | null;
    photo_live_poster_url?: string;
    video_url?: string;
    video_id?: number | null;
    video_poster_url?: string;
    date?: string;
    location?: string;
    sort_order?: number;
    is_active?: boolean;
  },
): void {
  const fields: string[] = [];
  const values: (string | number | null)[] = [];

  if (data.type !== undefined) {
    fields.push('type = ?');
    values.push(data.type);
  }
  if (data.title !== undefined) {
    fields.push('title = ?');
    values.push(data.title);
  }
  if (data.caption !== undefined) {
    fields.push('caption = ?');
    values.push(data.caption);
  }
  if (data.photo_id !== undefined) {
    fields.push('photo_id = ?');
    values.push(data.photo_id);
  }
  if (data.photo_live_poster_url !== undefined) {
    fields.push('photo_live_poster_url = ?');
    values.push(data.photo_live_poster_url);
  }
  if (data.video_url !== undefined) {
    fields.push('video_url = ?');
    values.push(data.video_url);
  }
  if (data.video_id !== undefined) {
    fields.push('video_id = ?');
    values.push(data.video_id);
  }
  if (data.video_poster_url !== undefined) {
    fields.push('video_poster_url = ?');
    values.push(data.video_poster_url);
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
  if (data.is_active !== undefined) {
    fields.push('is_active = ?');
    values.push(data.is_active ? 1 : 0);
  }

  if (fields.length === 0) return;

  fields.push('updated_at = CURRENT_TIMESTAMP');
  values.push(id);

  const stmt = db.prepare(`UPDATE home_carousel SET ${fields.join(', ')} WHERE id = ?`);
  stmt.run(...values);
}

export function deleteCarouselItem(id: number): void {
  const stmt = db.prepare(`DELETE FROM home_carousel WHERE id = ?`);
  stmt.run(id);
}