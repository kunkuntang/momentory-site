import { redirect } from 'next/navigation';
import AlbumDetailPage from '../../../views/AlbumDetailPage';
import { getAlbumBySlug } from '../../../lib/repositories/albums';

interface IAlbumPageProps {
  params: Promise<{
    albumId: string;
  }>;
}

export default async function Page(props: IAlbumPageProps) {
  const { albumId } = await props.params;
  const album = getAlbumBySlug(albumId);

  if (!album) {
    redirect('/albums');
  }

  return <AlbumDetailPage album={album} />;
}