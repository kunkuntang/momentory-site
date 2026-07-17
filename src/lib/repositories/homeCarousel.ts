import prisma from '../prisma';
import type { HomeCarousel } from '../../../prisma/generated/client/client';

export type HomeCarouselItem = HomeCarousel & {
  image_url?: string;
  image_alt?: string;
};

export async function getActiveCarouselItems(): Promise<HomeCarouselItem[]> {
  return await prisma.$queryRaw`
    SELECT hc.*, p.image_url, p.image_alt
    FROM home_carousel hc
    LEFT JOIN photos p ON hc.photo_id = p.id
    WHERE hc.is_active = 1
    ORDER BY hc.sort_order ASC
  `;
}

export async function getAllCarouselItems(): Promise<HomeCarouselItem[]> {
  return await prisma.$queryRaw`
    SELECT hc.*, p.image_url, p.image_alt
    FROM home_carousel hc
    LEFT JOIN photos p ON hc.photo_id = p.id
    ORDER BY hc.sort_order ASC
  `;
}

export async function getCarouselItemById(id: number): Promise<HomeCarouselItem | null> {
  const result = await prisma.$queryRaw<HomeCarouselItem[]>`
    SELECT hc.*, p.image_url, p.image_alt
    FROM home_carousel hc
    LEFT JOIN photos p ON hc.photo_id = p.id
    WHERE hc.id = ${id}
  `;
  return result[0] || null;
}

export async function createCarouselItem(data: {
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
}): Promise<HomeCarousel> {
  return await prisma.homeCarousel.create({
    data: {
      type: data.type,
      title: data.title,
      caption: data.caption ?? null,
      photo_id: data.photo_id ?? null,
      photo_live_poster_url: data.photo_live_poster_url ?? null,
      video_url: data.video_url ?? null,
      video_id: data.video_id ?? null,
      video_poster_url: data.video_poster_url ?? null,
      date: data.date ?? null,
      location: data.location ?? null,
      sort_order: data.sort_order ?? 0,
      is_active: data.is_active ?? true,
    },
  });
}

export async function updateCarouselItem(
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
): Promise<void> {
  await prisma.homeCarousel.update({
    where: { id },
    data: {
      ...(data.type !== undefined && { type: data.type }),
      ...(data.title !== undefined && { title: data.title }),
      ...(data.caption !== undefined && { caption: data.caption ?? null }),
      ...(data.photo_id !== undefined && { photo_id: data.photo_id ?? null }),
      ...(data.photo_live_poster_url !== undefined && { photo_live_poster_url: data.photo_live_poster_url ?? null }),
      ...(data.video_url !== undefined && { video_url: data.video_url ?? null }),
      ...(data.video_id !== undefined && { video_id: data.video_id ?? null }),
      ...(data.video_poster_url !== undefined && { video_poster_url: data.video_poster_url ?? null }),
      ...(data.date !== undefined && { date: data.date ?? null }),
      ...(data.location !== undefined && { location: data.location ?? null }),
      ...(data.sort_order !== undefined && { sort_order: data.sort_order }),
      ...(data.is_active !== undefined && { is_active: data.is_active }),
      updated_at: new Date(),
    },
  });
}

export async function deleteCarouselItem(id: number): Promise<void> {
  await prisma.homeCarousel.delete({ where: { id } });
}
