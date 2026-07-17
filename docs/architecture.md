# Momentory 项目架构文档

## 概述

Momentory 是一个基于 Next.js 构建的相册展示网站，采用服务端渲染（SSR）与客户端交互相结合的方式，数据存储于 MySQL 8.0 数据库，通过 Repository 模式进行异步数据访问。项目遵循清晰的分层架构，代码组织严谨，便于维护和扩展。

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
| `sql/` | SQL 脚本目录 | 存放数据库初始化脚本 |
| `src/` | 源代码目录 | 项目核心代码 |
| `docs/` | 文档目录 | 项目文档（技术栈、数据库设计、架构） |
| `.gitignore` | Git 忽略配置 | 指定 Git 不应跟踪的文件 |
| `next.config.ts` | Next.js 配置 | Next.js 框架配置文件 |
| `tsconfig.json` | TypeScript 配置 | TypeScript 编译选项 |
| `package.json` | 项目依赖配置 | 包含脚本命令和依赖声明 |
| `tmc.config.js` | 腾讯云部署配置 | tmc-cli 部署到腾讯云 COS 的配置文件 |
| `cb.config.js` | 构建配置 | 前端构建工具的配置文件 |

### sql/ - SQL 脚本目录

```
sql/
└── init.sql              # 数据库初始化脚本
```

- **职责**: 定义数据库表结构和初始数据
- **内容**: 
  - 表创建语句（albums, photos, photo_categories 等）
  - 初始数据插入（相册、分类、轮播图、精选照片、站点配置、菜单）
- **执行**: 通过 `pnpm run init-db` 命令执行

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
├── database.ts           # 数据库连接封装（MySQL 连接池）
└── repositories/
    ├── albums.ts         # 相册数据访问
    ├── featuredPhotos.ts # 精选照片数据访问
    ├── homeCarousel.ts   # 首页轮播图数据访问
    └── siteConfig.ts     # 站点配置数据访问
```

**database.ts**

- **职责**: 初始化和管理 MySQL 数据库连接池
- **配置**: 
  - 字符集: `utf8mb4`
  - 排序规则: `utf8mb4_unicode_ci`
  - 存储引擎: InnoDB
  - 连接池: 最大连接数 10
- **导出**: `prepare`, `exec`, `close` 方法

**repositories/**

- **职责**: 实现数据访问层（Repository 模式）
- **设计原则**: 
  - 每个 Repository 对应一个或一组相关数据表
  - 封装 SQL 查询逻辑，提供类型安全的异步 API
  - 仅在服务端执行，确保数据库安全
- **示例接口**: 
  - `getAllAlbums()`: 获取所有相册（异步）
  - `getAlbumBySlug(slug)`: 按别名获取相册（含照片）（异步）
  - `getActiveCarouselItems()`: 获取启用的轮播图（异步）

#### src/scripts/ - 脚本目录

```
src/scripts/
└── initDb.ts             # 数据库初始化脚本
```

- **职责**: 执行数据库初始化逻辑
- **功能**: 
  - 读取 `sql/init.sql` 脚本
  - 执行建表和数据插入操作（异步）
- **执行**: 通过 `pnpm run init-db` 命令调用

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

### 环境变量管理

- **规则**: 数据库连接信息（用户名、密码、主机）通过环境变量配置
- **实现**: `.env.local` 文件存放敏感配置，通过 `.gitignore` 排除

### 私有相册保护

- **规则**: 标记为私有的相册需要访问权限验证
- **实现**: `AlbumAccessGate` 组件控制访问

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
