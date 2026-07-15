import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getUserById } from '@/lib/repositories/users';
import { getAllRoles } from '@/lib/repositories/userRoles';
import PageHeader from '@/components/admin/PageHeader';
import { FormField, Input, Select, Checkbox } from '@/components/admin/FormFields';
import SubmitButton from '@/components/admin/SubmitButton';
import DeleteButton from '@/components/admin/DeleteButton';
import { updateUserAction, deleteUserAction } from '../actions';

interface EditUserPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditUserPage({ params }: EditUserPageProps) {
  const { id } = await params;
  const user = getUserById(Number(id));
  if (!user) notFound();

  const roles = getAllRoles();
  const isSuperAdmin = user.username === 'cb_mome_root';

  return (
    <div>
      <PageHeader title="编辑用户" />
      <div className="max-w-lg space-y-6">
        <form action={updateUserAction} className="bg-white rounded-lg border border-admin-border p-6">
          <input type="hidden" name="id" value={user.id} />

          <FormField label="用户名" name="username">
            <Input name="username" defaultValue={user.username} required />
          </FormField>

          <FormField label="角色" name="role_id">
            <Select name="role_id" required disabled={isSuperAdmin}>
              {roles.map((role) => (
                <option key={role.id} value={role.id} selected={role.id === user.role_id}>
                  {role.name}
                </option>
              ))}
            </Select>
          </FormField>

          <FormField label="重置密码" name="password" hint="留空则不修改密码">
            <Input name="password" type="password" placeholder="输入新密码" />
          </FormField>

          <div className="mb-4">
            <Checkbox name="is_active" label="启用" defaultChecked={!!user.is_active} />
          </div>

          <div className="flex items-center gap-3">
            <SubmitButton label="保存修改" />
            <Link
              href="/admin/users"
              className="px-4 py-2 text-sm text-admin-muted hover:text-admin-ink transition-colors"
            >
              返回
            </Link>
          </div>
        </form>

        {!isSuperAdmin && (
          <form action={deleteUserAction} className="bg-white rounded-lg border border-red-200 p-6">
            <h3 className="text-sm font-medium text-admin-danger mb-2">删除用户</h3>
            <p className="text-sm text-admin-muted mb-4">删除后无法恢复，请谨慎操作。</p>
            <input type="hidden" name="id" value={user.id} />
            <DeleteButton />
          </form>
        )}
      </div>
    </div>
  );
}
