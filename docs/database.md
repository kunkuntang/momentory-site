# Momentory 数据库设计文档

## 概述

本数据库设计用于存储 Momentory 相册网站的所有数据，包括相册、照片、分类、首页轮播图、精选照片和导航菜单。数据库采用 SQLite 存储，文件位于 `db/momentory.sqlite`。

## 数据库配置

- **数据库类型**: SQLite 3
- **数据库文件**: `db/momentory.sqlite`
- **连接方式**: `better-sqlite3`
- **事务模式**: WAL (Write-Ahead Logging)
- **外键约束**: 启用

## 数据表设计

### 1. albums（相册表）

存储相册的基本信息。

| 字段名               | 类型           | 约束                         | 说明           |
| ----------------- | ------------ | -------------------------- | ------------ |
| id                | INTEGER      | PRIMARY KEY AUTOINCREMENT  | 相册唯一标识       |
| slug              | VARCHAR(128) | UNIQUE NOT NULL            | 相册别名（用于 URL） |
| title             | VARCHAR(255) | NOT NULL                   | 相册标题         |
| summary           | TEXT         | -                          | 相册简介         |
| cover\_image\_url | VARCHAR(512) | -                          | 封面图片 URL     |
| cover\_image\_alt | VARCHAR(255) | -                          | 封面图片 alt 文本  |
| is\_private       | BOOLEAN      | DEFAULT 0                  | 是否为私有相册      |
| created\_at       | DATETIME     | DEFAULT CURRENT\_TIMESTAMP | 创建时间         |
| updated\_at       | DATETIME     | DEFAULT CURRENT\_TIMESTAMP | 更新时间         |

### 2. photos（照片表）

存储相册中的照片信息。

| 字段名            | 类型           | 约束                         | 说明               |
| -------------- | ------------ | -------------------------- | ---------------- |
| id             | INTEGER      | PRIMARY KEY AUTOINCREMENT  | 照片唯一标识           |
| album\_id      | INTEGER      | NOT NULL, FOREIGN KEY      | 所属相册 ID          |
| image\_url     | VARCHAR(512) | NOT NULL                   | 图片 URL           |
| image\_alt     | VARCHAR(255) | -                          | 图片 alt 文本        |
| title          | VARCHAR(255) | -                          | 照片标题             |
| description    | TEXT         | -                          | 照片描述             |
| category\_id   | INTEGER      | FOREIGN KEY                | 所属照片分类 ID        |
| is\_live       | BOOLEAN      | DEFAULT 0                  | 是否是 live 图片      |
| live\_mp4\_url | VARCHAR(512) | -                          | live 图片 mp4 视频地址 |
| date           | VARCHAR(32)  | -                          | 拍摄日期             |
| location       | VARCHAR(128) | -                          | 拍摄地点             |
| sort\_order    | INTEGER      | DEFAULT 0                  | 排序序号             |
| created\_at    | DATETIME     | DEFAULT CURRENT\_TIMESTAMP | 创建时间             |

**外键约束**: 
- `album_id` 参考 `albums(id)`，删除相册时级联删除照片
- `category_id` 参考 `photo_categories(id)`，删除分类时设为 NULL

### 3. photo\_categories（照片分类表）

存储照片的分类信息。

| 字段名         | 类型          | 约束                         | 说明     |
| ----------- | ----------- | -------------------------- | ------ |
| id          | INTEGER     | PRIMARY KEY AUTOINCREMENT  | 分类唯一标识 |
| name        | VARCHAR(64) | UNIQUE NOT NULL            | 分类名称   |
| description | TEXT        | -                          | 分类描述   |
| created\_at | DATETIME    | DEFAULT CURRENT\_TIMESTAMP | 创建时间   |

### 4. home\_carousel（首页轮播图设置表）

存储首页轮播图的配置信息，支持图片和视频两种类型。

