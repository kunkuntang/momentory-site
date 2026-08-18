import Link from 'next/link';
import { getAllMenuItems, type MenuItem, type LinkType } from '@/lib/repositories/siteConfig';
import PageHeader from '@/components/admin/PageHeader';
import DataTable, { type Column } from '@/components/admin/DataTable';

const linkTypeLabels: Record<string, string> = {
  inner: '内部链接',
  outer: '外部链接',
  mini_program: '小程序',
  universal_app: 'Universal App',
  android_app: 'Android App',
  apple_app: 'Apple App',
};

export default async function MenuListPage() {
  const items = await getAllMenuItems();

  const columns: Column<MenuItem>[] = [
    { key: 'id', label: 'ID', className: 'w-12' },
    { key: 'label', label: '标签' },
    {
      key: 'url',
      label: 'URL',
      render: (item) => (
        <a
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-admin-accent hover:underline break-all"
        >
          {item.url}
        </a>
      ),
    },
    {
      key: 'link_type',
      label: '链接类型',
      render: (item) => linkTypeLabels[item.link_type] ?? item.link_type,
    },
    { key: 'sort_order', label: '排序' },
    {
      key: 'is_active',
      label: '状态',
      render: (item) => (item.is_active ? '启用' : '禁用'),
    },
    {
      key: 'actions',
      label: '操作',
      render: (item) => (
        <Link
          href={`/admin/site-config/menu/${item.id}`}
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
        title="导航菜单"
        description={`共 ${items.length} 个菜单项`}
        action={{ label: '新建菜单项', href: '/admin/site-config/menu/new' }}
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
