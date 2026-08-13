# Momentory 项目架构文档

## 概述

Momentory 是一个基于 Next.js 构建的相册展示网站，采用服务端渲染（SSR）与客户端交互相结合的方式，数据存储于 MySQL 8.0 数据库，使用 Prisma ORM v7 进行类型安全的数据库操作，通过 Repository 模式封装异步数据访问。项目遵循清晰的分层架构，代码组织严谨，内置生产环境安全防护机制，便于维护和扩展。

## 架构总览

```
┌──────────────────────────────────────────────────────────────────────────┐
│                           客户端 (Client)                                │
│  ┌────────────────────────────────────────────────────────────────────┐  │
│  │                        Next.js App Router                          │  │
│  │  / (首页)   /albums (相册列表)   /albums/[slug] (相册详情)   /about │  │
│  └────────────────────────────────────────────────────────────────────┘  │
│                                │                                         │
│                                ▼                                         │
│  ┌────────────────────────────────────────────────────────────────────┐  │
│  │                           Views Layer                              │  │
│  │       HomePage    AlbumsPage    AlbumDetailPage    AboutPage       │  │
│  └────────────────────────────────────────────────────────────────────┘  │
│                                │                                         │
│                                ▼                                         │
│  ┌────────────────────────────────────────────────────────────────────┐  │
│  │                         Components Layer                           │  │
│  │   Header  Footer  Layout  AlbumCard  SectionHeader  TextLink ...   │  │
│  └────────────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌──────────────────────────────────────────────────────────────────────────┐
│                           服务端 (Server)                                │
│  ┌────────────────────────────────────────────────────────────────────┐  │
│  │                          Data Layer                                │  │
│  │                     siteData.ts (数据聚合)                          │  │
│  └────────────────────────────────────────────────────────────────────┘  │
│                                │                                         │
│                                ▼                                         │
│  ┌────────────────────────────────────────────────────────────────────┐  │
│  │                       Repository Layer                             │  │
│  │         albums.ts    homeCarousel.ts    featuredPhotos.ts          │  │
│  │              siteConfig.ts    database.ts                          │  │
│  └────────────────────────────────────────────────────────────────────┘  │
│                                │                                         │
│                                ▼                                         │
│  ┌────────────────────────────────────────────────────────────────────┐  │
│  │                        Database Layer                              │  │
│  │                   MySQL 8.0 (mysql2/promise)                       │  │
│  └────────────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────────────┘
```

## 目录结构详解

### 根目录

| 目录/文件 | 作用 | 说明 |
| --------- | ---- | ---- |
| `prisma/` | Prisma ORM 目录 | Schema 定义、迁移文件、生成的 Client |
| `prisma.config.ts` | Prisma 配置 | Prisma CLI 配置文件 |
| `sql/` | SQL 脚本目录 | 存放数据库初始化脚本（schema + seed） |
| `src/` | 源代码目录 | 项目核心代码 |
| `docs/` | 文档目录 | 项目文档（技术栈、数据库设计、架构） |
| `.gitignore` | Git 忽略配置 | 指定 Git 不应跟踪的文件 |
| `next.config.ts` | Next.js 配置 | Next.js 框架配置文件 |
| `tsconfig.json` | TypeScript 配置 | TypeScript 编译选项 |
| `package.json` | 项目依赖配置 | 包含脚本命令和依赖声明 |
| `tmc.config.js` | 腾讯云部署配置 | tmc-cli 部署到腾讯云 COS 的配置文件 |

### prisma/ - Prisma ORM 目录

```
prisma/
├── schema.prisma             # Prisma 数据模型定义（9 张数据表）
├── prisma.config.ts          # Prisma CLI 配置（datasource 指向 schema.prisma）
├── generated/client/         # 自动生成的 Prisma Client（类型安全，请勿手动修改）
└── migrations/               # 迁移 SQL 文件目录（每个变更独立子目录）
```

