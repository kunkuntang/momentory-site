import db from '../database';

export interface SiteInfo {
  name: string;
  logo_text: string;
  tagline: string;
  copyright: string;
}

export type LinkType = 'inner' | 'outer' | 'mini_program' | 'universal_app' | 'android_app' | 'apple_app';

export interface MenuItem {
  id: number;
  label: string;
  url: string;
  link_type: LinkType;
  sort_order: number;
  is_active: number;
}

export function getSiteInfo(): SiteInfo {
  const stmt = db.prepare(`
    SELECT name, logo_text, tagline, copyright FROM site_config LIMIT 1
  `);
  return stmt.get() as SiteInfo;
}

export function getMenuItems(): MenuItem[] {
  const stmt = db.prepare(`
    SELECT id, label, url, link_type, sort_order, is_active FROM menu
    WHERE is_active = 1
    ORDER BY sort_order ASC
  `);
  return stmt.all() as MenuItem[];
}