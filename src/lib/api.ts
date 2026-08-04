export interface MenuItemAPI {
  id: number;
  label: string;
  url: string;
  link_type: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export async function fetchMenuItems(includeInactive: boolean = false): Promise<MenuItemAPI[]> {
  const params = new URLSearchParams();
  if (includeInactive) {
    params.append('include_inactive', 'true');
  }

  const response = await fetch(`${API_BASE_URL}/api/menu?${params.toString()}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    next: {
      revalidate: 3600,
    },
  });

  if (!response.ok) {
    throw new Error('获取菜单数据失败');
  }

  const result = await response.json();

  if (!result.success) {
    throw new Error(result.message || '获取菜单数据失败');
  }

  return result.data as MenuItemAPI[];
}

export async function fetchMenuItemsClient(includeInactive: boolean = false): Promise<MenuItemAPI[]> {
  const params = new URLSearchParams();
  if (includeInactive) {
    params.append('include_inactive', 'true');
  }

  const response = await fetch(`/api/menu?${params.toString()}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    cache: 'force-cache',
  });

  if (!response.ok) {
    throw new Error('获取菜单数据失败');
  }

  const result = await response.json();

  if (!result.success) {
    throw new Error(result.message || '获取菜单数据失败');
  }

  return result.data as MenuItemAPI[];
}
