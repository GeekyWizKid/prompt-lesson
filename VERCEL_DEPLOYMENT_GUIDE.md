# Vercel 部署指南

本指南将帮助你将 Prompt Engineering Demo 项目部署到 Vercel 平台。

## 🚀 快速部署

### 方法一：一键部署（推荐）

1. **Fork 项目到你的 GitHub**
   ```bash
   # 如果你还没有 fork，请在 GitHub 上 fork 这个仓库
   # 然后 clone 到本地
   git clone https://github.com/YOUR_USERNAME/prompt-lesson.git
   cd prompt-lesson
   ```

2. **登录 Vercel 并导入项目**
   - 访问 [vercel.com](https://vercel.com)
   - 使用 GitHub 账号登录
   - 点击 "New Project"
   - 选择你 fork 的 `prompt-lesson` 仓库
   - 点击 "Import"

### 方法二：使用 Vercel CLI

1. **安装 Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **登录 Vercel**
   ```bash
   vercel login
   ```

3. **部署项目**
   ```bash
   # 在项目根目录执行
   vercel
   
   # 按照提示完成配置
   # - Set up and deploy? Yes
   # - Which scope? 选择你的账号
   # - Link to existing project? No
   # - What's your project's name? prompt-engineering-demo
   # - In which directory is your code located? ./
   ```

## ⚙️ 环境变量配置

部署时需要配置以下环境变量：

### 1. 在 Vercel Dashboard 中配置

访问你的项目 Dashboard → Settings → Environment Variables，添加：

```bash
# 数据库
DATABASE_URL=file:./dev.db

# AI API Keys (至少配置一个)
OPENAI_API_KEY=your_openai_api_key_here
ANTHROPIC_API_KEY=your_anthropic_api_key_here

# 可选：其他配置
NODE_ENV=production
```

### 2. 使用 Vercel CLI 配置

```bash
# 添加环境变量
vercel env add DATABASE_URL
# 输入: file:./dev.db

vercel env add OPENAI_API_KEY
# 输入你的 OpenAI API Key

vercel env add ANTHROPIC_API_KEY  
# 输入你的 Anthropic API Key
```

## 🗄️ 数据库配置

### SQLite 配置（默认）

项目默认使用 SQLite，适合演示和小规模使用：

1. **确保 DATABASE_URL 正确**
   ```bash
   DATABASE_URL=file:./dev.db
   ```

2. **Vercel 会自动运行数据库迁移**
   - 项目中的 `vercel.json` 已配置好 postinstall 脚本
   - 部署时会自动执行 `prisma generate && prisma db push`

### 升级到 PostgreSQL（推荐生产环境）

如果需要更稳定的数据库，可以使用 Vercel Postgres：

1. **在 Vercel Dashboard 中创建数据库**
   - 项目 Dashboard → Storage → Create Database
   - 选择 "Postgres"
   - 创建完成后会自动添加环境变量

2. **更新 Prisma Schema**
   ```prisma
   // prisma/schema.prisma
   datasource db {
     provider = "postgresql"  // 改为 postgresql
     url      = env("DATABASE_URL")
   }
   ```

3. **重新部署**
   ```bash
   vercel --prod
   ```

## 🔑 获取 AI API Keys

### OpenAI API Key

1. 访问 [OpenAI Platform](https://platform.openai.com/)
2. 注册/登录账号
3. 进入 API Keys 页面
4. 点击 "Create new secret key"
5. 复制生成的 key

### Anthropic API Key

1. 访问 [Anthropic Console](https://console.anthropic.com/)
2. 注册/登录账号
3. 进入 API Keys 页面
4. 点击 "Create Key"
5. 复制生成的 key

## 📋 部署检查清单

部署前请确认：

- [ ] 项目已推送到 GitHub
- [ ] Vercel 账号已创建并连接 GitHub
- [ ] 环境变量已正确配置
- [ ] 至少有一个 AI API Key 可用
- [ ] 数据库配置正确

## 🚨 常见问题

### 1. 部署失败：Build Error

**问题**：构建过程中出现错误
```bash
Error: Cannot find module '@prisma/client'
```

**解决方案**：
```bash
# 本地测试构建
npm run build

# 如果失败，尝试重新生成 Prisma Client
npm run db:generate
npm run build
```

### 2. 部署成功但页面报错

**问题**：页面显示 500 错误或 API 调用失败

**检查项**：
- 环境变量是否正确配置
- API Keys 是否有效
- 数据库连接是否正常

### 3. 数据库连接失败

**问题**：SQLite 文件权限或路径问题

**解决方案**：
```bash
# 方法1：使用内存数据库（临时方案）
DATABASE_URL="file:./dev.db"

# 方法2：升级到 PostgreSQL（推荐）
# 在 Vercel Dashboard 中添加 Postgres 数据库
```

### 4. API 调用限制

**问题**：频繁的 429 错误（请求过多）

**解决方案**：
- 检查 API Key 的使用限制
- 考虑升级 API 套餐
- 实现请求限流机制

## 🔄 持续部署

### 自动部署

Vercel 会自动监听 GitHub 仓库的变化：

- **主分支推送** → 自动部署到生产环境
- **其他分支推送** → 自动创建预览部署

### 手动部署

```bash
# 部署到生产环境
vercel --prod

# 创建预览部署
vercel
```

## 📊 监控和分析

### Vercel Analytics

1. 在项目 Dashboard 中启用 Analytics
2. 查看页面访问量、性能指标等

### 日志查看

```bash
# 查看函数日志
vercel logs

# 实时日志
vercel logs --follow
```

## 🎯 性能优化

### 1. 启用边缘函数

```javascript
// app/api/*/route.ts
export const runtime = 'edge';
```

### 2. 配置缓存

```javascript
// next.config.js
const nextConfig = {
  images: {
    domains: ['localhost'],
  },
  env: {
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY,
  },
  // 添加缓存配置
  headers: async () => [
    {
      source: '/api/:path*',
      headers: [
        {
          key: 'Cache-Control',
          value: 'no-cache, no-store, must-revalidate',
        },
      ],
    },
  ],
}
```

## 📞 支持和帮助

如果遇到问题：

1. 查看 [Vercel 官方文档](https://vercel.com/docs)
2. 检查项目的 GitHub Issues
3. 联系项目维护者

---

部署完成后，你的应用将可以通过 `https://your-project-name.vercel.app` 访问！

## 🎉 部署成功后的下一步

1. **测试功能**：确保所有功能正常工作
2. **配置域名**：在 Vercel Dashboard 中可以绑定自定义域名
3. **设置监控**：启用 Vercel Analytics 监控应用性能
4. **备份数据**：定期备份重要数据
5. **更新维护**：保持依赖包的更新