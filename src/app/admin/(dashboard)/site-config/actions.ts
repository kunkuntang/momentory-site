'use server';

import { redirect } from 'next/navigation';
import { requireAuth } from '@/lib/auth';
import {
  updateSiteConfig,
  getAllMenuItems,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
} from '@/lib/repositories/siteConfig';
import {
  createFeaturedPhoto,
  updateFeaturedPhoto,
  deleteFeaturedPhoto,
} from '@/lib/repositories/featuredPhotos';
import {
  createCarouselItem,
  updateCarouselItem,
  deleteCarouselItem,
} from '@/lib/repositories/homeCarousel';

export async function updateSiteConfigAction(formData: FormData) {
  await requireAuth();
  const id = Number(formData.get('id'));
  const name = formData.get('name') as string;
  const logoText = formData.get('logo_text') as string;
  const tagline = formData.get('tagline') as string;
  const copyright = formData.get('copyright') as string;

  await updateSiteConfig(id, { name, logo_text: logoText, tagline, copyright });
  redirect('/admin/site-config');
}

export async function createMenuItemAction(formData: FormData) {
  await requireAuth();
  const label = formData.get('label') as string;
  const url = formData.get('url') as string;
  const linkType = formData.get('link_type') as string;
  const sortOrder = Number(formData.get('sort_order')) || 0;
  const isActive = formData.get('is_active') === 'on';

  if (!label || !url) {
    redirect('/admin/site-config/menu/new?error=missing');
  }

  await createMenuItem({
    label,
    url,
    link_type: linkType || 'inner',
    sort_order: sortOrder,
    is_active: isActive,
  });

  redirect('/admin/site-config/menu');
}

export async function updateMenuItemAction(formData: FormData) {
  await requireAuth();
  const id = Number(formData.get('id'));
  const label = formData.get('label') as string;
  const url = formData.get('url') as string;
  const linkType = formData.get('link_type') as string;
  const sortOrder = Number(formData.get('sort_order')) || 0;
  const isActive = formData.get('is_active') === 'on';

  await updateMenuItem(id, {
    label,
    url,
    link_type: linkType || 'inner',
    sort_order: sortOrder,
    is_active: isActive,
  });

  redirect('/admin/site-config/menu');
}

export async function deleteMenuItemAction(formData: FormData) {
  await requireAuth();
  const id = Number(formData.get('id'));
  await deleteMenuItem(id);
  redirect('/admin/site-config/menu');
}

export async function createFeaturedPhotoAction(formData: FormData) {
  await requireAuth();
  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const date = formData.get('date') as string;
  const location = formData.get('location') as string;
  const imageUrl = formData.get('image_url') as string;
  const imageAlt = formData.get('image_alt') as string;
  const sortOrder = Number(formData.get('sort_order')) || 0;
  const isActive = formData.get('is_active') === 'on';

  if (!title || !imageUrl) {
    redirect('/admin/site-config/featured-photos/new?error=missing');
  }

  await createFeaturedPhoto({
    title,
    description: description || undefined,
    date: date || undefined,
    location: location || undefined,
    image_url: imageUrl,
    image_alt: imageAlt || undefined,
    sort_order: sortOrder,
    is_active: isActive,
  });

  redirect('/admin/site-config/featured-photos');
}

export async function updateFeaturedPhotoAction(formData: FormData) {
  await requireAuth();
  const id = Number(formData.get('id'));
  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const date = formData.get('date') as string;
  const location = formData.get('location') as string;
  const imageUrl = formData.get('image_url') as string;
  const imageAlt = formData.get('image_alt') as string;
  const sortOrder = Number(formData.get('sort_order')) || 0;
  const isActive = formData.get('is_active') === 'on';

  await updateFeaturedPhoto(id, {
    title,
    description: description || undefined,
    date: date || undefined,
    location: location || undefined,
    image_url: imageUrl,
    image_alt: imageAlt || undefined,
    sort_order: sortOrder,
    is_active: isActive,
  });

  redirect('/admin/site-config/featured-photos');
}

export async function deleteFeaturedPhotoAction(formData: FormData) {
  await requireAuth();
  const id = Number(formData.get('id'));
  await deleteFeaturedPhoto(id);
  redirect('/admin/site-config/featured-photos');
}

export async function createCarouselItemAction(formData: FormData) {
  await requireAuth();
  const type = formData.get('type') as 'image' | 'video';
  const title = formData.get('title') as string;
  const caption = formData.get('caption') as string;
  const photoId = formData.get('photo_id') as string;
  const photoLivePosterUrl = formData.get('photo_live_poster_url') as string;
  const videoUrl = formData.get('video_url') as string;
  const videoPosterUrl = formData.get('video_poster_url') as string;
  const date = formData.get('date') as string;
  const location = formData.get('location') as string;
  const sortOrder = Number(formData.get('sort_order')) || 0;
  const isActive = formData.get('is_active') === 'on';

  if (!type || !title) {
    redirect('/admin/site-config/carousel/new?error=missing');
  }

  await createCarouselItem({
    type,
    title,
    caption: caption || undefined,
    photo_id: photoId ? Number(photoId) : null,
    photo_live_poster_url: photoLivePosterUrl || undefined,
    video_url: videoUrl || undefined,
    video_poster_url: videoPosterUrl || undefined,
    date: date || undefined,
    location: location || undefined,
    sort_order: sortOrder,
    is_active: isActive,
  });

  redirect('/admin/site-config/carousel');
}

export async function updateCarouselItemAction(formData: FormData) {
  await requireAuth();
  const id = Number(formData.get('id'));
  const type = formData.get('type') as 'image' | 'video';
  const title = formData.get('title') as string;
  const caption = formData.get('caption') as string;
  const photoId = formData.get('photo_id') as string;
  const photoLivePosterUrl = formData.get('photo_live_poster_url') as string;
  const videoUrl = formData.get('video_url') as string;
  const videoPosterUrl = formData.get('video_poster_url') as string;
  const date = formData.get('date') as string;
  const location = formData.get('location') as string;
  const sortOrder = Number(formData.get('sort_order')) || 0;
  const isActive = formData.get('is_active') === 'on';

  await updateCarouselItem(id, {
    type,
    title,
    caption: caption || undefined,
    photo_id: photoId ? Number(photoId) : null,
    photo_live_poster_url: photoLivePosterUrl || undefined,
    video_url: videoUrl || undefined,
    video_poster_url: videoPosterUrl || undefined,
    date: date || undefined,
    location: location || undefined,
    sort_order: sortOrder,
    is_active: isActive,
  });

  redirect('/admin/site-config/carousel');
}

export async function deleteCarouselItemAction(formData: FormData) {
  await requireAuth();
  const id = Number(formData.get('id'));
  await deleteCarouselItem(id);
  redirect('/admin/site-config/carousel');
}
