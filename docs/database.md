# Momentory 数据库设计文档

## 概述

本数据库设计用于存储 Momentory 相册网站的所有数据，包括相册、照片、分类、首页轮播图、精选照片和导航菜单。数据库采用 MySQL 8.0 存储，使用 Prisma ORM v7 进行数据库操作。

## 数据库配置

- **数据库类型**: MySQL 8.0+
- **ORM 框架**: Prisma v7 + @prisma/adapter-mariadb
- **字符集**: `utf8mb4`
- **排序规则**: `utf8mb4_unicode_ci`
- **存储引擎**: InnoDB

### Prisma 配置

| 配置项 | 文件位置 | 说明 |
| ------ | -------- | ---- |
| Prisma Schema | `prisma/schema.prisma` | 数据模型定义 |
| Prisma Config | `prisma.config.ts` | Prisma CLI 配置 |
| Prisma Client | `src/lib/prisma.ts` | Prisma Client 实例（含 MariaDB adapter） |
| 生成的 Client | `prisma/generated/client/` | Prisma 自动生成的类型安全客户端 |

### 环境变量配置

在项目根目录创建 `.env.local` 文件，配置以下环境变量：

```bash
# 数据库连接配置
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=momentory

# Prisma 连接 URL（格式: mysql://user:password@host:port/dbname）
DATABASE_URL="mysql://root:your_password@localhost:3306/momentory"

# 应用环境（PROD 会触发生产环境安全保护）
APP_ENV=DEV

# 管理员默认密码（初始化时使用）
ADMIN_DEFAULT_PASSWORD=your_secure_password
ADMIN_DEFAULT_USERNAME=cb_mome_root
```

### 环境变量说明

| 变量名 | 默认值 | 说明 |
| ------ | ------ | ---- |
| DB_HOST | localhost | MySQL 主机地址 |
| DB_PORT | 3306 | MySQL 端口 |
| DB_USER | root | 数据库用户名 |
| DB_PASSWORD | 空 | 数据库密码 |
| DB_NAME | momentory | 数据库名称 |
| DATABASE_URL | - | Prisma 连接字符串，mysql:// 格式 |
| APP_ENV | DEV | 应用环境标识：DEV / PROD，**PROD 时触发安全保护** |
| NODE_ENV | - | Node 环境：development / production，**production 时触发安全保护** |
| ADMIN_DEFAULT_PASSWORD | - | 管理员默认密码（必填，至少8位） |
| ADMIN_DEFAULT_USERNAME | cb_mome_root | 管理员用户名 |

## 数据表设计

### 1. albums（相册表）

存储相册的基本信息。

| 字段名               | 类型           | 约束                         | 说明           |
| ----------------- | ------------ | -------------------------- | ------------ |
| id                | INT          | PRIMARY KEY AUTO_INCREMENT | 相册唯一标识       |
| slug              | VARCHAR(128) | UNIQUE NOT NULL            | 相册别名（用于 URL） |
| title             | VARCHAR(255) | NOT NULL                   | 相册标题         |
| summary           | TEXT         | -                          | 相册简介         |
| cover_image_url   | VARCHAR(512) | -                          | 封面图片 URL     |
| cover_image_alt   | VARCHAR(255) | -                          | 封面图片 alt 文本  |
| is_private        | TINYINT(1)   | DEFAULT 0                  | 是否为私有相册      |
| created_at        | DATETIME     | DEFAULT CURRENT_TIMESTAMP  | 创建时间         |
| updated_at        | DATETIME     | DEFAULT CURRENT_TIMESTAMP  | 更新时间         |

### 2. photos（照片表）

存储相册中的照片信息。

