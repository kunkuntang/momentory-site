# Momentory 技术栈文档

## 概述

Momentory 是一个基于 Next.js 构建的相册展示网站，采用现代化的全栈技术栈，支持服务端渲染、数据库操作和精美的动画效果。

## 核心框架

### 前端框架

| 技术 | 版本 | 说明 |
| ---- | ---- | ---- |
| Next.js | ^15.0.0 | React 全栈框架，采用 App Router 模式 |
| React | ^18.3.1 | UI 组件库 |
| React DOM | ^18.3.1 | React DOM 渲染器 |

### 语言

| 技术 | 版本 | 说明 |
| ---- | ---- | ---- |
| TypeScript | ^5.6.3 | 类型安全的 JavaScript 超集 |
| ES2020 | - | 目标 ECMAScript 版本 |

## 数据库层

| 技术 | 版本 | 说明 |
| ---- | ---- | ---- |
| MySQL | 8.0+ | 关系型数据库管理系统 |
| Prisma | ^7.8.0 | 下一代 ORM，类型安全的数据库访问 |
| @prisma/client | ^7.8.0 | Prisma Client（自动生成的类型安全客户端） |
| @prisma/adapter-mariadb | ^7.8.0 | Prisma MariaDB/MySQL 连接适配器 |

**数据库配置**:
- 字符集: `utf8mb4`
- 排序规则: `utf8mb4_unicode_ci`
- 存储引擎: InnoDB
- ORM 模式: Prisma Schema 定义模型 → 生成 Prisma Client → Repository 封装查询

**Prisma 配置文件**:
| 文件 | 作用 |
| ---- | ---- |
| `prisma/schema.prisma` | 数据模型定义（9 张表） |
| `prisma.config.ts` | Prisma CLI 配置 |
| `src/lib/prisma.ts` | Prisma Client 初始化（MariaDB Adapter） |
| `src/scripts/safe-prisma.ts` | Prisma 命令安全包装脚本（生产环境拦截） |

**环境变量**:
```bash
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=momentory

# Prisma 连接字符串
DATABASE_URL="mysql://root:your_password@localhost:3306/momentory"

# 环境标识（PROD=生产环境，触发安全保护）
APP_ENV=DEV
```

## 样式方案

### CSS 方案

| 技术 | 版本 | 说明 |
| ---- | ---- | ---- |
| CSS Modules | - | 组件级样式隔离 |
| classnames | ^2.5.1 | CSS 类名动态组合工具 |

### 设计系统

**字体**:
- 标题字体: Cormorant Garamond (衬线字体)
- 正文字体: Inter (无衬线字体)

**颜色变量**:
| 变量名 | 值 | 用途 |
| ------ | --- | ---- |
| --bg | #ffffff | 背景色 |
| --ink | #171717 | 主文字色 |
| --muted | #6f6f6f | 次要文字色 |
| --soft | #f4f4f2 | 柔和背景色 |
| --line | #e8e6e1 | 分割线颜色 |
| --accent | #6f8462 | 强调色 |
| --accent-dark | #40563b | 强调色深色 |

## 动画库

| 技术 | 版本 | 说明 |
| ---- | ---- | ---- |
| GSAP | ^3.15.0 | 高性能 JavaScript 动画库 |
| @gsap/react | ^2.1.2 | GSAP React 集成 |

## 图标库

| 技术 | 版本 | 说明 |
| ---- | ---- | ---- |
| Lucide React | ^0.468.0 | 精美的开源图标库 |

## 开发工具

| 技术 | 版本 | 说明 |
| ---- | ---- | ---- |
| tsx | ^4.23.0 | TypeScript 即时编译执行工具 |
| @types/node | ^22.10.1 | Node.js 类型定义 |
| @types/react | ^18.3.12 | React 类型定义 |
| @types/react-dom | ^18.3.1 | React DOM 类型定义 |

## 部署工具

| 技术 | 版本 | 说明 |
| ---- | ---- | ---- |
| tmc-cli | ^0.1.6 | 腾讯云部署 CLI |
| tmc-cli-plugin-web | ^0.1.6 | 腾讯云 Web 部署插件 |

**部署配置**:
- 存储类型: 腾讯云 COS
- 存储桶: momentory-site
- 区域: ap-guangzhou

## 项目结构

```
├── prisma/                      # Prisma ORM 目录
│   ├── schema.prisma            # 数据模型定义（9 张表）
│   ├── seed.ts                  # Prisma Seed 脚本（类型安全写入初始数据 + 管理员）
│   ├── generated/client/        # 自动生成的 Prisma Client
│   └── migrations/              # 迁移 SQL 文件目录（随 Git 提交）
├── prisma.config.ts             # Prisma CLI 配置
├── sql/                         # SQL 存档目录（仅参考，不再被脚本调用）
│   ├── schema.sql               # 建表 SQL（历史存档，已被 prisma/migrations 取代）
│   └── seed-data.sql            # 初始数据 SQL（历史存档，已被 prisma/seed.ts 取代）
├── src/
│   ├── app/                     # Next.js App Router 路由
│   │   ├── (site)/              # 公开站点路由
│   │   ├── admin/               # 管理后台路由
│   │   ├── api/                 # API 路由
│   │   ├── layout.tsx           # 根布局
│   │   └── page.tsx             # 首页
│   ├── components/              # 可复用组件
│   │   ├── admin/               # 管理后台组件
│   │   ├── Header/              # 头部导航
│   │   ├── Footer/              # 页脚
│   │   ├── AlbumCard/           # 相册卡片
│   │   ├── AlbumAccessGate/     # 相册访问权限门
│   │   └── ...
│   ├── views/                   # 页面视图组件
│   │   ├── HomePage/            # 首页视图
│   │   ├── AlbumsPage/          # 相册列表视图
│   │   ├── AlbumDetailPage/     # 相册详情视图
│   │   └── AboutPage/           # 关于页面视图
│   ├── data/                    # 数据聚合层
│   │   └── siteData.ts          # 站点数据聚合
│   ├── lib/                     # 工具库
│   │   ├── prisma.ts            # Prisma Client 实例
│   │   ├── auth.ts              # JWT 认证
│   │   ├── cos.ts               # COS 对象存储
│   │   ├── exif.ts              # EXIF 解析
│   │   ├── api.ts               # API 响应封装
│   │   └── repositories/        # 数据访问层（8 个 Repository）
│   ├── scripts/                 # 脚本目录
│   │   └── safe-prisma.ts       # Prisma 命令安全包装（生产环境拦截）
│   ├── styles/                  # 全局样式
│   │   └── global.css           # 全局 CSS
│   └── types/                   # 类型定义
│       └── global.d.ts          # 全局类型声明
├── tmc.config.js                # 腾讯云部署配置
├── next.config.ts               # Next.js 配置（含安全头）
└── tsconfig.json                # TypeScript 配置
```