- **职责**: 作为数据库交互的核心层
- **schema.prisma**: 定义 Album、Photo、PhotoCategory、HomeCarousel、FeaturedPhoto、SiteConfig、Menu、UserRole、User 共 9 个模型
- **Prisma Client**: 自动生成 TypeScript 类型，提供 `$queryRaw`、`$executeRawUnsafe` 等原始 SQL 能力
- **迁移记录**: `pnpm run prisma:migrate --name xxx` 生成，`pnpm run prisma:migrate:deploy` 在生产环境执行

### sql/ - SQL 脚本目录

```
sql/
├── schema.sql              # 建表 SQL（开发环境 init-db 使用）
└── seed-data.sql           # 初始数据 SQL（开发环境 init-db 使用）
```

- **职责**: 开发环境初始化数据库表结构和种子数据
- **执行条件**: 仅在开发环境（NODE_ENV≠production 且 APP_ENV≠PROD）可用
- **生产环境替代方案**: 使用 Prisma Migrate Deploy 执行已有的迁移文件
- **执行命令**: 通过 `pnpm run init-db` 命令执行（生产环境自动拦截）

### src/ - 源代码目录

#### src/app/ - Next.js App Router

```
src/app/
├── layout.tsx            # 根布局组件
├── page.tsx              # 首页路由
├── about/
│   └── page.tsx          # 关于页面路由
└── albums/
    ├── page.tsx          # 相册列表页面路由
    └── [albumId]/
        └── page.tsx      # 相册详情动态路由
```

- **职责**: 定义应用路由和页面入口
- **模式**: 采用 Next.js App Router 模式，支持服务端渲染
- **特性**: 
  - `layout.tsx`: 全局布局，加载全局样式，获取站点数据
  - 动态路由 `[albumId]`: 支持通过相册别名访问详情页
  - 页面组件直接调用 `getSiteData()` 获取数据（异步）

#### src/components/ - 可复用组件

```
src/components/
├── AlbumAccessGate/      # 相册访问权限控制组件
├── AlbumCard/            # 相册卡片展示组件
├── Footer/               # 页脚组件
├── Header/               # 头部导航组件
├── Layout/               # 页面布局容器组件
├── PageHero/             # 页面英雄区组件
├── SectionHeader/        # 区块标题组件
└── TextLink/             # 文本链接组件
```

- **职责**: 提供可复用的 UI 组件，遵循单一职责原则
- **组件结构**: 每个组件独立目录，包含：
  - `index.tsx`: 组件主体代码
  - `index.module.css`: CSS Modules 样式文件
  - `README.md`: 组件说明文档（可选）
- **设计原则**: 
  - 无状态组件优先，通过 props 接收数据
  - 使用 CSS Modules 实现样式隔离
  - 使用 `classnames` 库动态组合类名

#### src/views/ - 页面视图组件

```
src/views/
├── AboutPage/            # 关于页面视图
├── AlbumDetailPage/      # 相册详情页面视图
├── AlbumsPage/           # 相册列表页面视图
└── HomePage/             # 首页视图
```

- **职责**: 定义页面级别的 UI 结构和交互逻辑
- **设计模式**: 
  - `'use client'` 指令标记客户端组件
  - 集成 GSAP 动画库实现滚动触发动画
  - 通过 props 接收 `siteData` 数据
- **特点**: 
  - 包含复杂的交互逻辑（轮播图、滚动动画）
  - 使用 GSAP ScrollTrigger 实现滚动响应式动画

#### src/data/ - 数据层

```
src/data/
└── siteData.ts           # 站点数据聚合器
```

- **职责**: 聚合所有数据源，提供统一的数据访问接口
- **核心功能**: 
  - `getSiteData()`: 获取完整的站点数据对象（异步）
  - `findAlbumById()`: 根据 ID/别名查找相册（异步）
- **数据来源**: 
  - 从 Repository 层获取数据库数据
  - 部分静态数据（如 profile、about）暂硬编码