| 字段名            | 类型           | 约束                         | 说明               |
| -------------- | ------------ | -------------------------- | ---------------- |
| id             | INT          | PRIMARY KEY AUTO_INCREMENT | 照片唯一标识           |
| album_id       | INT          | NOT NULL, FOREIGN KEY      | 所属相册 ID          |
| image_url      | VARCHAR(512) | NOT NULL                   | 图片 URL           |
| image_alt      | VARCHAR(255) | -                          | 图片 alt 文本        |
| title          | VARCHAR(255) | -                          | 照片标题             |
| description    | TEXT         | -                          | 照片描述             |
| category_id    | INT          | FOREIGN KEY                | 所属照片分类 ID        |
| is_live        | TINYINT(1)   | DEFAULT 0                  | 是否是 live 图片      |
| live_mp4_url   | VARCHAR(512) | -                          | live 图片 mp4 视频地址 |
| date           | VARCHAR(32)  | -                          | 拍摄日期             |
| location       | VARCHAR(128) | -                          | 拍摄地点             |
| sort_order     | INT          | DEFAULT 0                  | 排序序号             |
| created_at     | DATETIME     | DEFAULT CURRENT_TIMESTAMP  | 创建时间             |

**外键约束**: 
- `album_id` 参考 `albums(id)`，删除相册时级联删除照片
- `category_id` 参考 `photo_categories(id)`，删除分类时设为 NULL

### 3. photo_categories（照片分类表）

存储照片的分类信息。

| 字段名         | 类型          | 约束                         | 说明     |
| ----------- | ----------- | -------------------------- | ------ |
| id          | INT         | PRIMARY KEY AUTO_INCREMENT | 分类唯一标识 |
| name        | VARCHAR(64) | UNIQUE NOT NULL            | 分类名称   |
| description | TEXT        | -                          | 分类描述   |
| created_at  | DATETIME    | DEFAULT CURRENT_TIMESTAMP  | 创建时间   |

### 4. home_carousel（首页轮播图设置表）

存储首页轮播图的配置信息，支持图片和视频两种类型。

| 字段名                      | 类型           | 约束                                    | 说明                    |
| ------------------------ | ------------ | ------------------------------------- | --------------------- |
| id                       | INT          | PRIMARY KEY AUTO_INCREMENT             | 轮播项唯一标识               |
| type                     | VARCHAR(16)  | NOT NULL, CHECK IN ('image', 'video') | 内容类型                  |
| title                    | VARCHAR(255) | NOT NULL                              | 标题                    |
| caption                  | TEXT         | -                                     | 副标题/说明                |
| photo_id                 | INT          | -                                     | 图片 ID（type=image 时可选） |
| photo_live_poster_url    | VARCHAR(512) | -                                     | live 图片封面图 URL        |
| video_url                | VARCHAR(512) | -                                     | 视频 URL                  |
| video_id                 | INT          | -                                     | 视频 ID                   |
| video_poster_url         | VARCHAR(512) | -                                     | 视频封面图 URL             |
| date                     | VARCHAR(32)  | -                                     | 日期                    |
| location                 | VARCHAR(128) | -                                     | 地点                    |
| sort_order               | INT          | DEFAULT 0                             | 排序序号                  |
| is_active                | TINYINT(1)   | DEFAULT 1                             | 是否启用                  |
| created_at               | DATETIME     | DEFAULT CURRENT_TIMESTAMP             | 创建时间                  |
| updated_at               | DATETIME     | DEFAULT CURRENT_TIMESTAMP             | 更新时间                  |

### 5. featured_photos（首页精选照片表）

存储首页展示的精选照片。

| 字段名         | 类型           | 约束                         | 说明        |
| ----------- | ------------ | -------------------------- | --------- |
| id          | INT          | PRIMARY KEY AUTO_INCREMENT | 精选照片唯一标识  |
| title       | VARCHAR(255) | NOT NULL                   | 照片标题      |
| description | TEXT         | -                          | 照片描述      |
| date        | VARCHAR(32)  | -                          | 拍摄日期      |
| location    | VARCHAR(128) | -                          | 拍摄地点      |
| image_url   | VARCHAR(512) | NOT NULL                   | 图片 URL    |
| image_alt   | VARCHAR(255) | -                          | 图片 alt 文本 |
| sort_order  | INT          | DEFAULT 0                  | 排序序号      |
| is_active   | TINYINT(1)   | DEFAULT 1                  | 是否启用      |
| created_at  | DATETIME     | DEFAULT CURRENT_TIMESTAMP  | 创建时间      |
| updated_at  | DATETIME     | DEFAULT CURRENT_TIMESTAMP  | 更新时间      |

### 6. site_config（站点配置表）

存储网站的基本配置信息。

