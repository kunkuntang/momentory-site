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

export interface AlbumWithPhotos extends Album {
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

export function getAllAlbums(): Album[] {
  const stmt = db.prepare(`
    SELECT a.*, COUNT(p.id) as photo_count
    FROM albums a
    LEFT JOIN photos p ON a.id = p.album_id
    GROUP BY a.id
    ORDER BY a.created_at DESC
  `);
  return stmt.all() as Album[];
}

export function getAlbumBySlug(slug: string): AlbumWithPhotos | null {
  const albumStmt = db.prepare(`
    SELECT a.*, COUNT(p.id) as photo_count
    FROM albums a
    LEFT JOIN photos p ON a.id = p.album_id
    WHERE a.slug = ?
    GROUP BY a.id
  `);
  const album = albumStmt.get(slug) as Album | null;
  
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
  const album = albumStmt.get(id) as Album | null;
  
  if (!album) return null;
  
  const photosStmt = db.prepare(`
    SELECT * FROM photos WHERE album_id = ? ORDER BY sort_order ASC
  `);
  const photos = photosStmt.all(album.id) as Photo[];
  
  return { ...album, photos };
}