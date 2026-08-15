import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { PrismaClient } from './generated/client/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';

// ---- 环境安全检测（与 initDb.ts 一致，生产环境禁止 seed）----
const PRODUCTION_ENVS = ['production', 'prod'];
const PRODUCTION_APP_ENVS = ['PROD', 'PRODUCTION'];

function isProduction(): boolean {
  const nodeEnv = (process.env.NODE_ENV || '').toLowerCase();
  const appEnv = (process.env.APP_ENV || '').toUpperCase();
  return PRODUCTION_ENVS.includes(nodeEnv) || PRODUCTION_APP_ENVS.includes(appEnv);
}

if (isProduction()) {
  console.error('========================================');
  console.error('  ERROR: Seed script blocked in production!');
  console.error('========================================');
  process.exit(1);
}

// ---- 创建 Prisma Client（独立实例，不走全局缓存）----
const adapter = new PrismaMariaDb({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'momentory',
});

const prisma = new PrismaClient({ adapter });

// ---- Seed 数据（来源: sql/seed-data.sql）----

const albums = [
  {
    slug: 'coast-light',
    title: '海岸光线',
    summary: '海边、浪花、阴天与突然明亮起来的天空。',
    cover_image_url: 'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=900&q=80',
    cover_image_alt: '海浪拍打岸边',
    is_private: true,
    created_at: new Date('2026-04-01'),
  },
  {
    slug: 'quiet-city',
    title: '安静城市',
    summary: '在街角、站台和玻璃反光里寻找平静。',
    cover_image_url: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&w=900&q=80',
    cover_image_alt: '城市街道与建筑',
    is_private: true,
    created_at: new Date('2026-02-01'),
  },
  {
    slug: 'green-days',
    title: '绿色时日',
    summary: '树影、草地和散步途中遇见的自然切片。',
    cover_image_url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=900&q=80',
    cover_image_alt: '阳光穿过森林',
    is_private: false,
    created_at: new Date('2025-10-01'),
  },
];

const photoCategories = [
  { name: '旅行摄影', description: '记录旅途风景与人' },
  { name: '城市观察', description: '城市街头与建筑' },
  { name: '自然风光', description: '自然景观与生态' },
  { name: '日常记录', description: '生活片段与瞬间' },
];

