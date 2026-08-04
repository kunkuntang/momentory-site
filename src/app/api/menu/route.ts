import { NextResponse } from 'next/server';
import { getMenuItems, getAllMenuItems } from '@/lib/repositories/siteConfig';

export const revalidate = 3600;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const includeInactive = searchParams.get('include_inactive') === 'true';

    const menuItems = includeInactive
      ? await getAllMenuItems()
      : await getMenuItems();

    return NextResponse.json({
      success: true,
      data: menuItems,
    }, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  } catch (error) {
    console.error('Get menu items error:', error);
    return NextResponse.json(
      { success: false, message: '获取菜单数据失败' },
      { status: 500 }
    );
  }
}
