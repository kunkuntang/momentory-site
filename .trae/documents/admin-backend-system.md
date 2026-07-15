# 后台管理系统实施计划

## 概述

为 Momentory 摄影网站添加完整的后台管理功能，包含管理员登录、用户管理、用户角色管理、照片管理、相册管理、站点信息管理六大模块。除登录模块外，其余模块均提供完整的增删改查页面。

## 当前项目分析

- **框架**: Next.js 15 (App Router) + React 18 + TypeScript
- **数据库**: better-sqlite3 (SQLite)，连接管理在 `src/lib/database.ts`
- **样式**: CSS Modules + CSS 变量（前台），本次为后台引入 Tailwind CSS
- **认证方案**: JWT + httpOnly Cookie（使用 `jsonwebtoken` + `bcryptjs`）
- **现有表**: albums, photos, photo_categories, home_carousel, featured_photos, site_config, menu
- **现有仓库**: `src/lib/repositories/` 下的 albums.ts, featuredPhotos.ts, homeCarousel.ts, siteConfig.ts（仅有查询方法，无增删改）
- **无中间件/认证代码**: 需从零构建

## 实施步骤

### 第一步：安装依赖

```bash
pnpm add jsonwebtoken bcryptjs
pnpm add -D @types/jsonwebtoken @types/bcryptjs tailwindcss@3 postcss autoprefixer
```

### 第二步：配置 Tailwind CSS（仅用于后台）

**创建文件：**

1. `tailwind.config.ts` — Tailwind 配置，content 仅扫描 `src/app/admin` 和 `src/components/admin` 目录
2. `postcss.config.mjs` — PostCSS 配置，加载 tailwindcss 和 autoprefixer
3. `src/app/admin/globals.css` — Tailwind 指令 + 后台基础样式

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### 第三步：数据库 Schema 变更

**修改 `sql/init.sql`** — 在文件末尾添加：

```sql
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS user_roles;

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
```

**修改 `src/scripts/initDb.ts`** — 在执行 SQL 后，使用 `bcryptjs` 哈希默认密码并插入超级管理员：

```typescript
import bcrypt from 'bcryptjs';
// ... 执行 SQL 后 ...
const defaultPassword = 'Cb@Mome2026!';
const hash = bcrypt.hashSync(defaultPassword, 10);
db.prepare(`INSERT OR IGNORE INTO users (username, password_hash, role_id) VALUES (?, ?, 1)`)
  .run('cb_mome_root', hash);
```

默认超级管理员账号：
- 用户名：`cb_mome_root`
- 密码：`Cb@Mome2026!`

### 第四步：环境变量

**修改 `.env`** — 添加 JWT 密钥：

```
JWT_SECRET=momentory_admin_jwt_secret_2026
```

### 第五步：认证工具库

**创建 `src/lib/auth.ts`**：

- `hashPassword(password: string): string` — 使用 bcryptjs 哈希密码
- `verifyPassword(password: string, hash: string): boolean` — 验证密码
- `generateToken(payload): string` — 使用 jsonwebtoken 签发 JWT（有效期 24h）
- `verifyToken(token: string): payload | null` — 验证 JWT
- `getSession(): Session | null` — 从 `cookies()` 读取 token 并验证，返回用户信息
- `requireAuth(): Session` — 调用 getSession，未认证时 `redirect('/admin/login')`
- `requirePermission(perm: string): Session` — 验证权限，权限不足时抛出错误

Session 类型包含：`{ userId, username, roleId, permissions }`

### 第六步：数据访问层（Repositories）

**创建新仓库文件：**

1. `src/lib/repositories/users.ts`
   - `User` 接口定义
   - `getUserByUsername(username): User | null` — 用于登录验证
   - `getUserById(id): User | null`
   - `getAllUsers(): User[]` — 列表查询（JOIN user_roles 获取角色名）
   - `createUser(data): User` — 插入用户
   - `updateUser(id, data): void` — 更新用户
   - `updateUserPassword(id, hash): void` — 单独更新密码
   - `deleteUser(id): void` — 删除用户
   - `updateLastLogin(id): void` — 更新最后登录时间

