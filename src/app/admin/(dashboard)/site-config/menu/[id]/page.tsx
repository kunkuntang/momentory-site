import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getMenuItemById } from '@/lib/repositories/siteConfig';
import PageHeader from '@/components/admin/PageHeader';
import { FormField, Input, Select, Checkbox } from '@/components/admin/FormFields';
import SubmitButton from '@/components/admin/SubmitButton';
import DeleteButton from '@/components/admin/DeleteButton';
import { updateMenuItemAction, deleteMenuItemAction } from '../../actions';

interface EditMenuItemPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditMenuItemPage({ params }: EditMenuItemPageProps) {
  const { id } = await params;
  const item = await getMenuItemById(Number(id));
  if (!item) notFound();

  return (
    <div>
      <PageHeader title="编辑菜单项" />
      <div className="max-w-lg space-y-6">
        <form action={updateMenuItemAction} className="bg-white rounded-lg border border-admin-border p-6">
          <input type="hidden" name="id" value={item.id} />

          <FormField label="标签" name="label">
            <Input name="label" defaultValue={item.label} required />
          </FormField>

          <FormField label="URL" name="url">
            <Input name="url" defaultValue={item.url} required />
          </FormField>

          <FormField label="链接类型" name="link_type">
            <Select name="link_type" defaultValue={item.link_type}>
              <option value="inner">内部链接</option>
              <option value="outer">外部链接</option>
              <option value="mini_program">小程序</option>
              <option value="universal_app">Universal App</option>
              <option value="android_app">Android App</option>
              <option value="apple_app">Apple App</option>
            </Select>
          </FormField>

          <FormField label="排序" name="sort_order">
            <Input name="sort_order" type="number" defaultValue={item.sort_order} />
          </FormField>

          <FormField label="状态" name="is_active">
            <Checkbox name="is_active" label="启用" defaultChecked={!!item.is_active} />
          </FormField>

          <div className="flex items-center gap-3">
            <SubmitButton label="保存修改" />
            <Link
              href="/admin/site-config/menu"
              className="px-4 py-2 text-sm text-admin-muted hover:text-admin-ink transition-colors"
            >
              返回
            </Link>
          </div>
        </form>

        <form action={deleteMenuItemAction} className="bg-white rounded-lg border border-red-200 p-6">
          <h3 className="text-sm font-medium text-admin-danger mb-2">删除菜单项</h3>
          <p className="text-sm text-admin-muted mb-4">删除后无法恢复，请谨慎操作。</p>
          <input type="hidden" name="id" value={item.id} />
          <DeleteButton />
        </form>
      </div>
    </div>
  );
}