const photos = [
  // album 1: coast-light
  { album_id: 1, image_url: 'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1200&q=80', image_alt: '海浪拍打岸边', sort_order: 0 },
  { album_id: 1, image_url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80', image_alt: '黄昏时分的海岸与浪花', sort_order: 1 },
  { album_id: 1, image_url: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80', image_alt: '云层下的海边山野', sort_order: 2 },
  { album_id: 1, image_url: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1200&q=80', image_alt: '阳光照在海面的波纹上', sort_order: 3 },
  { album_id: 1, image_url: 'https://images.unsplash.com/photo-1501959915551-4e8b96f9f47c?auto=format&fit=crop&w=1200&q=80', image_alt: '带有礁石的清晨海面', sort_order: 4 },
  { album_id: 1, image_url: 'https://images.unsplash.com/photo-1493558103817-58b2924bce98?auto=format&fit=crop&w=1200&q=80', image_alt: '潮湿空气中的海边步道', sort_order: 5 },
  // album 2: quiet-city
  { album_id: 2, image_url: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&w=1200&q=80', image_alt: '清晨时分的城市街道与建筑', sort_order: 0 },
  { album_id: 2, image_url: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=1200&q=80', image_alt: '傍晚城市交通和街景', sort_order: 1 },
  { album_id: 2, image_url: 'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?auto=format&fit=crop&w=1200&q=80', image_alt: '下雨后的夜晚城市', sort_order: 2 },
  { album_id: 2, image_url: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?auto=format&fit=crop&w=1200&q=80', image_alt: '高楼之间的城市透视', sort_order: 3 },
  { album_id: 2, image_url: 'https://images.unsplash.com/photo-1431274172761-fca41d930114?auto=format&fit=crop&w=1200&q=80', image_alt: '电车经过的城市街角', sort_order: 4 },
  { album_id: 2, image_url: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=1200&q=80', image_alt: '静谧的夜晚街道与灯光', sort_order: 5 },
  // album 3: green-days
  { album_id: 3, image_url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1200&q=80', image_alt: '阳光穿过森林', sort_order: 0 },
  { album_id: 3, image_url: 'https://images.unsplash.com/photo-1473773508845-188df298d2d1?auto=format&fit=crop&w=1200&q=80', image_alt: '树林中的小路', sort_order: 1 },
  { album_id: 3, image_url: 'https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1200&q=80', image_alt: '高处俯瞰的林间道路', sort_order: 2 },
  { album_id: 3, image_url: 'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?auto=format&fit=crop&w=1200&q=80', image_alt: '草地上的白色小花', sort_order: 3 },
  { album_id: 3, image_url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80', image_alt: '山谷中的湖泊与树林', sort_order: 4 },
  { album_id: 3, image_url: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=1200&q=80', image_alt: '树木环绕的山间步道', sort_order: 5 },
];

const homeCarousel = [
  { type: 'video', title: '光影片刻', caption: '一段短暂的动态画面，把风、光和时间一起留在首页。', photo_id: null, video_url: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4', video_poster_url: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=1800&q=82', date: '2026-05-02', location: '日常记录', sort_order: 0, is_active: true },
  { type: 'image', title: '雨后海岸', caption: '潮湿的风从海面吹来，暮色像一层薄纱落在礁石上。', photo_id: 2, video_url: null, video_poster_url: null, date: '2026-04-18', location: '福建 平潭', sort_order: 1, is_active: true },
  { type: 'image', title: '山间清晨', caption: '第一束光越过山脊，云雾在树梢之间慢慢散开。', photo_id: 3, video_url: null, video_poster_url: null, date: '2026-03-09', location: '浙江 莫干山', sort_order: 2, is_active: true },
  { type: 'image', title: '城市夜行', caption: '路灯、橱窗和雨水把夜晚折叠成一条发亮的街。', photo_id: 8, video_url: null, video_poster_url: null, date: '2025-12-27', location: '上海 徐汇', sort_order: 3, is_active: true },
];

const featuredPhotos = [
  { title: '窗边的蓝', description: '午后的房间只剩下风和一点蓝色，适合把时间放慢。', date: '2026-01-16', location: '杭州', image_url: 'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1100&q=80', image_alt: '明亮窗边的室内空间', sort_order: 0, is_active: true },
  { title: '林中小径', description: '没有目的地的一段路，反而最容易留下清晰的记忆。', date: '2025-11-02', location: '南京', image_url: 'https://images.unsplash.com/photo-1473773508845-188df298d2d1?auto=format&fit=crop&w=1100&q=80', image_alt: '树林中的小路', sort_order: 1, is_active: true },
  { title: '傍晚车站', description: '人群散去之后，站台把一天最后的光留了下来。', date: '2025-09-21', location: '苏州', image_url: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=1100&q=80', image_alt: '傍晚城市交通和街景', sort_order: 2, is_active: true },
];

const siteConfig = {
  name: 'Momentory',
  logo_text: 'M',
  tagline: '把日常光影收藏成册',
  copyright: 'Copyright 2026 Momentory. All rights reserved.',
};

const menuItems = [
  { label: '首页', url: '/', link_type: 'inner', sort_order: 0, is_active: true },
  { label: '相册', url: '/albums', link_type: 'inner', sort_order: 1, is_active: true },
  { label: '关于', url: '/about', link_type: 'inner', sort_order: 2, is_active: true },
];

// ---- 执行 Seed ----

async function main() {
  console.log('Seeding database...');

  // 1. 清空旧数据（按外键依赖顺序）
  console.log('  Clearing existing data...');
  await prisma.user.deleteMany();
  await prisma.userRole.deleteMany();
  await prisma.menu.deleteMany();
  await prisma.siteConfig.deleteMany();
  await prisma.featuredPhoto.deleteMany();
  await prisma.homeCarousel.deleteMany();
  await prisma.photo.deleteMany();
  await prisma.photoCategory.deleteMany();
  await prisma.album.deleteMany();

  // 2. 相册
  console.log('  Inserting albums...');
  for (const album of albums) {
    await prisma.album.create({ data: album });
  }

  // 3. 照片分类
  console.log('  Inserting photo categories...');
  for (const category of photoCategories) {
    await prisma.photoCategory.create({ data: category });
  }

  // 4. 照片
  console.log('  Inserting photos...');
  for (const photo of photos) {
    await prisma.photo.create({ data: photo });
  }

  // 5. 首页轮播图
  console.log('  Inserting home carousel...');
  for (const item of homeCarousel) {
    await prisma.homeCarousel.create({ data: item });
  }

  // 6. 精选照片
  console.log('  Inserting featured photos...');
  for (const photo of featuredPhotos) {
    await prisma.featuredPhoto.create({ data: photo });
  }

  // 7. 站点配置
  console.log('  Inserting site config...');
  await prisma.siteConfig.create({ data: siteConfig });

  // 8. 菜单
  console.log('  Inserting menu items...');
  for (const item of menuItems) {
    await prisma.menu.create({ data: item });
  }

  // 9. 用户角色 + 管理员用户
  console.log('  Inserting user role and admin user...');
  await prisma.userRole.create({
    data: {
      name: 'super_admin',
      description: '超级管理员，拥有全部权限',
      permissions: '["*"]',
    },
  });

  const adminPassword = process.env.ADMIN_DEFAULT_PASSWORD;
  if (!adminPassword) {
    throw new Error('ADMIN_DEFAULT_PASSWORD environment variable is not set');
  }
  if (adminPassword.length < 8) {
    throw new Error('ADMIN_DEFAULT_PASSWORD must be at least 8 characters long');
  }

  const adminUsername = process.env.ADMIN_DEFAULT_USERNAME || 'cb_mome_root';
  const passwordHash = bcrypt.hashSync(adminPassword, 10);

  await prisma.user.create({
    data: {
      username: adminUsername,
      password_hash: passwordHash,
      role_id: 1,
      is_active: true,
    },
  });

  console.log('Database seeded successfully!');
  console.log(`  Admin account: ${adminUsername}`);
}

main()
  .catch((error) => {
    console.error('Seed failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