2. `src/lib/repositories/userRoles.ts`
   - `UserRole` 接口定义
   - `getAllRoles(): UserRole[]` — 列表查询
   - `getRoleById(id): UserRole | null`
   - `createRole(data): UserRole`
   - `updateRole(id, data): void`
   - `deleteRole(id): void` — 检查是否有关联用户，有则拒绝

**扩展现有仓库（添加 CRUD 方法）：**

3. `src/lib/repositories/albums.ts` — 添加：
   - `createAlbum(data): Album`
   - `updateAlbum(id, data): void`
   - `deleteAlbum(id): void`（ON DELETE CASCADE 会自动删除关联照片）

4. `src/lib/repositories/featuredPhotos.ts` — 添加：
   - `getFeaturedPhotoById(id): FeaturedPhoto | null`
   - `getAllFeaturedPhotos(): FeaturedPhoto[]`（包含未激活的）
   - `createFeaturedPhoto(data): FeaturedPhoto`
   - `updateFeaturedPhoto(id, data): void`
   - `deleteFeaturedPhoto(id): void`

5. `src/lib/repositories/homeCarousel.ts` — 添加：
   - `getCarouselItemById(id): HomeCarouselItem | null`
   - `getAllCarouselItems(): HomeCarouselItem[]`
   - `createCarouselItem(data): HomeCarouselItem`
   - `updateCarouselItem(id, data): void`
   - `deleteCarouselItem(id): void`

6. `src/lib/repositories/siteConfig.ts` — 添加：
   - `updateSiteConfig(id, data): void`
   - `getAllMenuItems(): MenuItem[]`（包含未激活的）
   - `getMenuItemById(id): MenuItem | null`
   - `createMenuItem(data): MenuItem`
   - `updateMenuItem(id, data): void`
   - `deleteMenuItem(id): void`

7. `src/lib/repositories/photos.ts`（新建）— 照片独立 CRUD：
   - `Photo` 接口（复用 albums.ts 中的）
   - `getPhotoById(id): Photo | null`
   - `getAllPhotos(): Photo[]` — 列表查询（JOIN albums 获取相册名）
   - `createPhoto(data): Photo`
   - `updatePhoto(id, data): void`
   - `deletePhoto(id): void`

### 第七步：后台布局结构

使用 Next.js App Router 路由组（Route Groups）分离登录页和受保护页面：

```
src/app/admin/
├── layout.tsx              # 基础布局，引入 Tailwind CSS
├── globals.css            # Tailwind 指令
├── login/
│   ├── page.tsx           # 登录页面（无需认证）
│   └── action.ts          # 登录 Server Action
└── (dashboard)/
    ├── layout.tsx          # 认证守卫 + 侧边栏布局
    ├── page.tsx            # 后台首页 Dashboard
    ├── users/              # 用户管理
    ├── roles/              # 角色管理
    ├── photos/             # 照片管理
    ├── albums/             # 相册管理
    └── site-config/        # 站点信息管理
```

**`src/app/admin/layout.tsx`** — 基础布局：
- 引入 `./globals.css`
- 设置 `<html>` / `<body>` 标签
- 不包含 Header/Footer（与前台完全独立）

**`src/app/admin/(dashboard)/layout.tsx`** — 认证守卫布局：
- 调用 `requireAuth()` 验证登录状态
- 渲染侧边栏（Sidebar）+ 顶栏（TopBar）+ 内容区
- 侧边栏链接：仪表盘、用户管理、角色管理、照片管理、相册管理、站点信息
- 顶栏显示当前用户名 + 登出按钮

### 第八步：登录模块

**`src/app/admin/login/page.tsx`** — 登录页面：
- 居中卡片式登录表单
- 用户名 + 密码输入
- 错误提示
- 使用 Tailwind 样式