| 字段名                      | 类型           | 约束                                    | 说明                    |
| ------------------------ | ------------ | ------------------------------------- | --------------------- |
| id                       | INTEGER      | PRIMARY KEY AUTOINCREMENT             | 轮播项唯一标识               |
| type                     | VARCHAR(16)  | NOT NULL, CHECK IN ('image', 'video') | 内容类型                  |
| title                    | VARCHAR(255) | NOT NULL                              | 标题                    |
| caption                  | TEXT         | -                                     | 副标题/说明                |
| photo\_id                | INTEGER      | -                                     | 图片 ID（type=image 时可选） |
| photo\_live\_poster\_url | VARCHAR(512) | -                                     | live 图片封面图 URL        |
| video\_url               | VARCHAR(512) | -                                     | 视频 URL                  |
| video\_id                | INTEGER      | -                                     | 视频 ID                   |
| video\_poster\_url       | VARCHAR(512) | -                                     | 视频封面图 URL             |
| date                     | VARCHAR(32)  | -                                     | 日期                    |
| location                 | VARCHAR(128) | -                                     | 地点                    |
| sort\_order              | INTEGER      | DEFAULT 0                             | 排序序号                  |
| is\_active               | BOOLEAN      | DEFAULT 1                             | 是否启用                  |
| created\_at              | DATETIME     | DEFAULT CURRENT\_TIMESTAMP            | 创建时间                  |
| updated\_at              | DATETIME     | DEFAULT CURRENT\_TIMESTAMP            | 更新时间                  |

### 5. featured\_photos（首页精选照片表）

存储首页展示的精选照片。

| 字段名         | 类型           | 约束                         | 说明        |
| ----------- | ------------ | -------------------------- | --------- |
| id          | INTEGER      | PRIMARY KEY AUTOINCREMENT  | 精选照片唯一标识  |
| title       | VARCHAR(255) | NOT NULL                   | 照片标题      |
| description | TEXT         | -                          | 照片描述      |
| date        | VARCHAR(32)  | -                          | 拍摄日期      |
| location    | VARCHAR(128) | -                          | 拍摄地点      |
| image\_url  | VARCHAR(512) | NOT NULL                   | 图片 URL    |
| image\_alt  | VARCHAR(255) | -                          | 图片 alt 文本 |
| sort\_order | INTEGER      | DEFAULT 0                  | 排序序号      |
| is\_active  | BOOLEAN      | DEFAULT 1                  | 是否启用      |
| created\_at | DATETIME     | DEFAULT CURRENT\_TIMESTAMP | 创建时间      |
| updated\_at | DATETIME     | DEFAULT CURRENT\_TIMESTAMP | 更新时间      |

### 6. site\_config（站点配置表）

存储网站的基本配置信息。

| 字段名     | 类型           | 约束                         | 说明       |
| ------- | ------------ | -------------------------- | -------- |
| id      | INTEGER      | PRIMARY KEY AUTOINCREMENT  | 配置唯一标识   |
| name    | VARCHAR(128) | NOT NULL                   | 站点名称     |
| logo\_text | VARCHAR(32) | NOT NULL                   | Logo 文字    |
| tagline | VARCHAR(255) | NOT NULL                   | 站点标语     |
| copyright | VARCHAR(255) | NOT NULL                   | 版权信息     |
| created\_at | DATETIME | DEFAULT CURRENT\_TIMESTAMP | 创建时间     |
| updated\_at | DATETIME | DEFAULT CURRENT\_TIMESTAMP | 更新时间     |

### 7. menu（导航菜单表）

存储网站的导航菜单配置。

| 字段名      | 类型           | 约束                                                                 | 说明           |
| -------- | ------------ | ------------------------------------------------------------------ | ------------ |
| id       | INTEGER      | PRIMARY KEY AUTOINCREMENT                                          | 菜单项唯一标识     |
| label    | VARCHAR(64)  | NOT NULL                                                            | 菜单显示文字      |
| url      | VARCHAR(512) | NOT NULL                                                            | 链接地址         |
| link\_type | VARCHAR(32) | NOT NULL DEFAULT 'inner', CHECK IN ('inner', 'outer', 'mini_program', 'universal_app', 'android_app', 'apple_app') | 链接类型         |
| sort\_order | INTEGER    | DEFAULT 0                                                           | 排序序号         |
| is\_active | BOOLEAN    | DEFAULT 1                                                           | 是否启用         |
| created\_at | DATETIME   | DEFAULT CURRENT\_TIMESTAMP                                          | 创建时间         |