| 字段名      | 类型           | 约束                         | 说明       |
| -------- | ------------ | -------------------------- | -------- |
| id       | INT          | PRIMARY KEY AUTO_INCREMENT | 配置唯一标识   |
| name     | VARCHAR(128) | NOT NULL                   | 站点名称     |
| logo_text| VARCHAR(32)  | NOT NULL                   | Logo 文字    |
| tagline  | VARCHAR(255) | NOT NULL                   | 站点标语     |
| copyright| VARCHAR(255) | NOT NULL                   | 版权信息     |
| created_at| DATETIME    | DEFAULT CURRENT_TIMESTAMP  | 创建时间     |
| updated_at| DATETIME    | DEFAULT CURRENT_TIMESTAMP  | 更新时间     |

### 7. menu（导航菜单表）

存储网站的导航菜单配置。

| 字段名      | 类型           | 约束                                                                 | 说明           |
| -------- | ------------ | ------------------------------------------------------------------ | ------------ |
| id       | INT          | PRIMARY KEY AUTO_INCREMENT                                          | 菜单项唯一标识     |
| label    | VARCHAR(64)  | NOT NULL                                                            | 菜单显示文字      |
| url      | VARCHAR(512) | NOT NULL                                                            | 链接地址         |
| link_type| VARCHAR(32)  | NOT NULL DEFAULT 'inner', CHECK IN ('inner', 'outer', 'mini_program', 'universal_app', 'android_app', 'apple_app') | 链接类型         |
| sort_order| INT       | DEFAULT 0                                                           | 排序序号         |
| is_active| TINYINT(1)   | DEFAULT 1                                                           | 是否启用         |
| created_at| DATETIME  | DEFAULT CURRENT_TIMESTAMP                                          | 创建时间         |

**link_type 枚举值说明**:

| 值              | 说明           |
| -------------- | ------------ |
| inner          | 站内链接（使用 Next.js Link） |
| outer          | 外部链接（使用 a 标签，新窗口打开） |
| mini_program   | 小程序链接       |
| universal_app  | 通用链接（Universal Link） |
| android_app    | Android App 链接 |
| apple_app      | Apple App 链接   |

### 8. user_roles（用户角色表）

存储用户角色信息。

| 字段名      | 类型           | 约束                         | 说明         |
| -------- | ------------ | -------------------------- | ---------- |
| id       | INT          | PRIMARY KEY AUTO_INCREMENT | 角色唯一标识    |
| name     | VARCHAR(64)  | UNIQUE NOT NULL            | 角色名称      |
| description| TEXT      | -                          | 角色描述      |
| permissions| TEXT     | NOT NULL DEFAULT '[]'      | 权限列表（JSON） |
| created_at| DATETIME    | DEFAULT CURRENT_TIMESTAMP  | 创建时间      |
| updated_at| DATETIME    | DEFAULT CURRENT_TIMESTAMP  | 更新时间      |

### 9. users（用户表）

存储用户信息。

| 字段名        | 类型           | 约束                         | 说明         |
| ---------- | ------------ | -------------------------- | ---------- |
| id         | INT          | PRIMARY KEY AUTO_INCREMENT | 用户唯一标识    |
| username   | VARCHAR(64)  | UNIQUE NOT NULL            | 用户名        |
| password_hash| VARCHAR(255)| NOT NULL                   | 密码哈希值      |
| role_id    | INT          | NOT NULL, FOREIGN KEY      | 角色 ID       |
| is_active  | TINYINT(1)   | DEFAULT 1                  | 是否启用      |
| last_login_at| DATETIME  | -                          | 最后登录时间    |
| created_at | DATETIME     | DEFAULT CURRENT_TIMESTAMP  | 创建时间      |
| updated_at | DATETIME     | DEFAULT CURRENT_TIMESTAMP  | 更新时间      |

**外键约束**:
- `role_id` 参考 `user_roles(id)`，删除角色时限制删除

## 表关系图

```
albums (1) ────<─── photos (N)
    │
    └─── photo_categories (可选关联)

users (N) ────<─── user_roles (1)

home_carousel (独立表)
featured_photos (独立表)
site_config (独立表)
menu (独立表)
```

## 数据初始化

数据库初始化脚本位于 `sql/init.sql`，包含以下初始数据：

### 初始相册数据

| slug        | title | summary             | is_private |
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