**`src/app/admin/login/action.ts`** — 登录 Server Action：
- 验证用户名密码
- 生成 JWT，设置 httpOnly cookie
- 更新 last_login_at
- 重定向到 `/admin`

**`src/app/admin/logout/action.ts`** — 登出 Server Action：
- 清除 JWT cookie
- 重定向到 `/admin/login`

### 第九步：后台通用组件

**创建 `src/components/admin/` 目录：**

1. `Sidebar/index.tsx` — 侧边栏导航组件
   - 使用 lucide-react 图标
   - 高亮当前活跃页面
   - 折叠/展开（可选）

2. `DataTable/index.tsx` — 通用数据表格组件
   - 接收 columns 配置 + data
   - 支持操作列（编辑/删除按钮）
   - 空状态显示

3. `FormFields/index.tsx` — 表单字段组件
   - `Input` — 文本输入
   - `Textarea` — 多行文本
   - `Select` — 下拉选择
   - `Checkbox` — 勾选框
   - `FormField` — 带标签的表单项包装

4. `ConfirmDialog/index.tsx` — 删除确认弹窗
   - 客户端组件
   - 防止误删

5. `PageHeader/index.tsx` — 页面标题组件
   - 标题 + 描述 + 操作按钮（如"新建"）

### 第十步：用户管理模块

**文件结构：**
```
src/app/admin/(dashboard)/users/
├── page.tsx              # 用户列表
├── new/
│   └── page.tsx          # 新建用户
├── [id]/
│   └── page.tsx          # 编辑用户
└── actions.ts            # Server Actions
```

**列表页** (`page.tsx`):
- Server Component，调用 `getAllUsers()`
- 表格列：ID、用户名、角色、状态、最后登录、创建时间、操作
- 操作：编辑、删除（超级管理员不可删除）

**新建页** (`new/page.tsx`):
- 表单字段：用户名、密码、角色（下拉选择）、是否激活
- Server Action 处理表单提交

**编辑页** (`[id]/page.tsx`):
- 表单字段：用户名、角色、是否激活、重置密码（可选）
- Server Action 处理更新

**Server Actions** (`actions.ts`):
- `createUserAction(formData)` — 创建用户
- `updateUserAction(id, formData)` — 更新用户
- `deleteUserAction(id)` — 删除用户

### 第十一步：用户角色管理模块

**文件结构：**
```
src/app/admin/(dashboard)/roles/
├── page.tsx              # 角色列表
├── new/
│   └── page.tsx          # 新建角色
├── [id]/
│   └── page.tsx          # 编辑角色
└── actions.ts            # Server Actions
```

**列表页**: 表格列 — ID、角色名、描述、权限、创建时间、操作
**新建/编辑页**: 表单字段 — 角色名、描述、权限（多选框组：用户管理、角色管理、照片管理、相册管理、站点信息）

**Server Actions**: `createRoleAction`, `updateRoleAction`, `deleteRoleAction`

### 第十二步：照片管理模块

**文件结构：**
```
src/app/admin/(dashboard)/photos/
├── page.tsx              # 照片列表
├── new/
│   └── page.tsx          # 新建照片
├── [id]/
│   └── page.tsx          # 编辑照片
└── actions.ts            # Server Actions
```

**列表页**: 表格列 — ID、缩略图、标题、所属相册、分类、日期、位置、排序、是否Live、操作
**新建/编辑页**: 表单字段 — 所属相册（下拉）、图片URL、图片Alt、标题、描述、分类（下拉）、是否Live、Live视频URL、日期、位置、排序

**Server Actions**: `createPhotoAction`, `updatePhotoAction`, `deletePhotoAction`

### 第十三步：相册管理模块

**文件结构：**
```
src/app/admin/(dashboard)/albums/
├── page.tsx              # 相册列表
├── new/
│   └── page.tsx          # 新建相册
├── [id]/
│   └── page.tsx          # 编辑相册
└── actions.ts            # Server Actions
```

