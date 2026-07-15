'use server';

import { redirect } from 'next/navigation';
import { requireAuth } from '@/lib/auth';
import { createAlbum, updateAlbum, deleteAlbum } from '@/lib/repositories/albums';

export async function createAlbumAction(formData: FormData) {
  await requireAuth();
  const slug = formData.get('slug') as string;
  const title = formData.get('title') as string;
  const summary = formData.get('summary') as string;
  const coverImageUrl = formData.get('cover_image_url') as string;
  const coverImageAlt = formData.get('cover_image_alt') as string;
  const isPrivate = formData.get('is_private') === 'on';

  if (!slug || !title) {
    redirect('/admin/albums/new?error=missing');
  }

  createAlbum({
    slug,
    title,
    summary: summary || undefined,
    cover_image_url: coverImageUrl || undefined,
    cover_image_alt: coverImageAlt || undefined,
    is_private: isPrivate,
  });

  redirect('/admin/albums');
}

export async function updateAlbumAction(formData: FormData) {
  await requireAuth();
  const id = Number(formData.get('id'));
  const slug = formData.get('slug') as string;
  const title = formData.get('title') as string;
  const summary = formData.get('summary') as string;
  const coverImageUrl = formData.get('cover_image_url') as string;
  const coverImageAlt = formData.get('cover_image_alt') as string;
  const isPrivate = formData.get('is_private') === 'on';

  updateAlbum(id, {
    slug,
    title,
    summary: summary || undefined,
    cover_image_url: coverImageUrl || undefined,
    cover_image_alt: coverImageAlt || undefined,
    is_private: isPrivate,
  });

  redirect('/admin/albums');
}

export async function deleteAlbumAction(formData: FormData) {
  await requireAuth();
  const id = Number(formData.get('id'));
  deleteAlbum(id);
  redirect('/admin/albums');
}
