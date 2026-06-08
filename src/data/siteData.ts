const siteData = {
  site: {
    name: 'Momentory',
    logoText: 'M',
    tagline: '把日常光影收藏成册',
    copyright: 'Copyright 2026 Momentory. All rights reserved.',
  },
  navigation: [
    {
      label: '首页',
      url: '/',
    },
    {
      label: '相册',
      url: '/albums',
    },
    {
      label: '关于',
      url: '/about',
    },
  ],
  heroSlides: [
    {
      title: '雨后海岸',
      caption: '潮湿的风从海面吹来，暮色像一层薄纱落在礁石上。',
      date: '2026-04-18',
      location: '福建 平潭',
      imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1800&q=82',
      imageAlt: '雨后傍晚的海岸线',
    },
    {
      title: '山间清晨',
      caption: '第一束光越过山脊，云雾在树梢之间慢慢散开。',
      date: '2026-03-09',
      location: '浙江 莫干山',
      imageUrl: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1800&q=82',
      imageAlt: '晨光中的山野和森林',
    },
    {
      title: '城市夜行',
      caption: '路灯、橱窗和雨水把夜晚折叠成一条发亮的街。',
      date: '2025-12-27',
      location: '上海 徐汇',
      imageUrl: 'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?auto=format&fit=crop&w=1800&q=82',
      imageAlt: '夜晚城市中的光影',
    },
  ],
  latestAlbums: [
    {
      id: 'coast-light',
      title: '海岸光线',
      summary: '海边、浪花、阴天与突然明亮起来的天空。',
      date: '2026-04',
      photoCount: 18,
      coverImageUrl: 'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=900&q=80',
      coverImageAlt: '海浪拍打岸边',
    },
    {
      id: 'quiet-city',
      title: '安静城市',
      summary: '在街角、站台和玻璃反光里寻找平静。',
      date: '2026-02',
      photoCount: 24,
      coverImageUrl: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&w=900&q=80',
      coverImageAlt: '城市街道与建筑',
    },
    {
      id: 'green-days',
      title: '绿色时日',
      summary: '树影、草地和散步途中遇见的自然切片。',
      date: '2025-10',
      photoCount: 15,
      coverImageUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=900&q=80',
      coverImageAlt: '阳光穿过森林',
    },
  ],
  featuredPhotos: [
    {
      title: '窗边的蓝',
      description: '午后的房间只剩下风和一点蓝色，适合把时间放慢。',
      date: '2026-01-16',
      location: '杭州',
      imageUrl: 'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1100&q=80',
      imageAlt: '明亮窗边的室内空间',
    },
    {
      title: '林中小径',
      description: '没有目的地的一段路，反而最容易留下清晰的记忆。',
      date: '2025-11-02',
      location: '南京',
      imageUrl: 'https://images.unsplash.com/photo-1473773508845-188df298d2d1?auto=format&fit=crop&w=1100&q=80',
      imageAlt: '树林中的小路',
    },
    {
      title: '傍晚车站',
      description: '人群散去之后，站台把一天最后的光留了下来。',
      date: '2025-09-21',
      location: '苏州',
      imageUrl: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=1100&q=80',
      imageAlt: '傍晚城市交通和街景',
    },
  ],
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
} as const;

export type SiteData = typeof siteData;
export type Album = SiteData['latestAlbums'][number];
export type FeaturePhoto = SiteData['featuredPhotos'][number];
export type NavigationItem = SiteData['navigation'][number];
export default siteData;
