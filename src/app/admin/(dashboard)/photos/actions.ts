'use server';

import { redirect } from 'next/navigation';
import { requireAuth } from '@/lib/auth';
import { createPhoto, updatePhoto, deletePhoto } from '@/lib/repositories/photos';

export async function createPhotoAction(formData: FormData) {
  await requireAuth();
  const albumId = Number(formData.get('album_id'));
  const imageUrl = formData.get('image_url') as string;
  const imageAlt = formData.get('image_alt') as string;
  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const categoryId = formData.get('category_id') as string;
  const isLive = formData.get('is_live') === 'on';
  const liveMp4Url = formData.get('live_mp4_url') as string;
  const date = formData.get('date') as string;
  const location = formData.get('location') as string;
  const sortOrder = Number(formData.get('sort_order')) || 0;

  if (!albumId || !imageUrl) {
    redirect('/admin/photos/new?error=missing');
  }

  await createPhoto({
    album_id: albumId,
    image_url: imageUrl,
    image_alt: imageAlt || undefined,
    title: title || undefined,
    description: description || undefined,
    category_id: categoryId ? Number(categoryId) : null,
    is_live: isLive,
    live_mp4_url: liveMp4Url || undefined,
    date: date || undefined,
    location: location || undefined,
    sort_order: sortOrder,
  });

  redirect('/admin/photos');
}

export async function updatePhotoAction(formData: FormData) {
  await requireAuth();
  const id = Number(formData.get('id'));
  const albumId = Number(formData.get('album_id'));
  const imageUrl = formData.get('image_url') as string;
  const imageAlt = formData.get('image_alt') as string;
  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const categoryId = formData.get('category_id') as string;
  const isLive = formData.get('is_live') === 'on';
  const liveMp4Url = formData.get('live_mp4_url') as string;
  const date = formData.get('date') as string;
  const location = formData.get('location') as string;
  const sortOrder = Number(formData.get('sort_order')) || 0;

  await updatePhoto(id, {
    album_id: albumId,
    image_url: imageUrl,
    image_alt: imageAlt || undefined,
    title: title || undefined,
    description: description || undefined,
    category_id: categoryId ? Number(categoryId) : null,
    is_live: isLive,
    live_mp4_url: liveMp4Url || undefined,
    date: date || undefined,
    location: location || undefined,
    sort_order: sortOrder,
  });

  redirect('/admin/photos');
}

export async function deletePhotoAction(formData: FormData) {
  await requireAuth();
  const id = Number(formData.get('id'));
  await deletePhoto(id);
  redirect('/admin/photos');
}
