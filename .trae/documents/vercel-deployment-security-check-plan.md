# Vercel 部署前安全检查计划

## 一、风险评估总结

### 🔴 高风险问题（必须修复）

| # | 问题类型 | 问题描述 | 位置 | 风险等级 |
|---|---|---|---|---|
| 1 | 硬编码密码 | 默认管理员密码 `Cb@Mome2026!` 写死在代码中 | [`initDb.ts`](file:///Users/cubesuger/Documents/workspace/kunkuntang/momentory-site2/src/scripts/initDb.ts#L12) | **HIGH** |
| 2 | 弱密钥 | JWT_SECRET 使用了弱密钥 `momentory_admin_jwt_secret_2026` | [`.env`](file:///Users/cubesuger/Documents/workspace/kunkuntang/momentory-site2/.env#L3) | **HIGH** |
| 3 | 数据库文件未忽略 | `db/` 目录未在 `.gitignore` 中忽略，数据库文件可能被提交到 Git | [`.gitignore`](file:///Users/cubesuger/Documents/workspace/kunkuntang/momentory-site2/.gitignore) | **HIGH** |
| 4 | SQLite 在 Vercel 上的兼容性 | Vercel Edge/Serverless 环境文件系统只读，SQLite WAL 模式无法正常工作 | [`database.ts`](file:///Users/cubesuger/Documents/workspace/kunkuntang/momentory-site2/src/lib/database.ts#L6-L11) | **HIGH** |

### 🟡 中风险问题（建议修复）

| # | 问题类型 | 问题描述 | 位置 | 风险等级 |
|---|---|---|---|---|
| 5 | 缺少 Vercel 配置 | 没有 `vercel.json` 配置文件，部署可能出现问题 | 无 | MEDIUM |
| 6 | 缺少安全中间件 | 没有 `middleware.ts` 进行全局安全检查和请求过滤 | 无 | MEDIUM |
| 7 | Next.js 配置不完善 | `next.config.ts` 缺少 `images` 域名配置和安全头 | [`next.config.ts`](file:///Users/cubesuger/Documents/workspace/kunkuntang/momentory-site2/next.config.ts) | MEDIUM |
| 8 | 数据库初始化依赖 | `init-db` 脚本依赖本地环境，Vercel 构建时无法自动运行 | [`package.json`](file:///Users/cubesuger/Documents/workspace/kunkuntang/momentory-site2/package.json#L9) | MEDIUM |

### 🟢 低风险问题（可选优化）

| # | 问题类型 | 问题描述 | 位置 | 风险等级 |
|---|---|---|---|---|
| 9 | 数据库文件存在 | 当前目录有实际数据库文件，建议清理 | `db/` 目录 | LOW |
| 10 | 缺少构建验证脚本 | 没有 `lint`、`typecheck` 等验证脚本 | [`package.json`](file:///Users/cubesuger/Documents/workspace/kunkuntang/momentory-site2/package.json) | LOW |

---

## 二、修复方案

### 1. 修复硬编码密码

**目标**：移除代码中的硬编码默认密码，改为通过环境变量配置

**修改文件**：`src/scripts/initDb.ts`

**修改内容**：
- 将 `const defaultPassword = 'Cb@Mome2026!';` 改为从环境变量读取
- 添加环境变量不存在时的错误提示

### 2. 生成强 JWT 密钥

**目标**：使用强随机密钥替代弱密钥

**操作**：
- 使用命令生成强密钥：`openssl rand -hex 32`
- 在 `.env` 文件中更新 `JWT_SECRET`
- 在 Vercel 项目设置中配置环境变量

### 3. 更新 .gitignore

**目标**：确保数据库文件和敏感文件不被提交

**修改文件**：`.gitignore`

**修改内容**：
- 添加 `db/` 目录
- 添加 `.env.local`
- 添加 `.env.production`

### 4. SQLite 兼容性处理

**目标**：确保 SQLite 在 Vercel 无服务器环境中正常工作

**方案选择**：
- **方案 A**：改用 Prisma + SQLite（推荐）- 需要重构数据库访问层
- **方案 B**：保持 better-sqlite3，但在生产环境禁用 WAL 模式，使用内存缓存或临时文件
- **方案 C**：改用 PostgreSQL（Vercel 提供免费数据库）

**推荐方案**：方案 B（最小改动），后续可升级到方案 C

### 5. 创建 Vercel 配置

**目标**：配置 Vercel 部署选项

**新建文件**：`vercel.json`

**配置内容**：
- 指定构建命令和输出目录
- 配置环境变量
- 设置边缘运行时（如果需要）

### 6. 完善 Next.js 配置

**目标**：添加安全相关配置

**修改文件**：`next.config.ts`

**修改内容**：
- 添加 `images` 配置（允许的域名）
- 配置安全头

### 7. 清理数据库文件

**目标**：移除开发环境的数据库文件

**操作**：
- 删除 `db/momentory.sqlite`
- 删除 `db/momentory.sqlite-shm`
- 删除 `db/momentory.sqlite-wal`

---

## 三、实施步骤

### 阶段一：安全修复（高优先级）

1. **步骤 1-1**：修改 `src/scripts/initDb.ts`，移除硬编码密码
2. **步骤 1-2**：更新 `.gitignore`，添加 `db/` 目录和环境文件
3. **步骤 1-3**：生成强 JWT 密钥并更新 `.env`
4. **步骤 1-4**：修改 `src/lib/database.ts`，适配 Vercel 环境

### 阶段二：部署配置（中优先级）

5. **步骤 2-1**：创建 `vercel.json` 配置文件
6. **步骤 2-2**：完善 `next.config.ts` 安全配置
7. **步骤 2-3**：清理本地数据库文件

### 阶段三：验证测试（低优先级）

8. **步骤 3-1**：运行构建验证：`pnpm run build`
9. **步骤 3-2**：检查 Git 状态，确保无敏感文件待提交
10. **步骤 3-3**：在 Vercel 上配置环境变量

---

## 四、风险处理

### SQLite 在 Vercel 的风险

**问题**：Vercel Serverless 函数在冷启动时会创建新的执行环境，文件系统是临时的。SQLite WAL 模式需要写入权限，在只读文件系统上会失败。

**解决方案**：
1. 在生产环境禁用 WAL 模式
2. 使用 `read-only` 模式打开数据库（仅查询）
3. 对于写操作，需要使用外部数据库（如 Vercel PostgreSQL）

### 数据库初始化风险

**问题**：Vercel 构建时无法运行 `pnpm run init-db`，数据库不会自动初始化。

**解决方案**：
1. 使用 Vercel PostgreSQL 数据库
2. 或者在首次请求时检查并初始化数据库

---

## 五、验证清单

- [ ] `.env` 文件中的 JWT_SECRET 是强随机密钥
- [ ] `.gitignore` 包含 `db/` 目录
- [ ] `src/scripts/initDb.ts` 不再包含硬编码密码
- [ ] `src/lib/database.ts` 适配 Vercel 环境
- [ ] `vercel.json` 配置文件已创建
- [ ] `next.config.ts` 包含安全配置
- [ ] 本地数据库文件已清理
- [ ] `pnpm run build` 成功执行
- [ ] Git 状态无未提交的敏感文件
- [ ] Vercel 环境变量已正确配置
