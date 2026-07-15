PRAGMA foreign_keys = ON;

DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS user_roles;
DROP TABLE IF EXISTS site_config;
DROP TABLE IF EXISTS menu;
DROP TABLE IF EXISTS featured_photos;
DROP TABLE IF EXISTS home_carousel;
DROP TABLE IF EXISTS photo_categories;
DROP TABLE IF EXISTS photos;
DROP TABLE IF EXISTS albums;

CREATE TABLE albums (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug VARCHAR(128) UNIQUE NOT NULL,
  title VARCHAR(255) NOT NULL,
  summary TEXT,
  cover_image_url VARCHAR(512),
  cover_image_alt VARCHAR(255),
  is_private BOOLEAN DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE photos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  album_id INTEGER NOT NULL,
  image_url VARCHAR(512) NOT NULL,
  image_alt VARCHAR(255),
  title VARCHAR(255),
  description TEXT,
  category_id INTEGER,
  is_live BOOLEAN DEFAULT 0,
  live_mp4_url VARCHAR(512),
  date VARCHAR(32),
  location VARCHAR(128),
  sort_order INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (album_id) REFERENCES albums(id) ON DELETE CASCADE,
  FOREIGN KEY (category_id) REFERENCES photo_categories(id) ON DELETE SET NULL
);

