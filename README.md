# 🚀 Prompt Engineering Demo

专业的提示词工程演示工具，面向开发和产品团队，帮助掌握AI时代的核心技能。

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)

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
- **AI集成**: OpenAI GPT-4 / Anthropic Claude / DeepSeek
- **部署**: Vercel

## 🚀 快速开始

### 环境要求
- Node.js 18+
- npm 或 yarn

### 安装步骤

1. **克隆项目**
```bash
git clone https://github.com/your-username/prompt-engineering-demo.git
cd prompt-engineering-demo
```

2. **安装依赖**
```bash
npm install
```

3. **环境配置**
```bash
cp .env.example .env
```

编辑 `.env` 文件，配置AI API密钥（至少配置一个）：
```env
# 推荐使用 DeepSeek（性价比高）
OPENAI_API_KEY=your_deepseek_api_key_here
OPENAI_BASE_URL=https://api.deepseek.com

# 或者使用 OpenAI
# OPENAI_API_KEY=your_openai_api_key_here

# 或者使用 Anthropic Claude
# ANTHROPIC_API_KEY=your_anthropic_api_key_here

# 数据库（无需修改）
DATABASE_URL="file:./dev.db"

# 应用配置（无需修改）
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

## 🎮 使用指南

### 首次使用

1. **配置 AI 服务**
   - 点击右上角"API 配置"按钮
   - 推荐使用 DeepSeek（性价比最高）
   - 输入 API Key 并测试连接

2. **体验四种架构**
   - 点击"核心架构"标签
   - 选择不同的Prompt模式
   - 点击"生成示例"查看效果

3. **实战场景演练**
   - 切换到"实战场景"标签
   - 选择"开发场景"或"产品场景"
   - 输入具体内容并执行

4. **生成定制Prompt**
   - 进入"元Prompt"标签
   - 选择应用场景和专业领域
   - AI将自动生成专业模板

5. **查看效果对比**
   - 在"效果对比"中了解好坏Prompt的差异
   - 学习最佳实践

### API Key 获取指南

#### DeepSeek（推荐）
1. 访问 [DeepSeek官网](https://platform.deepseek.com)
2. 注册并登录账户
3. 进入 API Keys 页面
4. 创建新的 API Key
5. 在应用中配置：
   - Base URL: `https://api.deepseek.com`
   - API Key: 你的密钥

