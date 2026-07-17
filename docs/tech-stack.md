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
| mysql2 | ^3.10.0 | 高性能 MySQL 驱动（Promise API） |

**数据库配置**:
- 字符集: `utf8mb4`
- 排序规则: `utf8mb4_unicode_ci`
- 存储引擎: InnoDB
- 连接池: 最大连接数 10

**环境变量**:
```bash
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=momentory
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
├── sql/                         # SQL 脚本目录
│   └── init.sql                 # 数据库初始化脚本（MySQL）
├── src/
│   ├── app/                     # Next.js App Router 路由
│   │   ├── about/               # 关于页面
│   │   ├── albums/              # 相册页面
│   │   ├── layout.tsx           # 根布局
│   │   └── page.tsx             # 首页
│   ├── components/              # 可复用组件
│   │   ├── Header/              # 头部导航
│   │   ├── Footer/              # 页脚
│   │   ├── Layout/              # 布局组件
│   │   ├── AlbumCard/           # 相册卡片
│   │   ├── AlbumAccessGate/     # 相册访问权限门
│   │   ├── PageHero/            # 页面英雄区
│   │   ├── SectionHeader/       # 区块标题
│   │   └── TextLink/            # 文本链接
│   ├── views/                   # 页面视图组件
│   │   ├── HomePage/            # 首页视图
│   │   ├── AlbumsPage/          # 相册列表视图
│   │   ├── AlbumDetailPage/     # 相册详情视图
│   │   └── AboutPage/           # 关于页面视图
│   ├── data/                    # 静态数据
│   │   └── siteData.ts          # 站点配置数据
│   ├── lib/                     # 工具库
│   │   └── database.ts          # 数据库连接封装
│   ├── scripts/                 # 脚本
│   │   └── initDb.ts            # 数据库初始化脚本
│   ├── styles/                  # 全局样式
│   │   └── global.css           # 全局 CSS
│   └── types/                   # 类型定义
│       └── global.d.ts          # 全局类型声明
├── cb.config.js                 # 部署配置
├── tmc.config.js                # 部署配置
├── next.config.ts               # Next.js 配置
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

| 命令 | 说明 |
| ---- | ---- |
| `pnpm run dev` | 启动开发服务器 |
| `pnpm run build` | 构建生产版本 |
| `pnpm run start` | 启动生产服务器 |
| `pnpm run init-db` | 初始化数据库 |
| `pnpm run reset-db` | 重置数据库 |

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

- 数据库操作仅在服务端进行
- 数据库连接通过 `src/lib/database.ts` 管理
- SQL 脚本存放于 `sql/` 目录

## 性能优化

- 使用 Next.js App Router 进行服务端渲染
- MySQL 连接池管理提升并发性能
- 数据库索引优化查询效率
- CSS Modules 减少样式冲突和体积
- GSAP 实现高性能动画