| name | logo_text | tagline | copyright |
| ---- | ---------- | ------- | --------- |
| Momentory | M | 把日常光影收藏成册 | Copyright 2026 Momentory. All rights reserved. |

### 初始菜单数据

| label | url | link_type |
| ----- | --- | ---------- |
| 首页 | / | inner |
| 相册 | /albums | inner |
| 关于 | /about | inner |

### 初始角色数据

| name | description | permissions |
| ---- | ----------- | ----------- |
| super_admin | 超级管理员，拥有全部权限 | ["*"] |

## 操作命令

### 数据库初始化（仅开发环境可用）

```bash
ADMIN_DEFAULT_PASSWORD=your_secure_password pnpm run init-db
```

### 重置数据库（仅开发环境可用，清空并重新初始化）

```bash
ADMIN_DEFAULT_PASSWORD=your_secure_password pnpm run reset-db
```

### Prisma 常用命令

所有 Prisma 命令都通过安全包装脚本 `src/scripts/safe-prisma.ts` 执行，会自动根据环境拦截危险操作。

#### 开发环境命令

| 命令 | 说明 | 生产环境可用 |
| ---- | ---- | ----------- |
| `pnpm run prisma:generate` | 生成 Prisma Client 代码 | ✅ |
| `pnpm run prisma:migrate --name xxx` | 创建新迁移并同步数据库（开发用） | ❌ 会被拦截 |
| `pnpm run prisma:validate` | 验证 schema.prisma 语法正确性 | ✅ |
| `pnpm run prisma:status` | 查看当前迁移状态 | ✅ |
| `pnpm run prisma:studio` | 打开 Prisma Studio 可视化界面 | ❌ 会被拦截 |

#### 生产环境专用命令

| 命令 | 说明 |
| ---- | ---- |
| `pnpm run prisma:migrate:deploy` | **生产部署迁移**：仅执行已存在的迁移文件，不会修改 schema 或重建表 |

### 表结构变更工作流（生产安全）

当需要修改数据库表结构时，必须遵循以下流程以确保生产数据安全：

```
┌──────────────────────────────────────────────────────────────────┐
│  开发环境（本地）                                                  │
│  1. 修改 prisma/schema.prisma                                     │
│  2. 执行：pnpm run prisma:migrate --name add_field_xxx           │
│     → 生成 prisma/migrations/xxx/migration.sql                   │
│  3. 本地测试验证无误后，提交迁移文件到 Git                         │
└──────────────────────────────────────────────────────────────────┘
                           ↓
┌──────────────────────────────────────────────────────────────────┐
│  生产环境（服务器）                                                │
│  1. 拉取代码（包含新增的迁移文件）                                  │
│  2. 执行：pnpm run prisma:migrate:deploy                         │
│     → 仅执行新的迁移 SQL，不会重建表，不会丢失数据                  │
│  3. 执行：pnpm run prisma:generate                               │
│     → 生成最新的 Prisma Client 代码                               │
└──────────────────────────────────────────────────────────────────┘
```

**重要提示：绝对不要在生产环境执行 `prisma migrate dev` 或 `prisma db push`，这些命令可能会重建表导致数据丢失。**

## 生产环境安全保护机制

项目内置了双重环境检测的安全防护，防止在生产环境误执行危险操作。

### 环境检测规则

当以下任一条件满足时，系统判定为生产环境并激活安全保护：

| 环境变量 | 值 | 说明 |
| -------- | -- | ---- |
| `NODE_ENV` | `production` 或 `prod` | Node.js 标准生产环境标识 |
| `APP_ENV` | `PROD` 或 `PRODUCTION` | 项目自定义生产环境标识（当前 .env 中已设置） |

### 被拦截的危险命令

| 命令 | 拦截原因 |
| ---- | -------- |
| `prisma migrate dev` | 会创建迁移并可能要求重置数据库，有数据丢失风险 |
| `prisma migrate reset` | **会清空所有数据**，绝对禁止 |
| `prisma db push` | 直接强制推送 schema，可能重建表结构，无迁移记录 |
| `prisma db seed` | 种子数据填充，可能覆盖现有生产数据 |
| `prisma studio` | 可视化工具，生产环境不建议暴露数据库操作 |
| `pnpm run init-db` | 初始化脚本，会 DROP 表并重建，数据全部丢失 |
| `pnpm run reset-db` | 同上，别名命令 |