## 关键配置

### Next.js 配置

```typescript
{
  reactStrictMode: true,
}
```

### TypeScript 配置要点

| 配置项 | 值 | 说明 |
| ------ | --- | ---- |
| target | ES2020 | 目标编译版本 |
| strict | true | 严格类型检查 |
| jsx | preserve | JSX 保留模式 |
| moduleResolution | Bundler | 模块解析策略 |

## 常用命令

### 基础命令

| 命令 | 说明 |
| ---- | ---- |
| `pnpm run dev` | 启动开发服务器 |
| `pnpm run build` | 构建生产版本 |
| `pnpm run start` | 启动生产服务器 |

### 数据库命令（开发环境）

以下命令仅在开发环境（NODE_ENV≠production 且 APP_ENV≠PROD）可用：

| 命令 | 说明 | 生产环境可用 |
| ---- | ---- | ----------- |
| `pnpm run prisma:migrate --name xxx` | 创建迁移文件并同步本地数据库 | ❌ 会被拦截 |
| `pnpm run prisma:seed` | 清空旧数据后写入种子数据 + 创建管理员（需 ADMIN_DEFAULT_PASSWORD） | ❌ 会被拦截 |
| `pnpm run prisma:studio` | 打开 Prisma Studio 可视化界面 | ❌ 会被拦截 |

### Prisma 命令（通用 / 生产安全）

| 命令 | 说明 | 生产环境可用 |
| ---- | ---- | ----------- |
| `pnpm run prisma:generate` | 生成 Prisma Client（类型代码） | ✅ 安全 |
| `pnpm run prisma:validate` | 验证 prisma/schema.prisma 语法 | ✅ 安全 |
| `pnpm run prisma:status` | 查看数据库迁移状态 | ✅ 安全 |
| `pnpm run prisma:migrate:deploy` | **生产部署迁移**：仅执行已有的迁移 SQL | ✅ **生产推荐** |

### 表结构变更标准流程

```
开发环境：修改 schema.prisma → pnpm run prisma:migrate --name xxx → 更新 prisma/seed.ts → 测试 → 提交代码
                                                              ↓
生产环境：拉取代码 → pnpm run prisma:migrate:deploy → pnpm run prisma:generate → 重启服务
```

### 环境变量与安全触发

| 环境变量组合 | 是否触发安全保护 | 说明 |
| ----------- | --------------- | ---- |
| NODE_ENV=production | 是 | 标准生产环境 |
| NODE_ENV=prod | 是 | 生产环境简写 |
| APP_ENV=PROD | 是 | 生产环境 |
| APP_ENV=PRODUCTION | 是 | 生产环境 |
| NODE_ENV=development + APP_ENV=DEV | 否 | 正常开发环境（本地 .env 推荐配置） |

## 代码规范

### 组件命名

- 组件目录采用 PascalCase 命名（如 `Header/`）
- 组件入口文件为 `index.tsx`
- 组件样式文件为 `index.module.css`

### 样式规范

- 使用 CSS Modules 进行样式隔离
- 使用 `classnames` 库动态组合类名
- 全局变量定义在 `src/styles/global.css` 的 `:root` 中

### 数据库规范

- 数据库操作仅在服务端进行，禁止在客户端组件（`'use client'`）中导入 Repository 或 Prisma Client
- 通过 `src/lib/prisma.ts` 管理 Prisma Client 单例，开发环境启用全局缓存避免重复连接
- 所有数据库查询通过 `src/lib/repositories/` 下的 Repository 封装，优先使用 Prisma 类型安全 API
- 数据库表结构通过 Prisma Migrate 管理：
  - Schema 定义文件: `prisma/schema.prisma`
  - 迁移 SQL 文件存放在 `prisma/migrations/` 目录，随代码一同提交到 Git
  - 开发环境: `pnpm run prisma:migrate --name xxx` 生成迁移
  - 生产环境: `pnpm run prisma:migrate:deploy` 执行迁移
- 种子数据由 `prisma/seed.ts` 管理，开发环境通过 `ADMIN_DEFAULT_PASSWORD=xxx pnpm run prisma:seed` 执行

## 性能优化

- 使用 Next.js App Router 进行服务端渲染
- MySQL 连接池管理提升并发性能
- 数据库索引优化查询效率
- CSS Modules 减少样式冲突和体积
- GSAP 实现高性能动画