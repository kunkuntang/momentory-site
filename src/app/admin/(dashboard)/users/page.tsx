import Link from 'next/link';
import { getAllUsers } from '@/lib/repositories/users';
import PageHeader from '@/components/admin/PageHeader';
import DataTable, { type Column } from '@/components/admin/DataTable';
import type { UserListItem } from '@/lib/repositories/users';

export default async function UsersPage() {
  const users = await getAllUsers();

  const columns: Column<UserListItem>[] = [
    { key: 'id', label: 'ID', className: 'w-12' },
    { key: 'username', label: '用户名' },
    { key: 'role_name', label: '角色' },
    {
      key: 'is_active',
      label: '状态',
      render: (item) => (
        <span className={item.is_active ? 'text-green-600' : 'text-red-600'}>
          {item.is_active ? '正常' : '禁用'}
        </span>
      ),
    },
    {
      key: 'last_login_at',
      label: '最后登录',
      render: (item) => item.last_login_at ? item.last_login_at.toLocaleString() : '-',
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
          href={`/admin/users/${item.id}`}
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
        title="用户管理"
        description={`共 ${users.length} 个用户`}
        action={{ label: '新建用户', href: '/admin/users/new' }}
      />
      <DataTable columns={columns} data={users} />
    </div>
  );
}
