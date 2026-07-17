import prisma from '../prisma';
import type { FeaturedPhoto as PrismaFeaturedPhoto } from '../../../prisma/generated/client/client';

export type FeaturedPhoto = PrismaFeaturedPhoto;

export async function getActiveFeaturedPhotos(): Promise<FeaturedPhoto[]> {
  return await prisma.featuredPhoto.findMany({
    where: { is_active: true },
    orderBy: { sort_order: 'asc' },
  });
}

export async function getAllFeaturedPhotos(): Promise<FeaturedPhoto[]> {
  return await prisma.featuredPhoto.findMany({
    orderBy: { sort_order: 'asc' },
  });
}

export async function getFeaturedPhotoById(id: number): Promise<FeaturedPhoto | null> {
  return await prisma.featuredPhoto.findUnique({ where: { id } });
}

export async function createFeaturedPhoto(data: {
  title: string;
  description?: string;
  date?: string;
  location?: string;
  image_url: string;
  image_alt?: string;
  sort_order?: number;
  is_active?: boolean;
}): Promise<FeaturedPhoto> {
  return await prisma.featuredPhoto.create({
    data: {
      title: data.title,
      description: data.description ?? null,
      date: data.date ?? null,
      location: data.location ?? null,
      image_url: data.image_url,
      image_alt: data.image_alt ?? null,
      sort_order: data.sort_order ?? 0,
      is_active: data.is_active ?? true,
    },
  });
}

export async function updateFeaturedPhoto(
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
): Promise<void> {
  await prisma.featuredPhoto.update({
    where: { id },
    data: {
      ...(data.title !== undefined && { title: data.title }),
      ...(data.description !== undefined && { description: data.description ?? null }),
      ...(data.date !== undefined && { date: data.date ?? null }),
      ...(data.location !== undefined && { location: data.location ?? null }),
      ...(data.image_url !== undefined && { image_url: data.image_url }),
      ...(data.image_alt !== undefined && { image_alt: data.image_alt ?? null }),
      ...(data.sort_order !== undefined && { sort_order: data.sort_order }),
      ...(data.is_active !== undefined && { is_active: data.is_active }),
      updated_at: new Date(),
    },
  });
}

export async function deleteFeaturedPhoto(id: number): Promise<void> {
  await prisma.featuredPhoto.delete({ where: { id } });
}