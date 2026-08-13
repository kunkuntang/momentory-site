SET FOREIGN_KEY_CHECKS=0;

DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS user_roles;
DROP TABLE IF EXISTS site_config;
DROP TABLE IF EXISTS menu;
DROP TABLE IF EXISTS featured_photos;
DROP TABLE IF EXISTS home_carousel;
DROP TABLE IF EXISTS photos;
DROP TABLE IF EXISTS photo_categories;
DROP TABLE IF EXISTS albums;

SET FOREIGN_KEY_CHECKS=1;

CREATE TABLE albums (
  id INT AUTO_INCREMENT PRIMARY KEY,
  slug VARCHAR(128) UNIQUE NOT NULL,
  title VARCHAR(255) NOT NULL,
  summary TEXT,
  cover_image_url VARCHAR(512),
  cover_image_alt VARCHAR(255),
  is_private TINYINT(1) DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE photo_categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(64) UNIQUE NOT NULL,
  description TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE photos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  album_id INT NOT NULL,
  image_url VARCHAR(512) NOT NULL,
  image_alt VARCHAR(255),
  title VARCHAR(255),
  description TEXT,
  category_id INT,
  is_live TINYINT(1) DEFAULT 0,
  live_mp4_url VARCHAR(512),
  date VARCHAR(32),
  location VARCHAR(128),
  exif_make VARCHAR(64),
  exif_model VARCHAR(64),
  exif_lens VARCHAR(128),
  exif_f_number VARCHAR(16),
  exif_exposure VARCHAR(32),
  exif_iso VARCHAR(16),
  exif_focal VARCHAR(16),
  sort_order INT DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (album_id) REFERENCES albums(id) ON DELETE CASCADE,
  FOREIGN KEY (category_id) REFERENCES photo_categories(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE home_carousel (
  id INT AUTO_INCREMENT PRIMARY KEY,
  type VARCHAR(16) NOT NULL,
  title VARCHAR(255) NOT NULL,
  caption TEXT,
  photo_id INT,
  photo_live_poster_url VARCHAR(512),
  video_url VARCHAR(512),
  video_id INT,
  video_poster_url VARCHAR(512),
  date VARCHAR(32),
  location VARCHAR(128),
  sort_order INT DEFAULT 0,
  is_active TINYINT(1) DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT chk_home_carousel_type CHECK (type IN ('image', 'video'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE featured_photos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  date VARCHAR(32),
  location VARCHAR(128),
  image_url VARCHAR(512) NOT NULL,
  image_alt VARCHAR(255),
  sort_order INT DEFAULT 0,
  is_active TINYINT(1) DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE site_config (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(128) NOT NULL,
  logo_text VARCHAR(32) NOT NULL,
  tagline VARCHAR(255) NOT NULL,
  copyright VARCHAR(255) NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE menu (
  id INT AUTO_INCREMENT PRIMARY KEY,
  label VARCHAR(64) NOT NULL,
  url VARCHAR(512) NOT NULL,
  link_type VARCHAR(32) NOT NULL DEFAULT 'inner',
  sort_order INT DEFAULT 0,
  is_active TINYINT(1) DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT chk_menu_link_type CHECK (link_type IN ('inner', 'outer', 'mini_program', 'universal_app', 'android_app', 'apple_app'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE user_roles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(64) UNIQUE NOT NULL,
  description TEXT,
  permissions VARCHAR(512) NOT NULL DEFAULT '[]',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(64) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role_id INT NOT NULL,
  is_active TINYINT(1) DEFAULT 1,
  last_login_at DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (role_id) REFERENCES user_roles(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_photos_album_id ON photos(album_id);
CREATE INDEX idx_albums_slug ON albums(slug);
CREATE INDEX idx_home_carousel_sort ON home_carousel(sort_order, is_active);
CREATE INDEX idx_featured_photos_sort ON featured_photos(sort_order, is_active);
CREATE INDEX idx_menu_sort ON menu(sort_order, is_active);
CREATE INDEX idx_users_username ON users(username);