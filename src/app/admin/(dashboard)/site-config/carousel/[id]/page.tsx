import { notFound } from 'next/navigation';
import { getAllPhotos, getAllCategories } from '@/lib/repositories/photos';
import { getCarouselItemById } from '@/lib/repositories/homeCarousel';
import PageHeader from '@/components/admin/PageHeader';
import NewCarouselItemForm from '../new/NewCarouselItemForm';

interface EditCarouselItemPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditCarouselItemPage({ params }: EditCarouselItemPageProps) {
  const { id } = await params;
  const item = await getCarouselItemById(Number(id));
  if (!item) notFound();

  const [photos, categories] = await Promise.all([getAllPhotos(), getAllCategories()]);
  const items = photos.map((p) => ({
    id: p.id,
    image_url: p.image_url,
    image_alt: p.image_alt,
    title: p.title,
    description: p.description,
    date: p.date,
    location: p.location,
    category_id: p.category_id,
  }));

  return (
    <div>
      <PageHeader title="编辑轮播项" />
      <NewCarouselItemForm
        photos={items}
        categories={categories.map((c) => ({ id: c.id, name: c.name }))}
        initial={{
          id: item.id,
          title: item.title,
          caption: item.caption,
          photo_id: item.photo_id,
          image_url: item.image_url ?? null,
          image_alt: item.image_alt ?? null,
          date: item.date,
          location: item.location,
          sort_order: item.sort_order,
          is_active: item.is_active,
        }}
      />
    </div>
  );
}
