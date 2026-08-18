import PageHeader from '@/components/admin/PageHeader';
import { getAllPhotos, getAllCategories } from '@/lib/repositories/photos';
import NewFeaturedPhotoForm from './NewFeaturedPhotoForm';

export default async function NewFeaturedPhotoPage() {
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
      <PageHeader title="新建精选照片" />
      <NewFeaturedPhotoForm
        photos={items}
        categories={categories.map((c) => ({ id: c.id, name: c.name }))}
      />
    </div>
  );
}