### 安全包装脚本实现

安全包装脚本位于：[src/scripts/safe-prisma.ts](file:///Users/cubesuger/Documents/workspace/kunkuntang/momentory-site2/src/scripts/safe-prisma.ts)

拦截示例输出：
```
========================================
  ERROR: Dangerous Prisma command blocked!
========================================

Command: prisma migrate dev --name test

This command is blocked in production environment because:
  - It can modify database schema structure
  - It may cause data loss or table recreation
  - It could break production data integrity

Current environment detection:
  - NODE_ENV: production
  - APP_ENV:  PROD

For production, use the following safe procedures:
  1. Run migrations: prisma migrate deploy
  2. Generate client: prisma generate
  3. Validate schema: prisma validate
========================================
```

### 紧急绕过（仅限极端情况）

如在生产环境确实需要执行被拦截的命令（极端紧急情况，风险自担），可临时取消环境变量后执行：

```bash
# 方式一：临时取消两个环境变量后执行
NODE_ENV= APP_ENV= pnpm run prisma:migrate --name emergency_fix

# 方式二：直接调用原始 prisma（绕过安全脚本，极度不推荐）
npx prisma migrate dev --name emergency_fix
```

**注意：执行前务必备份数据库，操作不当将导致永久数据丢失。**

## 文件结构

```
├── prisma/
│   ├── schema.prisma       # Prisma 数据模型定义（数据表结构）
│   ├── generated/client/   # Prisma 自动生成的 Client 代码（不要手动修改）
│   └── migrations/         # 迁移 SQL 文件目录（每个变更一个子目录）
├── prisma.config.ts        # Prisma CLI 配置文件
├── sql/
│   ├── schema.sql          # 建表 SQL（init-db 脚本使用）
│   └── seed-data.sql       # 初始数据 SQL（init-db 脚本使用）
└── src/
    ├── lib/
    │   ├── prisma.ts       # Prisma Client 实例（MariaDB Adapter）
    │   └── repositories/   # 数据访问层（Repository 模式）
    │       ├── albums.ts
    │       ├── photos.ts
    │       ├── homeCarousel.ts
    │       ├── featuredPhotos.ts
    │       ├── siteConfig.ts
    │       ├── users.ts
    │       └── userRoles.ts
    └── scripts/
        ├── safe-prisma.ts  # Prisma 命令安全包装脚本（生产环境拦截）
        └── initDb.ts       # 数据库初始化脚本（开发环境，生产环境被拦截）
```

## 索引建议

根据业务需求，以下索引已在初始化脚本中创建：

```sql
CREATE INDEX idx_photos_album_id ON photos(album_id);
CREATE INDEX idx_albums_slug ON albums(slug);
CREATE INDEX idx_home_carousel_sort ON home_carousel(sort_order, is_active);
CREATE INDEX idx_featured_photos_sort ON featured_photos(sort_order, is_active);
CREATE INDEX idx_menu_sort ON menu(sort_order, is_active);
CREATE INDEX idx_users_username ON users(username);
```

## MySQL 安装与配置

### 安装 MySQL 8.0

**macOS (Homebrew)**:
```bash
brew install mysql@8.0
brew services start mysql@8.0
```

**Ubuntu/Debian**:
```bash
sudo apt update
sudo apt install mysql-server-8.0
sudo systemctl start mysql
sudo systemctl enable mysql
```

### 创建数据库

登录 MySQL 后执行：

```sql
CREATE DATABASE momentory CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'your_user'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON momentory.* TO 'your_user'@'localhost';
FLUSH PRIVILEGES;
```

## 注意事项

1. **时区设置**: 确保 MySQL 时区与应用时区一致，建议设置为 `Asia/Shanghai`
2. **连接池**: 应用使用连接池管理数据库连接，默认连接数为 10
3. **字符集**: 统一使用 `utf8mb4` 字符集以支持完整的 Unicode 字符（包括 emoji）
4. **事务**: MySQL InnoDB 引擎支持事务，可在需要时使用事务确保数据一致性
5. **备份**: 定期备份数据库，建议使用 `mysqldump` 工具
