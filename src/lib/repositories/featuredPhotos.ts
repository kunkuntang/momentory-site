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