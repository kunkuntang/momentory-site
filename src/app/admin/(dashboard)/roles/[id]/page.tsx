import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getRoleById } from '@/lib/repositories/userRoles';
import PageHeader from '@/components/admin/PageHeader';
import { FormField, Input, Textarea, CheckboxGroup } from '@/components/admin/FormFields';
import SubmitButton from '@/components/admin/SubmitButton';
import DeleteButton from '@/components/admin/DeleteButton';
import { updateRoleAction, deleteRoleAction } from '../actions';

const permissionOptions = [
  { value: 'users', label: '用户管理' },
  { value: 'roles', label: '角色管理' },
  { value: 'photos', label: '照片管理' },
  { value: 'albums', label: '相册管理' },
  { value: 'site-config', label: '站点信息' },
];

function parsePermissions(permissions: string): string[] {
  try {
    const arr = JSON.parse(permissions);
    if (Array.isArray(arr)) {
      return arr.filter((p): p is string => typeof p === 'string');
    }
  } catch {
    // ignore parse errors
  }
  return [];
}

interface EditRolePageProps {
  params: Promise<{ id: string }>;
}

export default async function EditRolePage({ params }: EditRolePageProps) {
  const { id } = await params;
  const role = await getRoleById(Number(id));
  if (!role) notFound();

  const isSuperAdmin = role.name === 'super_admin';
  const defaultPermissions = parsePermissions(role.permissions);

  return (
    <div>
      <PageHeader title="编辑角色" />
      <div className="max-w-lg space-y-6">
        <form action={updateRoleAction} className="bg-white rounded-lg border border-admin-border p-6">
          <input type="hidden" name="id" value={role.id} />

          <FormField label="角色名" name="name">
            <Input name="name" defaultValue={role.name} required />
          </FormField>

          <FormField label="描述" name="description">
            <Textarea name="description" defaultValue={role.description ?? ''} placeholder="请输入角色描述" />
          </FormField>

          <CheckboxGroup
            name="permissions"
            label="权限"
            options={permissionOptions}
            defaultValues={defaultPermissions}
          />

          <div className="flex items-center gap-3">
            <SubmitButton label="保存修改" />
            <Link
              href="/admin/roles"
              className="px-4 py-2 text-sm text-admin-muted hover:text-admin-ink transition-colors"
            >
              返回
            </Link>
          </div>
        </form>

        {!isSuperAdmin && (
          <form action={deleteRoleAction} className="bg-white rounded-lg border border-red-200 p-6">
            <h3 className="text-sm font-medium text-admin-danger mb-2">删除角色</h3>
            <p className="text-sm text-admin-muted mb-4">删除后无法恢复，请谨慎操作。若角色下仍有用户，将无法删除。</p>
            <input type="hidden" name="id" value={role.id} />
            <DeleteButton />
          </form>
        )}
      </div>
    </div>
  );
}
