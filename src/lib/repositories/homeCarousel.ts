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