**link\_type 枚举值说明**:

| 值              | 说明           |
| -------------- | ------------ |
| inner          | 站内链接（使用 Next.js Link） |
| outer          | 外部链接（使用 a 标签，新窗口打开） |
| mini\_program  | 小程序链接       |
| universal\_app | 通用链接（Universal Link） |
| android\_app   | Android App 链接 |
| apple\_app     | Apple App 链接   |

## 表关系图

```
albums (1) ────<─── photos (N)
    │
    └─── photo_categories (可选关联)

home_carousel (独立表)
featured_photos (独立表)
site_config (独立表)
menu (独立表)
```

## 数据初始化

数据库初始化脚本位于 `sql/init.sql`，包含以下初始数据：

### 初始相册数据

| slug        | title | summary             | is\_private |
| ----------- | ----- | ------------------- | ----------- |
| coast-light | 海岸光线  | 海边、浪花、阴天与突然明亮起来的天空。 | 是           |
| quiet-city  | 安静城市  | 在街角、站台和玻璃反光里寻找平静。   | 是           |
| green-days  | 绿色时日  | 树影、草地和散步途中遇见的自然切片。  | 否           |

### 初始分类数据

| name | description |
| ---- | ----------- |
| 旅行摄影 | 记录旅途风景与人    |
| 城市观察 | 城市街头与建筑     |
| 自然风光 | 自然景观与生态     |
| 日常记录 | 生活片段与瞬间     |

### 初始轮播图数据

| title | type  | location |
| ----- | ----- | -------- |
| 光影片刻  | video | 日常记录     |
| 雨后海岸  | image | 福建 平潭    |
| 山间清晨  | image | 浙江 莫干山   |
| 城市夜行  | image | 上海 徐汇    |

### 初始精选照片数据

| title | location |
| ----- | -------- |
| 窗边的蓝  | 杭州       |
| 林中小径  | 南京       |
| 傍晚车站  | 苏州       |

### 初始站点配置数据

| name | logo\_text | tagline | copyright |
| ---- | ---------- | ------- | --------- |
| Momentory | M | 把日常光影收藏成册 | Copyright 2026 Momentory. All rights reserved. |

### 初始菜单数据

| label | url | link\_type |
| ----- | --- | ---------- |
| 首页 | / | inner |
| 相册 | /albums | inner |
| 关于 | /about | inner |

## 操作命令

### 初始化数据库

```bash
pnpm run init-db
```

### 重置数据库（清空并重新初始化）

```bash
pnpm run reset-db
```

## 文件结构

```
├── db/
│   └── momentory.sqlite      # SQLite 数据库文件
├── sql/
│   └── init.sql              # 数据库初始化脚本
└── src/
    └── lib/
        ├── database.ts       # 数据库连接封装
        └── repositories/
            ├── albums.ts     # 相册数据访问
            ├── homeCarousel.ts   # 轮播图数据访问
            ├── featuredPhotos.ts # 精选照片数据访问
            └── siteConfig.ts     # 站点配置数据访问
```

## 索引建议

根据业务需求，建议在以下字段创建索引以优化查询性能：

```sql
CREATE INDEX idx_photos_album_id ON photos(album_id);
CREATE INDEX idx_albums_slug ON albums(slug);
CREATE INDEX idx_home_carousel_sort ON home_carousel(sort_order, is_active);
CREATE INDEX idx_featured_photos_sort ON featured_photos(sort_order, is_active);
CREATE INDEX idx_menu_sort ON menu(sort_order, is_active);
```