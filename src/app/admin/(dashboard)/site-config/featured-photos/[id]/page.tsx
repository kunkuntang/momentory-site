import { notFound } from 'next/navigation';
import { getAllPhotos, getAllCategories } from '@/lib/repositories/photos';
import { getFeaturedPhotoById } from '@/lib/repositories/featuredPhotos';
import PageHeader from '@/components/admin/PageHeader';
import NewFeaturedPhotoForm from '../new/NewFeaturedPhotoForm';

interface EditFeaturedPhotoPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditFeaturedPhotoPage({ params }: EditFeaturedPhotoPageProps) {
  const { id } = await params;
  const photo = await getFeaturedPhotoById(Number(id));
  if (!photo) notFound();

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
      <PageHeader title="编辑精选照片" />
      <NewFeaturedPhotoForm
        photos={items}
        categories={categories.map((c) => ({ id: c.id, name: c.name }))}
        initial={{
          id: photo.id,
          title: photo.title,
          description: photo.description,
          image_url: photo.image_url,
          image_alt: photo.image_alt,
          date: photo.date,
          location: photo.location,
          sort_order: photo.sort_order,
          is_active: photo.is_active,
        }}
      />
    </div>
  );
}
