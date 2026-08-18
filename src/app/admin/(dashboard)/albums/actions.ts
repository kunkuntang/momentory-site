'use server';

import { redirect } from 'next/navigation';
import { requireAuth, hashPassword } from '@/lib/auth';
import { createAlbum, updateAlbum, deleteAlbum } from '@/lib/repositories/albums';

export async function createAlbumAction(formData: FormData) {
  await requireAuth();
  const slug = formData.get('slug') as string;
  const title = formData.get('title') as string;
  const summary = formData.get('summary') as string;
  const coverImageUrl = formData.get('cover_image_url') as string;
  const coverImageAlt = formData.get('cover_image_alt') as string;
  const isPrivate = formData.get('is_private') === 'on';
  const isHidden = formData.get('is_hidden') === 'on';
  const password = (formData.get('password') as string | null)?.trim() ?? '';

  if (!slug || !title) {
    redirect('/admin/albums/new?error=missing');
  }

  await createAlbum({
    slug,
    title,
    summary: summary || undefined,
    cover_image_url: coverImageUrl || undefined,
    cover_image_alt: coverImageAlt || undefined,
    is_private: isPrivate,
    is_hidden: isHidden,
    password_hash: isPrivate && password ? hashPassword(password) : null,
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
  const isHidden = formData.get('is_hidden') === 'on';
  const password = (formData.get('password') as string | null)?.trim() ?? '';

  // 计算密码：私密时填了新密码就更新；取消私密则清空密码
  let passwordHash: string | null | undefined = undefined;
  if (!isPrivate) {
    passwordHash = null;
  } else if (password) {
    passwordHash = hashPassword(password);
  }

  await updateAlbum(id, {
    slug,
    title,
    summary: summary || undefined,
    cover_image_url: coverImageUrl || undefined,
    cover_image_alt: coverImageAlt || undefined,
    is_private: isPrivate,
    is_hidden: isHidden,
    password_hash: passwordHash,
  });

  redirect('/admin/albums');
}

export async function deleteAlbumAction(formData: FormData) {
  await requireAuth();
  const id = Number(formData.get('id'));
  await deleteAlbum(id);
  redirect('/admin/albums');
}