- **设计原则**: 作为数据访问的唯一入口，隔离数据来源

#### src/lib/ - 工具库

```
src/lib/
├── prisma.ts             # Prisma Client 实例（MariaDB Adapter）
├── auth.ts               # 认证与权限（JWT + bcryptjs）
├── cos.ts                # 腾讯云 COS 对象存储封装
├── exif.ts               # 图片 EXIF 信息解析
├── api.ts                # API 响应封装
└── repositories/         # 数据访问层（Repository 模式）
    ├── albums.ts         # 相册数据访问
    ├── photos.ts         # 照片数据访问
    ├── photoCategories.ts# 照片分类数据访问
    ├── featuredPhotos.ts # 精选照片数据访问
    ├── homeCarousel.ts   # 首页轮播图数据访问
    ├── siteConfig.ts     # 站点配置 + 菜单数据访问
    ├── users.ts          # 用户数据访问
    └── userRoles.ts      # 用户角色 + 权限数据访问
```

**prisma.ts**

- **职责**: 初始化 Prisma Client 并集成 MariaDB Adapter
- **核心配置**: 
  - 使用 `@prisma/adapter-mariadb` 连接 MySQL（兼容 MariaDB 协议）
  - 环境变量: `DB_HOST` / `DB_PORT` / `DB_USER` / `DB_PASSWORD` / `DB_NAME`
  - 开发环境启用 `globalThis.prisma` 全局缓存，避免热更新创建过多连接
- **导出**: 单例 `PrismaClient` 实例

