import prisma from '../prisma';
import type { SiteConfig, Menu } from '../../../prisma/generated/client/client';

export type LinkType = 'inner' | 'outer' | 'mini_program' | 'universal_app' | 'android_app' | 'apple_app';

export type MenuItem = Menu;

export async function getSiteInfo(): Promise<{ name: string; logo_text: string; tagline: string; copyright: string }> {
  console.log('getSiteInfo');
  const config = await prisma.siteConfig.findFirst({
    select: { name: true, logo_text: true, tagline: true, copyright: true },
  });
  return config || { name: '', logo_text: '', tagline: '', copyright: '' };
}

export async function getMenuItems(): Promise<MenuItem[]> {
  return await prisma.menu.findMany({
    where: { is_active: true },
    orderBy: { sort_order: 'asc' },
  });
}

export async function updateSiteConfig(
  id: number,
  data: { name?: string; logo_text?: string; tagline?: string; copyright?: string },
): Promise<void> {
  await prisma.siteConfig.update({
    where: { id },
    data: {
      ...(data.name !== undefined && { name: data.name }),
      ...(data.logo_text !== undefined && { logo_text: data.logo_text }),
      ...(data.tagline !== undefined && { tagline: data.tagline }),
      ...(data.copyright !== undefined && { copyright: data.copyright }),
      updated_at: new Date(),
    },
  });
}

export async function getAllMenuItems(): Promise<MenuItem[]> {
  return await prisma.menu.findMany({
    orderBy: { sort_order: 'asc' },
  });
}

export async function getMenuItemById(id: number): Promise<MenuItem | null> {
  return await prisma.menu.findUnique({ where: { id } });
}

export async function createMenuItem(data: {
  label: string;
  url: string;
  link_type?: string;
  sort_order?: number;
  is_active?: boolean;
}): Promise<MenuItem> {
  return await prisma.menu.create({
    data: {
      label: data.label,
      url: data.url,
      link_type: (data.link_type ?? 'inner') as LinkType,
      sort_order: data.sort_order ?? 0,
      is_active: data.is_active ?? true,
    },
  });
}

export async function updateMenuItem(
  id: number,
  data: {
    label?: string;
    url?: string;
    link_type?: string;
    sort_order?: number;
    is_active?: boolean;
  },
): Promise<void> {
  await prisma.menu.update({
    where: { id },
    data: {
      ...(data.label !== undefined && { label: data.label }),
      ...(data.url !== undefined && { url: data.url }),
      ...(data.link_type !== undefined && { link_type: data.link_type as LinkType }),
      ...(data.sort_order !== undefined && { sort_order: data.sort_order }),
      ...(data.is_active !== undefined && { is_active: data.is_active }),
    },
  });
}

export async function deleteMenuItem(id: number): Promise<void> {
  await prisma.menu.delete({ where: { id } });
}