#### OpenAI
1. 访问 [OpenAI Platform](https://platform.openai.com)
2. 注册并登录
3. 进入 API Keys 页面
4. 创建新密钥

#### Anthropic Claude
1. 访问 [Anthropic Console](https://console.anthropic.com)
2. 注册并登录
3. 获取 API Key

## 📚 核心功能详解

### Prompt 架构模式

#### 1. 零样本提示 (Zero-shot)
```
直接描述任务，无需示例
适用场景：标准化任务、通用问答
```

#### 2. 少样本提示 (Few-shot)
```
提供2-3个示例来引导AI理解格式
适用场景：特定格式输出、风格模仿
```

#### 3. 思维链提示 (Chain-of-Thought)
```
要求AI展示逐步推理过程
适用场景：复杂问题、逻辑推理
```

#### 4. 角色扮演 (Role-Playing)
```
给AI分配专业身份和背景
适用场景：专业咨询、专家分析
```

### 实战应用场景

#### 开发场景
- **代码审查**: 自动检查代码质量、性能和安全问题
- **智能调试**: 分析错误信息并提供解决方案
- **代码注释**: 生成清晰的代码文档

#### 产品场景
- **需求分析**: 将用户需求转化为功能规格
- **PRD生成**: 自动生成产品需求文档
- **竞品分析**: 分析竞争对手特性

## 🏗️ 项目结构

```
prompt-engineering-demo/
├── app/                    # Next.js App Router
│   ├── api/               # API 路由
│   │   ├── generate/      # 基础生成接口
│   │   ├── generate-stream/ # 流式生成
│   │   ├── code-review/   # 代码审查
│   │   ├── debug/         # 调试分析
│   │   ├── generate-prd/  # PRD生成
│   │   ├── meta-prompt/   # 元Prompt生成
│   │   └── templates/     # 模板管理
│   ├── globals.css        # 全局样式
│   ├── layout.tsx         # 根布局
│   └── page.tsx           # 主页面
├── components/            # React 组件
│   ├── ui/               # UI 基础组件
│   ├── PromptDemo.tsx    # Prompt架构演示
│   ├── MetaPrompt.tsx    # 元Prompt工具
│   ├── APIConfig.tsx     # API配置组件
│   └── MarkdownRenderer.tsx # Markdown渲染
├── lib/                   # 工具库
│   ├── ai-service.ts     # AI服务集成
│   ├── prisma.ts         # 数据库客户端
│   ├── store.ts          # 状态管理
│   └── utils.ts          # 工具函数
├── prisma/               # 数据库配置
│   ├── schema.prisma     # 数据模型
│   ├── dev.db           # SQLite数据库
│   └── seed.js          # 初始数据
├── types/                # TypeScript 类型定义
└── public/               # 静态资源
```

## 📊 API 接口

### 基础生成接口
```typescript
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

### 流式生成接口
```typescript
POST /api/generate-stream
// 支持 Server-Sent Events (SSE)
// 实时返回生成内容
```

### 专业功能接口
- `POST /api/code-review` - 代码审查
- `POST /api/debug` - 错误调试分析  
- `POST /api/generate-prd` - PRD生成
- `POST /api/meta-prompt` - 元Prompt生成

### 模板管理
- `GET /api/templates` - 获取模板列表
- `POST /api/templates` - 创建新模板

## 🎨 自定义配置

### AI模型配置
在应用中可以调整：
- 支持的AI提供商（OpenAI、Anthropic、DeepSeek）
- 模型参数（temperature、max_tokens等）
- 请求超时和重试逻辑

### UI主题定制
在 `tailwind.config.js` 中修改：
- 色彩系统（主色调、辅助色）
- 字体配置（字体族、大小）
- 组件样式（圆角、阴影等）

### Prompt模板
- 通过元Prompt工具生成新模板
- 在组件中添加预定义模板
- 支持导入/导出模板配置

## 🚀 部署指南

### Vercel 部署 (推荐)

1. **连接GitHub**
   - Fork 本项目到你的 GitHub 账户
   - 在 Vercel 控制台导入项目

2. **环境变量配置**
   在 Vercel 项目设置中添加环境变量：
   ```env
   OPENAI_API_KEY=your_api_key_here
   OPENAI_BASE_URL=https://api.deepseek.com
   DATABASE_URL=file:./dev.db
   NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
   ```

3. **自动部署**
   - 推送代码后自动触发部署
   - 支持预览分支和生产分支

### 自定义部署

1. **构建项目**
```bash
npm run build
```

2. **启动生产服务器**
```bash
npm start
```

3. **使用 PM2 部署**
```bash
npm install -g pm2
pm2 start npm --name "prompt-demo" -- start
```

## 🧪 开发与测试

### 开发模式
```bash
# 启动开发服务器
npm run dev

# 类型检查
npm run type-check

# 代码检查
npm run lint

# 数据库管理界面
npm run db:studio
```

### 构建验证
```bash
# 构建项目
npm run build

# 启动生产模式
npm start
```

### 数据库操作
```bash
# 推送数据库结构变更
npm run db:push

# 生成Prisma客户端
npm run db:generate

# 打开数据库管理界面
npm run db:studio
```

## 📈 性能优化

- ✅ 使用 Next.js 14 App Router 优化路由性能
- ✅ 实现流式生成减少等待时间
- ✅ 组件懒加载和代码分割
- ✅ 图片和字体优化
- ✅ API 响应缓存
- ✅ 数据库查询优化

## 🔒 安全考虑

- ✅ API 密钥安全存储（环境变量）
- ✅ 输入验证和清理
- ✅ 错误信息安全处理
- ✅ CORS 配置
- ✅ SQL 注入防护（使用 Prisma ORM）

## 🐛 常见问题

### Q: API Key 配置后仍显示未配置？
A: 请确保重启开发服务器，并检查环境变量格式是否正确。

### Q: 生成内容为空或报错？
A: 检查网络连接和 API Key 余额，确保选择的模型可用。

### Q: 数据库连接失败？
A: 运行 `npm run db:push` 重新初始化数据库。

### Q: 构建失败？
A: 确保安装了所有依赖，运行 `npm install` 后重新构建。

### Q: DeepSeek API 如何配置？
A: 在 API 配置中设置：
- Base URL: `https://api.deepseek.com`
- API Key: 你的 DeepSeek 密钥

## 🤝 贡献指南

1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

### 贡献类型
- 🐛 Bug 修复
- ✨ 新功能
- 📚 文档改进
- 🎨 UI/UX 优化
- ⚡ 性能优化

## 📝 版本更新

### v1.0.0 (当前版本)
- ✅ 四种核心 Prompt 架构
- ✅ 开发和产品实战场景
- ✅ 元 Prompt 生成工具
- ✅ 效果对比分析
- ✅ 多 AI 服务支持
- ✅ 流式生成体验

查看完整更新日志：[CHANGELOG.md](./CHANGELOG.md)

## 📄 许可证

本项目采用 MIT 许可证。详情请查看 [LICENSE](./LICENSE) 文件。

## 🙋‍♂️ 支持与反馈

如有问题或建议，请：
- 🐛 提交 [GitHub Issue](https://github.com/your-username/prompt-engineering-demo/issues)
- 💬 加入讨论区交流
- ⭐ 给项目点个 Star 支持我们

## 🎯 开发路线图

### 近期计划 (v1.1)
- [ ] 更多 AI 模型支持 (Claude-3.5, GPT-4o)
- [ ] Prompt 模板库和分享功能
- [ ] 团队协作功能（多用户支持）
- [ ] 性能分析面板

### 中期计划 (v1.2)
- [ ] 多语言支持 (English, 日本語)
- [ ] 移动端适配优化
- [ ] API 使用统计和分析
- [ ] 更多实战场景模板

### 长期计划 (v2.0)
- [ ] 插件系统和扩展市场
- [ ] AI 训练数据管理
- [ ] 企业级部署方案
- [ ] 高级分析和洞察功能

---

**让我们一起在AI时代高效协作！** 🚀