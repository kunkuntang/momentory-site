# 后台管理系统验证与修复计划

## 概述

后台管理系统已在之前的会话中完整实现，包含 6 个模块（登录、用户、角色、照片、相册、站点信息）。本计划的目标是验证实现的正确性，并修复发现的任何问题。

## 当前状态分析

通过代码审查，已确认以下文件全部存在且实现完整：

### 核心文件
- [src/lib/auth.ts](file:///Users/cubesuger/Documents/workspace/kunkuntang/momentory-site2/src/lib/auth.ts) - JWT 认证工具（hashPassword, verifyPassword, generateToken, verifyToken, getSession, requireAuth, requirePermission, setSessionCookie, clearSessionCookie）
- [src/scripts/initDb.ts](file:///Users/cubesuger/Documents/workspace/kunkuntang/momentory-site2/src/scripts/initDb.ts) - 数据库初始化，含 bcrypt 哈希和超级管理员创建
- [sql/init.sql](file:///Users/cubesuger/Documents/workspace/kunkuntang/momentory-site2/sql/init.sql) - 含 users 和 user_roles 表定义

### 数据访问层
- [src/lib/repositories/users.ts](file:///Users/cubesuger/Documents/workspace/kunkuntang/momentory-site2/src/lib/repositories/users.ts) - 完整 CRUD
- [src/lib/repositories/userRoles.ts](file:///Users/cubesuger/Documents/workspace/kunkuntang/momentory-site2/src/lib/repositories/userRoles.ts) - 完整 CRUD + countUsersByRole
- [src/lib/repositories/photos.ts](file:///Users/cubesuger/Documents/workspace/kunkuntang/momentory-site2/src/lib/repositories/photos.ts) - 完整 CRUD + getAllCategories
- [src/lib/repositories/albums.ts](file:///Users/cubesuger/Documents/workspace/kunkuntang/momentory-site2/src/lib/repositories/albums.ts) - 完整 CRUD
- [src/lib/repositories/featuredPhotos.ts](file:///Users/cubesuger/Documents/workspace/kunkuntang/momentory-site2/src/lib/repositories/featuredPhotos.ts) - 完整 CRUD
- [src/lib/repositories/homeCarousel.ts](file:///Users/cubesuger/Documents/workspace/kunkuntang/momentory-site2/src/lib/repositories/homeCarousel.ts) - 完整 CRUD
- [src/lib/repositories/siteConfig.ts](file:///Users/cubesuger/Documents/workspace/kunkuntang/momentory-site2/src/lib/repositories/siteConfig.ts) - 完整 CRUD（site_config + menu）

### 管理后台组件
- [src/components/admin/Sidebar.tsx](file:///Users/cubesuger/Documents/workspace/kunkuntang/momentory-site2/src/components/admin/Sidebar.tsx) - 权限过滤导航
- [src/components/admin/DataTable.tsx](file:///Users/cubesuger/Documents/workspace/kunkuntang/momentory-site2/src/components/admin/DataTable.tsx) - 泛型表格
- [src/components/admin/FormFields.tsx](file:///Users/cubesuger/Documents/workspace/kunkuntang/momentory-site2/src/components/admin/FormFields.tsx) - FormField/Input/Textarea/Select/Checkbox/CheckboxGroup
- [src/components/admin/DeleteButton.tsx](file:///Users/cubesuger/Documents/workspace/kunkuntang/momentory-site2/src/components/admin/DeleteButton.tsx) - 确认删除按钮
- [src/components/admin/SubmitButton.tsx](file:///Users/cubesuger/Documents/workspace/kunkuntang/momentory-site2/src/components/admin/SubmitButton.tsx) - useFormStatus 提交按钮
- [src/components/admin/PageHeader.tsx](file:///Users/cubesuger/Documents/workspace/kunkuntang/momentory-site2/src/components/admin/PageHeader.tsx)

### 管理后台页面
- 登录: `admin/login/page.tsx` + `admin/login/action.ts`
- 登出: `admin/logout/action.ts`
- 仪表盘: `admin/(dashboard)/page.tsx` + `layout.tsx`（含 requireAuth 守卫）
- 用户 CRUD: `admin/(dashboard)/users/` (page, new, [id], actions)
- 角色 CRUD: `admin/(dashboard)/roles/` (page, new, [id], actions)
- 照片 CRUD: `admin/(dashboard)/photos/` (page, new, [id], actions)
- 相册 CRUD: `admin/(dashboard)/albums/` (page, new, [id], actions)
- 站点信息: `admin/(dashboard)/site-config/` (page, actions, site/[id], menu/*, featured-photos/*, carousel/*)

### 前端路由组
- [src/app/(site)/layout.tsx](file:///Users/cubesuger/Documents/workspace/kunkuntang/momentory-site2/src/app/(site)/layout.tsx) - 含 Header/Footer
- [src/app/(site)/page.tsx](file:///Users/cubesuger/Documents/workspace/kunkuntang/momentory-site2/src/app/(site)/page.tsx)
- [src/app/(site)/about/page.tsx](file:///Users/cubesuger/Documents/workspace/kunkuntang/momentory-site2/src/app/(site)/about/page.tsx)
- [src/app/(site)/albums/page.tsx](file:///Users/cubesuger/Documents/workspace/kunkuntang/momentory-site2/src/app/(site)/albums/page.tsx)
- [src/app/(site)/albums/[albumId]/page.tsx](file:///Users/cubesuger/Documents/workspace/kunkuntang/momentory-site2/src/app/(site)/albums/[albumId]/page.tsx)

### 配置
- [tailwind.config.ts](file:///Users/cubesuger/Documents/workspace/kunkuntang/momentory-site2/tailwind.config.ts) - content 仅扫描 admin 目录
- [postcss.config.mjs](file:///Users/cubesuger/Documents/workspace/kunkuntang/momentory-site2/postcss.config.mjs)
- [tsconfig.json](file:///Users/cubesuger/Documents/workspace/kunkuntang/momentory-site2/tsconfig.json) - 含 @/* 路径别名
- [package.json](file:///Users/cubesuger/Documents/workspace/kunkuntang/momentory-site2/package.json) - 依赖完整（jsonwebtoken, bcryptjs, lucide-react, tailwindcss）

## 发现的潜在问题

### 问题 1: albums 列表页类型断言
- **文件**: [src/app/admin/(dashboard)/albums/page.tsx](file:///Users/cubesuger/Documents/workspace/kunkuntang/momentory-site2/src/app/admin/(dashboard)/albums/page.tsx)
- **描述**: `getAllAlbums()` 返回类型为 `Album[]`，但页面中通过 `as AlbumListItem[]` 断言为含 `photo_count` 的类型。SQL 查询实际返回了 `photo_count` 字段，运行时正常，但类型不匹配。
- **严重性**: 低 - 不影响运行，仅类型安全问题
- **修复方案**: 在 albums repository 的 `getAllAlbums()` 返回类型中添加 `photo_count` 字段，或导出 `AlbumListItem` 类型

### 问题 2: createAlbum 返回值双重断言
- **文件**: [src/lib/repositories/albums.ts](file:///Users/cubesuger/Documents/workspace/kunkuntang/momentory-site2/src/lib/repositories/albums.ts#L106-L107)
- **描述**: `createAlbum` 使用 `as unknown as Album` 双重断言返回值
- **严重性**: 低 - 不影响运行
- **修复方案**: 使用 `getAlbumById` 获取完整记录后返回

## 验证步骤

### 步骤 1: TypeScript 类型检查
运行 `npx tsc --noEmit` 验证无类型错误。如有错误则修复。

### 步骤 2: 数据库重置与初始化
运行 `pnpm run reset-db` 验证数据库初始化成功，超级管理员账号 `cb_mome_root` 创建成功。

### 步骤 3: Next.js 生产构建
运行 `pnpm build` 验证所有页面编译成功，路由注册正确。

### 步骤 4: 修复发现的问题
根据上述步骤结果，修复任何编译/类型/运行时错误。重点修复：
- albums 列表页类型断言问题
- createAlbum 返回值类型问题
- 任何 tsc 或 build 报告的其他错误

### 步骤 5: 开发服务器启动验证
运行 `pnpm dev` 启动开发服务器，验证无运行时错误。

## 假设与决策

1. **不修改功能逻辑**: 仅修复验证中发现的错误，不改变已有功能行为
2. **保持现有架构**: 不重构 Server Actions 模式、路由组结构或认证流程
3. **修复范围**: 仅修复导致编译失败或运行时错误的代码，类型安全问题仅在确认不影响运行时才修复
4. **超级管理员保护**: 保持现有对 `cb_mome_root` 用户和 `super_admin` 角色的删除保护逻辑不变
