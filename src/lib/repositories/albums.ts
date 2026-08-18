import prisma from '../prisma';
import type { Album as PrismaAlbum, Photo as PrismaPhoto } from '../../../prisma/generated/client/client';

export type Album = PrismaAlbum;
export type Photo = PrismaPhoto;

export type AlbumWithPhotoCount = Album & { photo_count: number };

export type AlbumWithPhotos = Album & {
  photo_count: number;
  photos: Photo[];
};

export async function getAllAlbums(): Promise<AlbumWithPhotoCount[]> {
  return await prisma.$queryRaw`
    SELECT a.*, COUNT(p.id) as photo_count
    FROM albums a
    LEFT JOIN photos p ON a.id = p.album_id
    GROUP BY a.id
    ORDER BY a.created_at DESC
  `;
}

export async function getPublicAlbums(): Promise<AlbumWithPhotoCount[]> {
  return await prisma.$queryRaw`
    SELECT a.*, COUNT(p.id) as photo_count
    FROM albums a
    LEFT JOIN photos p ON a.id = p.album_id
    WHERE a.is_hidden = false
    GROUP BY a.id
    ORDER BY a.created_at DESC
  `;
}

export async function getAlbumBySlug(slug: string): Promise<AlbumWithPhotos | null> {
  const album = await prisma.$queryRaw<AlbumWithPhotoCount[]>`
    SELECT a.*, COUNT(p.id) as photo_count
    FROM albums a
    LEFT JOIN photos p ON a.id = p.album_id
    WHERE a.slug = ${slug}
    GROUP BY a.id
  `;

  if (!album[0]) return null;

  const photos = await prisma.photo.findMany({
    where: { album_id: album[0].id },
    orderBy: { sort_order: 'asc' },
  });

  return { ...album[0], photos };
}

export async function getAlbumById(id: number): Promise<AlbumWithPhotos | null> {
  const album = await prisma.$queryRaw<AlbumWithPhotoCount[]>`
    SELECT a.*, COUNT(p.id) as photo_count
    FROM albums a
    LEFT JOIN photos p ON a.id = p.album_id
    WHERE a.id = ${id}
    GROUP BY a.id
  `;

  if (!album[0]) return null;

  const photos = await prisma.photo.findMany({
    where: { album_id: album[0].id },
    orderBy: { sort_order: 'asc' },
  });

  return { ...album[0], photos };
}

export async function createAlbum(data: {
  slug: string;
  title: string;
  summary?: string;
  cover_image_url?: string;
  cover_image_alt?: string;
  is_private?: boolean;
  is_hidden?: boolean;
  password_hash?: string | null;
}): Promise<Album> {
  return await prisma.album.create({
    data: {
      slug: data.slug,
      title: data.title,
      summary: data.summary ?? null,
      cover_image_url: data.cover_image_url ?? null,
      cover_image_alt: data.cover_image_alt ?? null,
      is_private: data.is_private ?? false,
      is_hidden: data.is_hidden ?? false,
      password_hash: data.password_hash ?? null,
    },
  });
}

export async function updateAlbum(
  id: number,
  data: {
    slug?: string;
    title?: string;
    summary?: string;
    cover_image_url?: string;
    cover_image_alt?: string;
    is_private?: boolean;
    is_hidden?: boolean;
    password_hash?: string | null;
  },
): Promise<void> {
  await prisma.album.update({
    where: { id },
    data: {
      ...(data.slug !== undefined && { slug: data.slug }),
      ...(data.title !== undefined && { title: data.title }),
      ...(data.summary !== undefined && { summary: data.summary ?? null }),
      ...(data.cover_image_url !== undefined && { cover_image_url: data.cover_image_url ?? null }),
      ...(data.cover_image_alt !== undefined && { cover_image_alt: data.cover_image_alt ?? null }),
      ...(data.is_private !== undefined && { is_private: data.is_private }),
      ...(data.is_hidden !== undefined && { is_hidden: data.is_hidden }),
      ...(data.password_hash !== undefined && { password_hash: data.password_hash }),
      updated_at: new Date(),
    },
  });
}

export async function deleteAlbum(id: number): Promise<void> {
  await prisma.album.delete({ where: { id } });
}
