# Momentory

把日常光影收藏成册

Momentory 是一个展示摄影师照片的网站，用来整理旅行、城市漫步和日常生活中的影像片段。网站保持轻量、留白和可持续更新，让照片拥有足够安静的观看空间。

## 功能特点

- **首页幻灯片**：支持图片和视频自动轮播，配有进度条和切换控制
- **相册分类**：按主题分类展示多个相册，支持私有相册标记
- **精选图片**：首页精选展示优质摄影作品
- **加密相册**：支持密码保护访问，解锁后保持会话状态
- **滚动动画**：基于 GSAP 的流畅滚动入场动画
- **响应式设计**：适配桌面端和移动端

## 技术栈

- **框架**：Next.js 15（App Router）
- **语言**：TypeScript 5.6
- **样式**：CSS Modules
- **动画**：GSAP（@gsap/react, ScrollTrigger）
- **图标**：Lucide React
- **工具库**：classnames
- **包管理器**：pnpm 9
- **部署工具**：tmc-cli（腾讯云 COS）

## 项目结构

```
src/
├── app/                    # Next.js App Router 页面
│   ├── about/              # 关于页面
│   ├── albums/             # 相册列表和详情页面
│   ├── layout.tsx          # 根布局
│   └── page.tsx            # 首页
├── components/             # 通用组件
│   ├── AlbumAccessGate/    # 密码访问门
│   ├── AlbumCard/          # 相册卡片
│   ├── Footer/             # 页脚
│   ├── Header/             # 头部导航
│   ├── Layout/             # 布局组件
│   ├── PageHero/           # 页面英雄区域
│   ├── SectionHeader/      # 区块标题
│   └── TextLink/           # 文本链接
├── data/                   # 静态数据
│   └── siteData.ts         # 站点配置和相册数据
├── styles/                 # 全局样式
│   └── global.css
├── types/                  # TypeScript 类型定义
│   └── global.d.ts
└── views/                  # 页面视图组件
    ├── AboutPage/          # 关于页面视图
    ├── AlbumDetailPage/    # 相册详情页面视图
    ├── AlbumsPage/         # 相册列表页面视图
    └── HomePage/           # 首页视图
```

## 环境变量

在项目根目录创建 `.env.local` 文件，配置以下环境变量：

| 变量名 | 说明 | 默认值 |
|--------|------|--------|
| `NEXT_PUBLIC_ALBUM_PASSWORD` | 加密相册的访问密码 | momentory |

> **安全提示**：请使用 `.env.local` 文件存储敏感配置，该文件已被 `.gitignore` 排除。不要将 `.env` 文件提交到版本控制中。

## 启动方式

### 开发环境

```bash
pnpm dev
```

访问 http://localhost:3000 查看网站。

### 构建生产版本

```bash
pnpm build
```

### 启动生产服务器

```bash
pnpm start
```

## 部署方式

### 腾讯云 COS（推荐）

项目使用 tmc-cli 部署到腾讯云对象存储（COS）：

```bash
pnpm build
tmc deploy
```

部署配置文件为 `tmc.config.js`，包含以下配置：
- 存储桶类型：腾讯云 COS
- 存储桶名称：momentory-site
- 区域：ap-guangzhou
- AppID：1251521980

### Vercel

```bash
# 安装 Vercel CLI
npm install -g vercel

# 登录并部署
vercel login
vercel
```

### 其他平台

使用标准的 Next.js 部署方式：

```bash
pnpm build
pnpm start
```

确保环境变量 `NEXT_PUBLIC_ALBUM_PASSWORD` 在部署平台中正确配置。

## 数据管理

相册和照片数据存储在 `src/data/siteData.ts` 中，包括：

- 站点信息（名称、标语、导航）
- 首页轮播幻灯片
- 相册列表及照片
- 精选图片
- 摄影师简介

如需添加新相册或照片，直接编辑此文件即可。

## License

MIT