# 🚀 Prompt Engineering Demo

专业的提示词工程演示工具，面向开发和产品团队，帮助掌握AI时代的核心技能。

## ✨ 功能特性

### 🎯 四种核心Prompt架构
- **零样本提示** - 直接任务提出，适用于标准化场景
- **少样本提示** - 示例引导学习，确保格式统一
- **思维链提示** - 逐步推理过程，解决复杂问题
- **角色扮演** - 专业身份视角，提供专家级分析

### 💼 团队实战场景
- **开发场景**：代码审查、智能调试
- **产品场景**：需求分析、PRD生成

### 🧠 元Prompt工具
- AI辅助生成专业Prompt模板
- 支持多种应用场景定制
- 可下载和重用的模板库

### ⚡ 效果对比
- 直观展示好坏Prompt的差异
- 量化效果提升分析

## 🛠️ 技术栈

- **前端框架**: Next.js 14 (App Router)
- **UI库**: Tailwind CSS + Headless UI
- **动画**: Framer Motion
- **状态管理**: Zustand
- **数据库**: Prisma + SQLite
- **AI集成**: OpenAI GPT-4 / Anthropic Claude
- **部署**: Vercel

## 🚀 快速开始

### 环境要求
- Node.js 18+
- npm 或 yarn

### 安装步骤

1. **克隆项目**
```bash
git clone <项目地址>
cd prompt-engineering-demo
```

2. **安装依赖**
```bash
npm install
```

3. **环境配置**
```bash
cp .env.example .env.local
```

编辑 `.env.local` 文件，配置AI API密钥：
```env
# 至少配置一个AI服务提供商
OPENAI_API_KEY=your_openai_api_key_here
ANTHROPIC_API_KEY=your_anthropic_api_key_here

# 数据库
DATABASE_URL="file:./dev.db"

# 应用配置
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

4. **数据库初始化**
```bash
npm run db:push
npm run db:generate
```

5. **启动开发服务器**
```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看应用。

## 📚 API 接口

### 基础生成接口
```
POST /api/generate
{
  "prompt": "your prompt here",
  "config": {
    "provider": "openai",
    "model": "gpt-4",
    "temperature": 0.7
  }
}
```

### 专业功能接口
- `POST /api/code-review` - 代码审查
- `POST /api/debug` - 错误调试分析  
- `POST /api/generate-prd` - PRD生成
- `POST /api/meta-prompt` - 元Prompt生成

### 模板管理
- `GET /api/templates` - 获取模板列表
- `POST /api/templates` - 创建新模板

## 🏗️ 项目结构

```
prompt-engineering-demo/
├── app/                    # Next.js App Router
│   ├── api/               # API 路由
│   ├── globals.css        # 全局样式
│   ├── layout.tsx         # 根布局
│   └── page.tsx           # 主页面
├── components/            # React 组件
│   ├── ui/               # UI 基础组件
│   ├── PromptDemo.tsx    # Prompt架构演示
│   └── MetaPrompt.tsx    # 元Prompt工具
├── lib/                   # 工具库
│   ├── ai-service.ts     # AI服务集成
│   ├── prisma.ts         # 数据库客户端
│   ├── store.ts          # 状态管理
│   └── utils.ts          # 工具函数
├── prisma/               # 数据库配置
│   └── schema.prisma     # 数据模型
├── types/                # TypeScript 类型定义
└── public/               # 静态资源
```

## 🎨 自定义配置

### AI模型配置
在 `lib/ai-service.ts` 中可以调整：
- 支持的AI提供商
- 默认模型参数
- 错误处理逻辑

### UI主题定制
在 `tailwind.config.js` 中修改：
- 色彩系统
- 字体配置
- 组件样式

### Prompt模板
可以通过API或直接在代码中添加预定义模板。

## 📊 数据库结构

### PromptTemplate 模板表
存储各种Prompt模板和元数据

### PromptSession 会话表
记录用户的Prompt执行历史

### UserFeedback 反馈表
收集用户反馈用于产品改进

## 🚀 部署指南

### Vercel 部署 (推荐)

1. **连接GitHub**
在Vercel控制台导入GitHub仓库

2. **环境变量配置**
在Vercel项目设置中添加：
- `OPENAI_API_KEY`
- `ANTHROPIC_API_KEY`
- `DATABASE_URL` (使用Vercel Postgres或其他数据库服务)

3. **自动部署**
推送代码后自动触发部署

### 自定义部署

1. **构建项目**
```bash
npm run build
```

2. **启动生产服务器**
```bash
npm start
```

## 🧪 测试

```bash
# 类型检查
npm run type-check

# 代码检查
npm run lint

# 数据库管理
npm run db:studio
```

## 📈 性能优化

- 使用Next.js的服务端渲染和静态生成
- 图片和字体优化
- API响应缓存
- 数据库查询优化

## 🔒 安全考虑

- API密钥安全存储
- 输入验证和清理
- 频率限制
- 错误信息处理

## 🤝 贡献指南

1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📝 版本更新

查看 [CHANGELOG.md](./CHANGELOG.md) 了解版本更新详情。

## 📄 许可证

本项目采用 MIT 许可证。详情请查看 [LICENSE](./LICENSE) 文件。

## 🙋‍♂️ 支持

如有问题或建议，请：
- 提交 [GitHub Issue](链接)
- 发送邮件到 support@example.com
- 查看 [文档wiki](链接)

## 🎯 路线图

- [ ] 更多AI模型支持
- [ ] 团队协作功能
- [ ] 模板市场
- [ ] 性能分析面板
- [ ] 多语言支持

---

**让我们一起在AI时代高效协作！** 🚀