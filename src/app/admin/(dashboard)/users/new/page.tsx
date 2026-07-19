import Link from 'next/link';
import { getAllRoles } from '@/lib/repositories/userRoles';
import PageHeader from '@/components/admin/PageHeader';
import { FormField, Input, Select, Checkbox } from '@/components/admin/FormFields';
import SubmitButton from '@/components/admin/SubmitButton';
import { createUserAction } from '../actions';

export default async function NewUserPage() {
  const roles = await getAllRoles();

  return (
    <div>
      <PageHeader title="新建用户" />
      <div className="max-w-lg">
        {roles.length === 0 ? (
          <div className="bg-white rounded-lg border border-admin-border p-6">
            <p className="text-admin-muted mb-4">暂无角色，请先创建角色。</p>
            <Link
              href="/admin/roles/new"
              className="px-4 py-2 bg-admin-accent text-white text-sm rounded-md hover:bg-admin-accent-dark transition-colors"
            >
              创建角色
            </Link>
          </div>
        ) : (
          <form action={createUserAction} className="bg-white rounded-lg border border-admin-border p-6">
            <FormField label="用户名" name="username">
              <Input name="username" required placeholder="请输入用户名" />
            </FormField>

            <FormField label="密码" name="password">
              <Input name="password" type="password" required placeholder="请输入密码" />
            </FormField>

            <FormField label="角色" name="role_id">
              <Select name="role_id" required>
                {roles.map((role) => (
                  <option key={role.id} value={role.id}>
                    {role.name}
                  </option>
                ))}
              </Select>
            </FormField>

          <div className="mb-4">
            <Checkbox name="is_active" label="启用" defaultChecked />
          </div>

          <div className="flex items-center gap-3">
            <SubmitButton label="创建用户" />
            <Link
              href="/admin/users"
              className="px-4 py-2 text-sm text-admin-muted hover:text-admin-ink transition-colors"
            >
              取消
            </Link>
          </div>
          </form>
        )}
      </div>
    </div>
  );
}
