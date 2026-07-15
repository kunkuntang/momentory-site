import db from '../database';

export interface Album {
  id: number;
  slug: string;
  title: string;
  summary: string | null;
  cover_image_url: string | null;
  cover_image_alt: string | null;
  is_private: number;
  created_at: string;
  updated_at: string;
}

export interface AlbumWithPhotoCount extends Album {
  photo_count: number;
}

export interface AlbumWithPhotos extends Album {
  photo_count: number;
  photos: Photo[];
}

export interface Photo {
  id: number;
  album_id: number;
  image_url: string;
  image_alt: string | null;
  title: string | null;
  description: string | null;
  category_id: number | null;
  is_live: number;
  live_mp4_url: string | null;
  date: string | null;
  location: string | null;
  sort_order: number;
  created_at: string;
}

export function getAllAlbums(): AlbumWithPhotoCount[] {
  const stmt = db.prepare(`
    SELECT a.*, COUNT(p.id) as photo_count
    FROM albums a
    LEFT JOIN photos p ON a.id = p.album_id
    GROUP BY a.id
    ORDER BY a.created_at DESC
  `);
  return stmt.all() as AlbumWithPhotoCount[];
}

export function getAlbumBySlug(slug: string): AlbumWithPhotos | null {
  const albumStmt = db.prepare(`
    SELECT a.*, COUNT(p.id) as photo_count
    FROM albums a
    LEFT JOIN photos p ON a.id = p.album_id
    WHERE a.slug = ?
    GROUP BY a.id
  `);
  const album = albumStmt.get(slug) as AlbumWithPhotoCount | null;
  
  if (!album) return null;
  
  const photosStmt = db.prepare(`
    SELECT * FROM photos WHERE album_id = ? ORDER BY sort_order ASC
  `);
  const photos = photosStmt.all(album.id) as Photo[];
  
  return { ...album, photos };
}

export function getAlbumById(id: number): AlbumWithPhotos | null {
  const albumStmt = db.prepare(`
    SELECT a.*, COUNT(p.id) as photo_count
    FROM albums a
    LEFT JOIN photos p ON a.id = p.album_id
    WHERE a.id = ?
    GROUP BY a.id
  `);
  const album = albumStmt.get(id) as AlbumWithPhotoCount | null;

  if (!album) return null;

  const photosStmt = db.prepare(`
    SELECT * FROM photos WHERE album_id = ? ORDER BY sort_order ASC
  `);
  const photos = photosStmt.all(album.id) as Photo[];

  return { ...album, photos };
}

export function createAlbum(data: {
  slug: string;
  title: string;
  summary?: string;
  cover_image_url?: string;
  cover_image_alt?: string;
  is_private?: boolean;
}): Album {
  const stmt = db.prepare(`
    INSERT INTO albums (slug, title, summary, cover_image_url, cover_image_alt, is_private)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  const result = stmt.run(
    data.slug,
    data.title,
    data.summary ?? null,
    data.cover_image_url ?? null,
    data.cover_image_alt ?? null,
    data.is_private ? 1 : 0,
  );
  const fetchStmt = db.prepare(`SELECT * FROM albums WHERE id = ?`);
  return fetchStmt.get(result.lastInsertRowid) as Album;
}

export function updateAlbum(
  id: number,
  data: {
    slug?: string;
    title?: string;
    summary?: string;
    cover_image_url?: string;
    cover_image_alt?: string;
    is_private?: boolean;
  },
): void {
  const fields: string[] = [];
  const values: (string | number | null)[] = [];

  if (data.slug !== undefined) {
    fields.push('slug = ?');
    values.push(data.slug);
  }
  if (data.title !== undefined) {
    fields.push('title = ?');
    values.push(data.title);
  }
  if (data.summary !== undefined) {
    fields.push('summary = ?');
    values.push(data.summary);
  }
  if (data.cover_image_url !== undefined) {
    fields.push('cover_image_url = ?');
    values.push(data.cover_image_url);
  }
  if (data.cover_image_alt !== undefined) {
    fields.push('cover_image_alt = ?');
    values.push(data.cover_image_alt);
  }
  if (data.is_private !== undefined) {
    fields.push('is_private = ?');
    values.push(data.is_private ? 1 : 0);
  }

  if (fields.length === 0) return;

  fields.push('updated_at = CURRENT_TIMESTAMP');
  values.push(id);

  const stmt = db.prepare(`UPDATE albums SET ${fields.join(', ')} WHERE id = ?`);
  stmt.run(...values);
}

export function deleteAlbum(id: number): void {
  const stmt = db.prepare(`DELETE FROM albums WHERE id = ?`);
  stmt.run(id);
}
