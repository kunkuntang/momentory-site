import Link from 'next/link';
import { getAllRoles } from '@/lib/repositories/userRoles';
import PageHeader from '@/components/admin/PageHeader';
import DataTable, { type Column } from '@/components/admin/DataTable';
import type { UserRoleWithCount } from '@/lib/repositories/userRoles';

const permissionLabels: Record<string, string> = {
  users: '用户管理',
  roles: '角色管理',
  photos: '照片管理',
  albums: '相册管理',
  'site-config': '站点信息',
  '*': '全部权限',
};

function formatPermissions(permissions: string): string {
  try {
    const arr = JSON.parse(permissions) as string[];
    if (!Array.isArray(arr) || arr.length === 0) return '-';
    return arr.map((p) => permissionLabels[p] ?? p).join(', ');
  } catch {
    return '-';
  }
}

export default async function RolesPage() {
  const roles = await getAllRoles();

  const columns: Column<UserRoleWithCount>[] = [
    { key: 'id', label: 'ID', className: 'w-12' },
    { key: 'name', label: '角色名' },
    {
      key: 'description',
      label: '描述',
      render: (item) => item.description ?? '-',
    },
    {
      key: 'permissions',
      label: '权限',
      render: (item) => formatPermissions(item.permissions),
    },
    {
      key: 'user_count',
      label: '用户数',
      render: (item) => item.user_count,
    },
    {
      key: "created_at",
      label: "创建时间",
      render: (item) => item.created_at.toLocaleString(),
    },
    {
      key: 'actions',
      label: '操作',
      render: (item) => (
        <Link
          href={`/admin/roles/${item.id}`}
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
        title="角色管理"
        description={`共 ${roles.length} 个角色`}
        action={{ label: '新建角色', href: '/admin/roles/new' }}
      />
      <DataTable columns={columns} data={roles} />
    </div>
  );
}
