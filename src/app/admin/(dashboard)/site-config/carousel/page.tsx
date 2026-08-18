import Link from 'next/link';
import { getAllCarouselItems } from '@/lib/repositories/homeCarousel';
import PageHeader from '@/components/admin/PageHeader';
import DataTable, { type Column } from '@/components/admin/DataTable';
import type { HomeCarouselItem } from '@/lib/repositories/homeCarousel';

export default async function CarouselPage() {
  const items = await getAllCarouselItems();

  const columns: Column<HomeCarouselItem>[] = [
    { key: 'id', label: 'ID', className: 'w-12' },
    {
      key: 'type',
      label: '类型',
      render: (item) => (item.type === 'image' ? '图片' : '视频'),
    },
    { key: 'title', label: '标题' },
    { key: 'date', label: '日期', render: (item) => item.date ?? '-' },
    { key: 'location', label: '位置', render: (item) => item.location ?? '-' },
    { key: 'sort_order', label: '排序' },
    {
      key: 'is_active',
      label: '状态',
      render: (item) => (
        <span className={item.is_active ? 'text-green-600' : 'text-red-600'}>
          {item.is_active ? '启用' : '禁用'}
        </span>
      ),
    },
    {
      key: 'actions',
      label: '操作',
      render: (item) => (
        <Link
          href={`/admin/site-config/carousel/${item.id}`}
          className="text-admin-accent hover:underline text-sm"
        >
          编辑
        </Link>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="首页轮播"
        action={{ label: '新建轮播项', href: '/admin/site-config/carousel/new' }}
      />
      <DataTable columns={columns} data={items} />
      <div className="flex items-center gap-3 mt-6">
        <Link
          href="/admin/site-config"
          className="px-4 py-2 bg-admin-accent text-white text-sm rounded-md hover:bg-admin-accent-dark transition-colors"
        >
          返回
        </Link>
      </div>
    </div>
  );
}