CREATE TABLE photo_categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name VARCHAR(64) UNIQUE NOT NULL,
  description TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE home_carousel (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  type VARCHAR(16) NOT NULL CHECK (type IN ('image', 'video')),
  title VARCHAR(255) NOT NULL,
  caption TEXT,
  photo_id INTEGER,
  photo_live_poster_url VARCHAR(512),
  video_url VARCHAR(512),
  video_id INTEGER,
  video_poster_url VARCHAR(512),
  date VARCHAR(32),
  location VARCHAR(128),
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE featured_photos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  date VARCHAR(32),
  location VARCHAR(128),
  image_url VARCHAR(512) NOT NULL,
  image_alt VARCHAR(255),
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE site_config (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name VARCHAR(128) NOT NULL,
  logo_text VARCHAR(32) NOT NULL,
  tagline VARCHAR(255) NOT NULL,
  copyright VARCHAR(255) NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE menu (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  label VARCHAR(64) NOT NULL,
  url VARCHAR(512) NOT NULL,
  link_type VARCHAR(32) NOT NULL DEFAULT 'inner' CHECK (link_type IN ('inner', 'outer', 'mini_program', 'universal_app', 'android_app', 'apple_app')),
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO albums (slug, title, summary, cover_image_url, cover_image_alt, is_private, created_at) VALUES
('coast-light', '海岸光线', '海边、浪花、阴天与突然明亮起来的天空。', 'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=900&q=80', '海浪拍打岸边', 1, '2026-04-01'),
('quiet-city', '安静城市', '在街角、站台和玻璃反光里寻找平静。', 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&w=900&q=80', '城市街道与建筑', 1, '2026-02-01'),
('green-days', '绿色时日', '树影、草地和散步途中遇见的自然切片。', 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=900&q=80', '阳光穿过森林', 0, '2025-10-01');

INSERT INTO photo_categories (name, description) VALUES
('旅行摄影', '记录旅途风景与人'),
('城市观察', '城市街头与建筑'),
('自然风光', '自然景观与生态'),
('日常记录', '生活片段与瞬间');

INSERT INTO photos (album_id, image_url, image_alt, sort_order) VALUES
(1, 'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1200&q=80', '海浪拍打岸边', 0),
(1, 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80', '黄昏时分的海岸与浪花', 1),
(1, 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80', '云层下的海边山野', 2),
(1, 'https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1200&q=80', '阳光照在海面的波纹上', 3),
(1, 'https://images.unsplash.com/photo-1501959915551-4e8b96f9f47c?auto=format&fit=crop&w=1200&q=80', '带有礁石的清晨海面', 4),
(1, 'https://images.unsplash.com/photo-1493558103817-58b2924bce98?auto=format&fit=crop&w=1200&q=80', '潮湿空气中的海边步道', 5),
(2, 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&w=1200&q=80', '清晨时分的城市街道与建筑', 0),
(2, 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=1200&q=80', '傍晚城市交通和街景', 1),
(2, 'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?auto=format&fit=crop&w=1200&q=80', '下雨后的夜晚城市', 2),
(2, 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?auto=format&fit=crop&w=1200&q=80', '高楼之间的城市透视', 3),
(2, 'https://images.unsplash.com/photo-1431274172761-fca41d930114?auto=format&fit=crop&w=1200&q=80', '电车经过的城市街角', 4),
(2, 'https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=1200&q=80', '静谧的夜晚街道与灯光', 5),
(3, 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1200&q=80', '阳光穿过森林', 0),
(3, 'https://images.unsplash.com/photo-1473773508845-188df298d2d1?auto=format&fit=crop&w=1200&q=80', '树林中的小路', 1),
(3, 'https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1200&q=80', '高处俯瞰的林间道路', 2),
(3, 'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?auto=format&fit=crop&w=1200&q=80', '草地上的白色小花', 3),
(3, 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80', '山谷中的湖泊与树林', 4),
(3, 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=1200&q=80', '树木环绕的山间步道', 5);

INSERT INTO home_carousel (type, title, caption, photo_id, video_url, video_poster_url, date, location, sort_order, is_active) VALUES
('video', '光影片刻', '一段短暂的动态画面，把风、光和时间一起留在首页。', NULL, 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4', 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=1800&q=82', '2026-05-02', '日常记录', 0, 1),
('image', '雨后海岸', '潮湿的风从海面吹来，暮色像一层薄纱落在礁石上。', 2, NULL, NULL, '2026-04-18', '福建 平潭', 1, 1),
('image', '山间清晨', '第一束光越过山脊，云雾在树梢之间慢慢散开。', 3, NULL, NULL, '2026-03-09', '浙江 莫干山', 2, 1),
('image', '城市夜行', '路灯、橱窗和雨水把夜晚折叠成一条发亮的街。', 8, NULL, NULL, '2025-12-27', '上海 徐汇', 3, 1);

INSERT INTO featured_photos (title, description, date, location, image_url, image_alt, sort_order, is_active) VALUES
('窗边的蓝', '午后的房间只剩下风和一点蓝色，适合把时间放慢。', '2026-01-16', '杭州', 'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1100&q=80', '明亮窗边的室内空间', 0, 1),
('林中小径', '没有目的地的一段路，反而最容易留下清晰的记忆。', '2025-11-02', '南京', 'https://images.unsplash.com/photo-1473773508845-188df298d2d1?auto=format&fit=crop&w=1100&q=80', '树林中的小路', 1, 1),
('傍晚车站', '人群散去之后，站台把一天最后的光留了下来。', '2025-09-21', '苏州', 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=1100&q=80', '傍晚城市交通和街景', 2, 1);

INSERT INTO site_config (name, logo_text, tagline, copyright) VALUES
('Momentory', 'M', '把日常光影收藏成册', 'Copyright 2026 Momentory. All rights reserved.');

INSERT INTO menu (label, url, link_type, sort_order, is_active) VALUES
('首页', '/', 'inner', 0, 1),
('相册', '/albums', 'inner', 1, 1),
('关于', '/about', 'inner', 2, 1);

CREATE TABLE user_roles (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name VARCHAR(64) UNIQUE NOT NULL,
  description TEXT,
  permissions TEXT NOT NULL DEFAULT '[]',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username VARCHAR(64) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role_id INTEGER NOT NULL,
  is_active BOOLEAN DEFAULT 1,
  last_login_at DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (role_id) REFERENCES user_roles(id) ON DELETE RESTRICT
);

INSERT INTO user_roles (name, description, permissions) VALUES
('super_admin', '超级管理员，拥有全部权限', '["*"]');
