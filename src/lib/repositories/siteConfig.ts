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

export function updateSiteConfig(
  id: number,
  data: { name?: string; logo_text?: string; tagline?: string; copyright?: string },
): void {
  const fields: string[] = [];
  const values: string[] = [];

  if (data.name !== undefined) {
    fields.push('name = ?');
    values.push(data.name);
  }
  if (data.logo_text !== undefined) {
    fields.push('logo_text = ?');
    values.push(data.logo_text);
  }
  if (data.tagline !== undefined) {
    fields.push('tagline = ?');
    values.push(data.tagline);
  }
  if (data.copyright !== undefined) {
    fields.push('copyright = ?');
    values.push(data.copyright);
  }

  if (fields.length === 0) return;

  fields.push('updated_at = CURRENT_TIMESTAMP');
  values.push(String(id));

  const stmt = db.prepare(`UPDATE site_config SET ${fields.join(', ')} WHERE id = ?`);
  stmt.run(...values);
}

export function getAllMenuItems(): MenuItem[] {
  const stmt = db.prepare(`
    SELECT id, label, url, link_type, sort_order, is_active FROM menu
    ORDER BY sort_order ASC
  `);
  return stmt.all() as MenuItem[];
}

export function getMenuItemById(id: number): MenuItem | null {
  const stmt = db.prepare(`SELECT * FROM menu WHERE id = ?`);
  return (stmt.get(id) as MenuItem) || null;
}

export function createMenuItem(data: {
  label: string;
  url: string;
  link_type?: string;
  sort_order?: number;
  is_active?: boolean;
}): MenuItem {
  const stmt = db.prepare(`
    INSERT INTO menu (label, url, link_type, sort_order, is_active)
    VALUES (?, ?, ?, ?, ?)
  `);
  const result = stmt.run(
    data.label,
    data.url,
    data.link_type ?? 'inner',
    data.sort_order ?? 0,
    data.is_active === false ? 0 : 1,
  );
  return getMenuItemById(result.lastInsertRowid as number) as MenuItem;
}

export function updateMenuItem(
  id: number,
  data: {
    label?: string;
    url?: string;
    link_type?: string;
    sort_order?: number;
    is_active?: boolean;
  },
): void {
  const fields: string[] = [];
  const values: (string | number)[] = [];

  if (data.label !== undefined) {
    fields.push('label = ?');
    values.push(data.label);
  }
  if (data.url !== undefined) {
    fields.push('url = ?');
    values.push(data.url);
  }
  if (data.link_type !== undefined) {
    fields.push('link_type = ?');
    values.push(data.link_type);
  }
  if (data.sort_order !== undefined) {
    fields.push('sort_order = ?');
    values.push(data.sort_order);
  }
  if (data.is_active !== undefined) {
    fields.push('is_active = ?');
    values.push(data.is_active ? 1 : 0);
  }

  if (fields.length === 0) return;

  values.push(id);

  const stmt = db.prepare(`UPDATE menu SET ${fields.join(', ')} WHERE id = ?`);
  stmt.run(...values);
}

export function deleteMenuItem(id: number): void {
  const stmt = db.prepare(`DELETE FROM menu WHERE id = ?`);
  stmt.run(id);
}