**列表页**: 表格列 — ID、封面缩略图、Slug、标题、照片数、是否私密、创建时间、操作
**新建/编辑页**: 表单字段 — Slug、标题、摘要、封面图URL、封面图Alt、是否私密

**Server Actions**: `createAlbumAction`, `updateAlbumAction`, `deleteAlbumAction`

### 第十四步：站点信息管理模块

管理全部站点展示数据，包含四个子模块：

**文件结构：**
```
src/app/admin/(dashboard)/site-config/
├── page.tsx                          # 站点信息总览
├── site/
│   └── [id]/page.tsx                 # 编辑站点配置
├── menu/
│   ├── page.tsx                      # 菜单列表
│   ├── new/page.tsx                  # 新建菜单项
│   └── [id]/page.tsx                 # 编辑菜单项
├── featured-photos/
│   ├── page.tsx                      # 精选照片列表
│   ├── new/page.tsx                  # 新建精选照片
│   └── [id]/page.tsx                 # 编辑精选照片
├── carousel/
│   ├── page.tsx                      # 轮播列表
│   ├── new/page.tsx                  # 新建轮播项
│   └── [id]/page.tsx                 # 编辑轮播项
└── actions.ts                        # 所有站点信息 Server Actions
```

**总览页** (`page.tsx`): 卡片式展示四个子模块入口 + 数据概览

**站点配置编辑** (`site/[id]/page.tsx`): 表单字段 — 站点名称、Logo文字、标语、版权信息

**菜单管理** (`menu/`): 列表 + 新建 + 编辑
- 表单字段：标签、URL、链接类型（下拉：inner/outer/mini_program/universal_app/android_app/apple_app）、排序、是否激活

**精选照片管理** (`featured-photos/`): 列表 + 新建 + 编辑
- 表单字段：标题、描述、日期、位置、图片URL、图片Alt、排序、是否激活

**轮播管理** (`carousel/`): 列表 + 新建 + 编辑
- 表单字段：类型（image/video）、标题、说明、关联照片ID、Live封面URL、视频URL、视频封面URL、日期、位置、排序、是否激活

### 第十五步：后台首页 Dashboard

**`src/app/admin/(dashboard)/page.tsx`**:
- 统计卡片：用户总数、相册总数、照片总数、精选照片数
- 快捷操作入口

## 假设与决策

1. **默认超级管理员密码**: `Cb@Mome2026!`（可在首次登录后修改）
2. **JWT 有效期**: 24 小时
3. **Cookie 配置**: httpOnly + secure(production) + sameSite=lax + path=/
4. **权限模型**: 简单的字符串数组，`["*"]` 表示全部权限，其他为模块名（如 `["users", "albums"]`）
5. **照片分类表** (`photo_categories`) 已存在，照片管理模块复用
6. **删除策略**: 相册删除时级联删除照片（已配置 ON DELETE CASCADE）；用户角色有关联用户时不允许删除
7. **图片处理**: 所有图片以 URL 形式存储，后台不提供文件上传功能
8. **Tailwind 仅用于后台**: 通过 tailwind.config.ts 的 content 配置限定扫描范围，不影响前台 CSS Modules 样式
9. **Server Actions**: 所有表单提交使用 Server Actions，不创建额外的 API 路由（除登录/登出外也用 Server Actions）
10. **密码修改**: 编辑用户页面提供可选的"重置密码"字段，留空则不修改

## 验证步骤

1. **安装依赖后**: 确认 `tailwindcss` 和 `jsonwebtoken` 可正常 import
2. **数据库初始化**: 运行 `pnpm run reset-db`，确认 users 和 user_roles 表创建成功，超级管理员账号已插入
3. **登录测试**: 访问 `/admin/login`，使用 `cb_mome_root` / `Cb@Mome2026!` 登录，确认跳转到 `/admin`
4. **认证守卫**: 未登录状态下访问 `/admin/users` 等，确认重定向到登录页
5. **各模块 CRUD**: 逐个测试每个模块的列表、新建、编辑、删除功能
6. **前台数据一致性**: 后台修改数据后，刷新前台页面确认数据已更新
7. **权限控制**: 创建普通管理员角色（无某模块权限），登录后确认侧边栏不显示该模块

