import Link from 'next/link';
import PageHeader from '@/components/admin/PageHeader';
import { FormField, Input, Select, Checkbox } from '@/components/admin/FormFields';
import SubmitButton from '@/components/admin/SubmitButton';
import { createMenuItemAction } from '../../actions';

export default function NewMenuItemPage() {
  return (
    <div>
      <PageHeader title="新建菜单项" />
      <div className="max-w-lg">
        <form action={createMenuItemAction} className="bg-white rounded-lg border border-admin-border p-6">
          <FormField label="标签" name="label">
            <Input name="label" required placeholder="请输入菜单标签" />
          </FormField>

          <FormField label="URL" name="url">
            <Input name="url" required placeholder="请输入链接地址" />
          </FormField>

          <FormField label="链接类型" name="link_type">
            <Select name="link_type" defaultValue="inner">
              <option value="inner">内部链接</option>
              <option value="outer">外部链接</option>
              <option value="mini_program">小程序</option>
              <option value="universal_app">Universal App</option>
              <option value="android_app">Android App</option>
              <option value="apple_app">Apple App</option>
            </Select>
          </FormField>

          <FormField label="排序" name="sort_order">
            <Input name="sort_order" type="number" defaultValue="0" />
          </FormField>

          <FormField label="状态" name="is_active">
            <Checkbox name="is_active" label="启用" defaultChecked />
          </FormField>

          <div className="flex items-center gap-3">
            <SubmitButton label="创建菜单项" />
            <Link
              href="/admin/site-config/menu"
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