**repositories/**

- **职责**: 实现数据访问层（Repository 模式）
- **设计原则**: 
  - 每个 Repository 对应一个或一组相关数据表
  - 优先使用 Prisma 类型安全查询，必要时通过 `$queryRaw` / `$executeRawUnsafe` 执行原生 SQL
  - 仅在服务端执行，确保数据库连接信息不暴露给客户端
- **Repository 列表**:
  | 文件 | 对应表 | 主要方法 |
  | ---- | ------ | -------- |
  | albums.ts | albums | getAllAlbums, getAlbumBySlug, create, update, delete |
  | photos.ts | photos, photo_categories | getPhotos, getPhotoById, create, update, delete, getCategories |
  | homeCarousel.ts | home_carousel | getActiveCarouselItems, getAllCarousel, create, update, delete |
  | featuredPhotos.ts | featured_photos | getActiveFeaturedPhotos, getAllFeatured, create, update, delete |
  | siteConfig.ts | site_config, menu | getSiteConfig, updateSiteConfig, menu CRUD |
  | users.ts | users | login, getAllUsers, getUserById, create, update, delete |
  | userRoles.ts | user_roles | getAllRoles, getRoleById, create, update, delete, checkPermission |

#### src/scripts/ - 脚本目录

```
src/scripts/
├── safe-prisma.ts        # Prisma 命令安全包装脚本（生产环境拦截危险命令）
└── initDb.ts             # 数据库初始化脚本（开发环境，生产环境自动拦截）
```

**safe-prisma.ts**

- **职责**: 在执行 Prisma 命令前检查环境，拦截生产环境下的危险操作
- **双重环境检测**: 
  - `NODE_ENV === 'production' | 'prod'` → 触发保护
  - `APP_ENV === 'PROD' | 'PRODUCTION'` → 触发保护
- **被拦截的命令**: `migrate dev`, `migrate reset`, `db push`, `db seed`, `studio`
- **允许通过的命令**: `generate`, `migrate deploy`, `migrate status`, `validate`
- **实现机制**: 通过 `child_process.spawnSync` 转发放行的 Prisma 命令到真实 prisma 二进制

**initDb.ts**

- **职责**: 开发环境初始化数据库（建表 + 插入种子数据 + 创建超级管理员）
- **生产环境保护**: 脚本开头检查环境变量，若为生产环境立即退出并打印错误提示
- **执行流程**:
  1. 环境检查（NODE_ENV / APP_ENV）
  2. 读取并执行 `sql/schema.sql` 建表
  3. 读取并执行 `sql/seed-data.sql` 插入初始数据
  4. 使用 bcryptjs 哈希管理员密码，通过 Prisma `user.upsert` 创建/更新账号
  5. 断开 Prisma 连接

#### src/styles/ - 全局样式

```
src/styles/
└── global.css            # 全局样式文件
```

- **职责**: 定义全局样式变量和基础样式
- **内容**: 
  - `:root` CSS 变量（颜色、字体、间距）
  - 全局重置样式
  - 基础排版样式
- **引用**: 在 `src/app/layout.tsx` 中引入

#### src/types/ - 类型定义

```
src/types/
└── global.d.ts           # 全局类型声明
```

- **职责**: 定义全局 TypeScript 类型
- **使用**: 项目中所有模块共享的类型定义

## 数据流向

```
数据库 (MySQL 8.0)
     │
     ▼
┌──────────────────────┐
│   Repository Layer   │  ← src/lib/repositories/
│   (数据访问层 - 异步)   │
└──────────────────────┘
     │
     ▼
┌──────────────────────┐
│     Data Layer       │  ← src/data/siteData.ts
│   (数据聚合层 - 异步)   │
└──────────────────────┘
     │
     ▼
┌──────────────────────┐
│    Views Layer       │  ← src/views/
│   (页面视图层)        │
└──────────────────────┘
     │
     ▼
┌──────────────────────┐
│   Components Layer   │  ← src/components/
│   (UI组件层)          │
└──────────────────────┘
     │
     ▼
   用户浏览器
```

## 服务端/客户端边界

项目采用 Next.js App Router 模式，清晰划分服务端与客户端职责：

**服务端区域（仅在服务器执行）：**

| 目录/文件 | 职责 |
| --------- | ---- |
| `src/lib/repositories/` | 数据库访问层，封装 SQL 查询（异步） |
| `src/lib/database.ts` | MySQL 连接池管理 |
| `src/data/siteData.ts` | 数据聚合，调用 Repository 获取数据（异步） |
| `src/scripts/` | 数据库初始化脚本 |

**客户端区域（在浏览器执行）：**

| 目录/文件 | 职责 |
| --------- | ---- |
| `src/views/` | 页面视图组件，使用 `'use client'` 指令 |
| `src/components/` | 通用 UI 组件 |
| `src/styles/` | 全局样式 |

**边界规则：**

- **禁止**在客户端组件中直接导入 Repository 或 database.ts
- **数据获取**必须通过 `await getSiteData()` 在服务端完成，然后通过 props 传递给客户端组件
- **动画和交互**逻辑在客户端组件中实现（GSAP、状态管理）
- **页面路由**默认在服务端渲染，确保首屏加载速度和 SEO

## 关键设计模式

### 1. Repository 模式

- **目的**: 封装数据访问逻辑，提供类型安全的异步接口
- **实现**: 每个数据表对应一个 Repository 文件
- **优点**: 
  - 降低数据访问与业务逻辑的耦合
  - 便于单元测试和 Mock
  - 集中管理 SQL 查询，避免重复

### 2. 数据聚合模式

- **目的**: 将多个数据源聚合为统一的数据对象
- **实现**: `siteData.ts` 作为数据聚合中心（异步）
- **优点**: 
  - 页面组件只需调用一个函数即可获取所有数据
  - 数据结构统一，便于维护

### 3. 组件分层模式

- **Views**: 页面级组件，包含业务逻辑和动画
- **Components**: 通用 UI 组件，纯展示性，无业务逻辑
- **优点**: 
  - 职责清晰，易于复用
  - 降低组件复杂度

### 4. CSS Modules 模式

- **目的**: 实现组件级样式隔离
- **实现**: 每个组件的样式文件命名为 `index.module.css`
- **优点**: 
  - 避免样式冲突
  - 提升样式可维护性

## 安全性设计

### 数据库访问限制

- **规则**: 数据库操作仅允许在服务端执行
- **实现**: 
  - Repository 文件不导出到客户端组件
  - 使用 Next.js App Router 默认的服务端执行环境
  - Prisma Client 仅在 `src/lib/prisma.ts` 中初始化，通过 Repository 封装后间接调用

### 环境变量管理

- **规则**: 数据库连接信息（用户名、密码、主机）通过环境变量配置
- **实现**: `.env.local` 文件存放敏感配置，通过 `.gitignore` 排除
- **生产环境双重标识**: 
  - `NODE_ENV=production` - Node.js 标准生产环境标识
  - `APP_ENV=PROD` - 项目自定义生产环境标识，用于触发额外安全保护

### 私有相册保护

- **规则**: 标记为私有的相册需要访问权限验证
- **实现**: `AlbumAccessGate` 组件控制访问

### 生产环境数据库操作安全防护

- **核心目标**: 防止在生产环境误执行会修改表结构或清空数据的危险命令
- **防护实现**: 
  1. **Prisma 命令安全包装**: `src/scripts/safe-prisma.ts` 在执行前拦截危险命令
  2. **初始化脚本保护**: `src/scripts/initDb.ts` 开头进行环境检测，生产环境直接退出
- **双重环境检测规则（任一满足即触发保护）**:
  | 环境变量 | 触发值 |
  | -------- | ------ |
  | NODE_ENV | production / prod |
  | APP_ENV | PROD / PRODUCTION |
- **被拦截的危险命令清单**:
  | 命令 | 风险 |
  | ---- | ---- |
  | prisma migrate dev | 可能要求重置数据库，数据丢失风险 |
  | prisma migrate reset | 会清空所有数据表，**绝对禁止** |
  | prisma db push | 强制推送 schema，可能重建表且无迁移记录 |
  | prisma db seed | 种子数据填充可能覆盖生产数据 |
  | prisma studio | 可视化工具暴露数据库操作入口 |
  | pnpm run init-db | 执行 DROP/CREATE TABLE，数据全部丢失 |
  | pnpm run reset-db | init-db 别名，同上 |
- **生产环境变更规范**:
  - 开发环境执行 `prisma migrate dev` 生成迁移文件
  - 迁移文件提交 Git 并随代码部署一同发布
  - 生产环境执行 `prisma migrate deploy` 仅执行新的迁移 SQL

## 性能优化策略

### 服务端渲染

- **策略**: 使用 Next.js App Router 默认的 SSR 模式
- **效果**: 首屏加载快，SEO 友好

### 数据库优化

- **策略**: MySQL 连接池 + 索引优化 + InnoDB 存储引擎
- **效果**: 提升并发读写性能，支持事务

### 图片优化

- **策略**: 使用 `loading="lazy"` 延迟加载图片
- **效果**: 减少首屏加载时间

### CSS 优化

- **策略**: CSS Modules 按需加载
- **效果**: 减少样式体积

## 部署架构

详见 [tech-stack.md](file:///Users/cubesuger/Documents/workspace/kunkuntang/momentory-site2/docs/tech-stack.md) 中的部署工具和配置说明。

## 开发工作流

详见 [tech-stack.md](file:///Users/cubesuger/Documents/workspace/kunkuntang/momentory-site2/docs/tech-stack.md) 中的常用命令说明。

## 总结

Momentory 项目采用了清晰的分层架构设计：

1. **数据层**: 通过 Repository 模式封装 MySQL 数据库访问（异步），确保数据操作的安全性和可维护性
2. **业务层**: 通过 `siteData.ts` 聚合数据，提供统一的异步数据接口
3. **视图层**: 分离 Views 和 Components，实现关注点分离
4. **样式层**: 使用 CSS Modules 实现样式隔离

这种架构使得项目具有良好的可扩展性和可维护性，便于后续功能迭代和团队协作。