## 文件清单（新增/修改）

### 新增文件
- `tailwind.config.ts`
- `postcss.config.mjs`
- `src/app/admin/globals.css`
- `src/app/admin/layout.tsx`
- `src/app/admin/login/page.tsx`
- `src/app/admin/login/action.ts`
- `src/app/admin/logout/action.ts`
- `src/app/admin/(dashboard)/layout.tsx`
- `src/app/admin/(dashboard)/page.tsx`
- `src/app/admin/(dashboard)/users/page.tsx`
- `src/app/admin/(dashboard)/users/new/page.tsx`
- `src/app/admin/(dashboard)/users/[id]/page.tsx`
- `src/app/admin/(dashboard)/users/actions.ts`
- `src/app/admin/(dashboard)/roles/page.tsx`
- `src/app/admin/(dashboard)/roles/new/page.tsx`
- `src/app/admin/(dashboard)/roles/[id]/page.tsx`
- `src/app/admin/(dashboard)/roles/actions.ts`
- `src/app/admin/(dashboard)/photos/page.tsx`
- `src/app/admin/(dashboard)/photos/new/page.tsx`
- `src/app/admin/(dashboard)/photos/[id]/page.tsx`
- `src/app/admin/(dashboard)/photos/actions.ts`
- `src/app/admin/(dashboard)/albums/page.tsx`
- `src/app/admin/(dashboard)/albums/new/page.tsx`
- `src/app/admin/(dashboard)/albums/[id]/page.tsx`
- `src/app/admin/(dashboard)/albums/actions.ts`
- `src/app/admin/(dashboard)/site-config/page.tsx`
- `src/app/admin/(dashboard)/site-config/site/[id]/page.tsx`
- `src/app/admin/(dashboard)/site-config/menu/page.tsx`
- `src/app/admin/(dashboard)/site-config/menu/new/page.tsx`
- `src/app/admin/(dashboard)/site-config/menu/[id]/page.tsx`
- `src/app/admin/(dashboard)/site-config/featured-photos/page.tsx`
- `src/app/admin/(dashboard)/site-config/featured-photos/new/page.tsx`
- `src/app/admin/(dashboard)/site-config/featured-photos/[id]/page.tsx`
- `src/app/admin/(dashboard)/site-config/carousel/page.tsx`
- `src/app/admin/(dashboard)/site-config/carousel/new/page.tsx`
- `src/app/admin/(dashboard)/site-config/carousel/[id]/page.tsx`
- `src/app/admin/(dashboard)/site-config/actions.ts`
- `src/lib/auth.ts`
- `src/lib/repositories/users.ts`
- `src/lib/repositories/userRoles.ts`
- `src/lib/repositories/photos.ts`
- `src/components/admin/Sidebar/index.tsx`
- `src/components/admin/DataTable/index.tsx`
- `src/components/admin/FormFields/index.tsx`
- `src/components/admin/ConfirmDialog/index.tsx`
- `src/components/admin/PageHeader/index.tsx`

### 修改文件
- `sql/init.sql` — 添加 user_roles 和 users 表定义
- `src/scripts/initDb.ts` — 添加默认超级管理员账号创建
- `.env` — 添加 JWT_SECRET
- `src/lib/repositories/albums.ts` — 添加 create/update/delete 方法
- `src/lib/repositories/featuredPhotos.ts` — 添加 CRUD 方法
- `src/lib/repositories/homeCarousel.ts` — 添加 CRUD 方法
- `src/lib/repositories/siteConfig.ts` — 添加 updateSiteConfig + menu CRUD 方法
