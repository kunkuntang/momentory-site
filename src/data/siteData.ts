import { cache } from 'react';
import { getAllAlbums, getAlbumBySlug, type Album, type Photo } from '../lib/repositories/albums';
import { getActiveCarouselItems, type HomeCarouselItem } from '../lib/repositories/homeCarousel';
import { getActiveFeaturedPhotos, type FeaturedPhoto } from '../lib/repositories/featuredPhotos';
import { getSiteInfo, getMenuItems, type MenuItem } from '../lib/repositories/siteConfig';

export interface SiteData {
  site: {
    name: string;
    logoText: string;
    tagline: string;
    copyright: string;
  };
  navigation: Array<{
    label: string;
    url: string;
    linkType: string;
  }>;
  heroSlides: HomeCarouselItem[];
  latestAlbums: Album[];
  featuredPhotos: FeaturedPhoto[];
  profile: {
    name: string;
    role: string;
    bio: string;
    avatarUrl: string;
    avatarAlt: string;
  };
  about: {
    title: string;
    description: string;
    owner: string;
    email: string;
    location: string;
    interests: string[];
  };
}

export const getSiteData = cache(async function getSiteData(): Promise<SiteData> {
  // console.log('getSiteData');
  const siteInfo = await getSiteInfo();
  const menuItems = await getMenuItems();
  const carouselItems = await getActiveCarouselItems();
  const albums = await getAllAlbums();
  const featured = await getActiveFeaturedPhotos();

  return {
    site: {
      name: siteInfo.name,
      logoText: siteInfo.logo_text,
      tagline: siteInfo.tagline,
      copyright: siteInfo.copyright,
    },
    navigation: menuItems.map((item) => ({
      label: item.label,
      url: item.url,
      linkType: item.link_type,
    })),
    heroSlides: carouselItems,
    latestAlbums: albums,
    featuredPhotos: featured,
    profile: {
      name: '摄影记录者',
      role: '生活方式与旅行摄影',
      bio: '用轻盈的方式记录日常、旅途和人与环境之间的细节。',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=420&q=80',
      avatarAlt: '摄影者头像',
    },
    about: {
      title: '关于 Momentory',
      description: 'Momentory 是一个私人照片归档网站，用来整理旅行、城市漫步和日常生活中的影像片段。网站保持轻量、留白和可持续更新，让照片拥有足够安静的观看空间。',
      owner: '摄影记录者',
      email: 'hello@momentory.example',
      location: '中国 上海',
      interests: ['旅行摄影', '城市观察', '自然光', '影像叙事'],
    },
  };
});

export type AlbumWithPhotos = Album & { photos: Photo[] };
export type AlbumPhoto = Photo;
export type FeaturePhoto = FeaturedPhoto;
export type NavigationItem = SiteData['navigation'][number];

export async function findAlbumById(albumId: string): Promise<AlbumWithPhotos | null> {
  return await getAlbumBySlug(albumId);
}

export default getSiteData;
