import Link from 'next/link';
import { getSiteInfo, getAllMenuItems } from '@/lib/repositories/siteConfig';
import { getAllFeaturedPhotos } from '@/lib/repositories/featuredPhotos';
import { getAllCarouselItems } from '@/lib/repositories/homeCarousel';
import PageHeader from '@/components/admin/PageHeader';

export default function SiteConfigPage() {
  const siteInfo = getSiteInfo();
  const menuCount = getAllMenuItems().length;
  const featuredPhotoCount = getAllFeaturedPhotos().length;
  const carouselCount = getAllCarouselItems().length;

  const cards = [
    {
      title: '站点配置',
      href: '/admin/site-config/site/1',
      description: `当前站点：${siteInfo.name}`,
    },
    {
      title: '导航菜单',
      href: '/admin/site-config/menu',
      description: `共 ${menuCount} 个菜单项`,
    },
    {
      title: '精选照片',
      href: '/admin/site-config/featured-photos',
      description: `共 ${featuredPhotoCount} 条精选照片`,
    },
    {
      title: '首页轮播',
      href: '/admin/site-config/carousel',
      description: `共 ${carouselCount} 条轮播内容`,
    },
  ];

  return (
    <div>
      <PageHeader title="站点信息管理" />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="bg-white rounded-lg border border-admin-border p-5 hover:shadow-sm transition-shadow block"
          >
            <h3 className="text-base font-medium text-admin-ink">{card.title}</h3>
            <p className="text-sm text-admin-muted mt-1">{card.description}</p>
            <span className="text-sm text-admin-accent mt-3 inline-block">管理 →</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
