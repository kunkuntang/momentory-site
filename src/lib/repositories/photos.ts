import prisma from '../prisma';
import { Prisma } from '../../../prisma/generated/client/client';
import type { Photo } from '../../../prisma/generated/client/client';

export type PhotoWithAlbum = Photo & {
  album_title: string | null;
  category_name: string | null;
};

export type PhotoFilters = {
  categoryId?: number | null;
  albumId?: number | null;
  search?: string;
};

export async function getPhotoById(id: number): Promise<Photo | null> {
  return await prisma.photo.findUnique({ where: { id } });
}

export async function getAllPhotos(filters?: PhotoFilters): Promise<PhotoWithAlbum[]> {
  const conditions: Prisma.Sql[] = [];

  if (filters?.albumId) {
    conditions.push(Prisma.sql`p.album_id = ${filters.albumId}`);
  }
  if (filters?.categoryId) {
    conditions.push(Prisma.sql`p.category_id = ${filters.categoryId}`);
  }
  const search = filters?.search?.trim();
  if (search) {
    conditions.push(Prisma.sql`p.title LIKE ${`%${search}%`}`);
  }

  const whereClause =
    conditions.length > 0
      ? Prisma.sql`WHERE ${Prisma.join(conditions, ' AND ')}`
      : Prisma.empty;

  return await prisma.$queryRaw`
    SELECT p.*, a.title as album_title, c.name as category_name
    FROM photos p
    LEFT JOIN albums a ON p.album_id = a.id
    LEFT JOIN photo_categories c ON p.category_id = c.id
    ${whereClause}
    ORDER BY p.created_at DESC
  `;
}

export async function createPhoto(data: {
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
}): Promise<Photo> {
  return await prisma.photo.create({
    data: {
      album_id: data.album_id,
      image_url: data.image_url,
      image_alt: data.image_alt ?? null,
      title: data.title ?? null,
      description: data.description ?? null,
      category_id: data.category_id ?? null,
      is_live: data.is_live ?? false,
      live_mp4_url: data.live_mp4_url ?? null,
      date: data.date ?? null,
      location: data.location ?? null,
      sort_order: data.sort_order ?? 0,
    },
  });
}

export async function updatePhoto(
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
): Promise<void> {
  await prisma.photo.update({
    where: { id },
    data: {
      ...(data.album_id !== undefined && { album_id: data.album_id }),
      ...(data.image_url !== undefined && { image_url: data.image_url }),
      ...(data.image_alt !== undefined && { image_alt: data.image_alt ?? null }),
      ...(data.title !== undefined && { title: data.title ?? null }),
      ...(data.description !== undefined && { description: data.description ?? null }),
      ...(data.category_id !== undefined && { category_id: data.category_id ?? null }),
      ...(data.is_live !== undefined && { is_live: data.is_live }),
      ...(data.live_mp4_url !== undefined && { live_mp4_url: data.live_mp4_url ?? null }),
      ...(data.date !== undefined && { date: data.date ?? null }),
      ...(data.location !== undefined && { location: data.location ?? null }),
      ...(data.sort_order !== undefined && { sort_order: data.sort_order }),
    },
  });
}

export async function deletePhoto(id: number): Promise<void> {
  await prisma.photo.delete({ where: { id } });
}

export async function getAllCategories(): Promise<{ id: number; name: string; description: string | null }[]> {
  return await prisma.photoCategory.findMany({
    orderBy: { name: 'asc' },
    select: { id: true, name: true, description: true },
  });
}
