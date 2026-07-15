import Link from 'next/link';
import PageHeader from '@/components/admin/PageHeader';
import { FormField, Input, Textarea, CheckboxGroup } from '@/components/admin/FormFields';
import SubmitButton from '@/components/admin/SubmitButton';
import { createRoleAction } from '../actions';

const permissionOptions = [
  { value: 'users', label: '用户管理' },
  { value: 'roles', label: '角色管理' },
  { value: 'photos', label: '照片管理' },
  { value: 'albums', label: '相册管理' },
  { value: 'site-config', label: '站点信息' },
];

export default function NewRolePage() {
  return (
    <div>
      <PageHeader title="新建角色" />
      <div className="max-w-lg">
        <form action={createRoleAction} className="bg-white rounded-lg border border-admin-border p-6">
          <FormField label="角色名" name="name">
            <Input name="name" required placeholder="请输入角色名" />
          </FormField>

          <FormField label="描述" name="description">
            <Textarea name="description" placeholder="请输入角色描述" />
          </FormField>

          <CheckboxGroup name="permissions" label="权限" options={permissionOptions} />

          <div className="flex items-center gap-3">
            <SubmitButton label="创建角色" />
            <Link
              href="/admin/roles"
              className="px-4 py-2 text-sm text-admin-muted hover:text-admin-ink transition-colors"
            >
              取消
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
