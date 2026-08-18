import Link from 'next/link';
import { getSiteInfo } from '@/lib/repositories/siteConfig';
import PageHeader from '@/components/admin/PageHeader';
import { FormField, Input } from '@/components/admin/FormFields';
import SubmitButton from '@/components/admin/SubmitButton';
import { updateSiteConfigAction } from '../../actions';

interface EditSiteConfigPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditSiteConfigPage({ params }: EditSiteConfigPageProps) {
  const { id } = await params;
  const siteInfo = await getSiteInfo();

  if (!siteInfo) {
    return (
      <div className="max-w-lg">
        <PageHeader title="编辑站点配置" />
        <div className="bg-white rounded-lg border border-admin-border p-6">
          <p className="text-admin-muted">站点配置不存在，请先创建站点配置。</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="编辑站点配置" />
      <div className="max-w-lg">
        <form action={updateSiteConfigAction} className="bg-white rounded-lg border border-admin-border p-6">
          <input type="hidden" name="id" value={id} />

          <FormField label="站点名称" name="name">
            <Input name="name" defaultValue={siteInfo.name} required />
          </FormField>

          <FormField label="Logo 文字" name="logo_text">
            <Input name="logo_text" defaultValue={siteInfo.logo_text} required />
          </FormField>

          <FormField label="站点标语" name="tagline">
            <Input name="tagline" defaultValue={siteInfo.tagline} required />
          </FormField>

          <FormField label="版权信息" name="copyright">
            <Input name="copyright" defaultValue={siteInfo.copyright} required />
          </FormField>

          <div className="flex items-center gap-3 mt-6">
            <SubmitButton label="保存修改" />
            <Link
              href="/admin/site-config"
              className="px-4 py-2 text-sm text-admin-muted hover:text-admin-ink transition-colors"
            >
              返回
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
