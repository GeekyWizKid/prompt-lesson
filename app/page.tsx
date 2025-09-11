'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { toast, Toaster } from 'react-hot-toast';
import { 
  PromptArchitecture, 
  ApplicationScenarios 
} from '@/components/PromptDemo';
import { 
  MetaPromptGenerator, 
  EffectComparison 
} from '@/components/MetaPrompt';
import { APIConfigButton } from '@/components/APIConfig';
import { Card, Button, Badge, LoadingSpinner } from '@/components/ui';
import { MarkdownRenderer } from '@/components/MarkdownRenderer';
import { useAppStore } from '@/lib/store';
import { useInitializeConfig } from '@/lib/hooks';
import { 
  Rocket, 
  Target, 
  Users, 
  Sparkles, 
  BarChart3,
  Github,
  ExternalLink,
  Lightbulb,
  Code,
  FileText,
  GitBranch,
  Zap,
  Twitter
} from 'lucide-react';

export default function HomePage() {
  const [currentResult, setCurrentResult] = useState<string>('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamTrigger, setStreamTrigger] = useState<{prompt: string; config: any} | null>(null);
  const [activeSection, setActiveSection] = useState<string>('architecture');
  const { loading, setLoading, setError, aiConfig } = useAppStore();
  
  // 初始化配置
  useInitializeConfig();

  // API调用函数
  const callAPI = async (endpoint: string, data: any) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || '请求失败');
      }
      
      return result.data;
    } catch (error) {
      const message = error instanceof Error ? error.message : '未知错误';
      setError(message);
      toast.error(message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // 启动流式生成
  const startStreamGeneration = async (prompt: string, config: any) => {
    setCurrentResult('');
    setIsStreaming(true);
    
    try {
      const response = await fetch('/api/generate-stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, config }),
      });

      if (!response.body) {
        throw new Error('No response body');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let accumulatedContent = '';

      while (true) {
        const { done, value } = await reader.read();
        
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        
        // 保留最后一行（可能不完整）
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              
              if (data.type === 'chunk') {
                accumulatedContent += data.chunk;
                setCurrentResult(accumulatedContent);
              } else if (data.type === 'end') {
                setIsStreaming(false);
                toast.success('生成完成！');
                return; // 立即退出，避免继续处理
              } else if (data.type === 'error') {
                setIsStreaming(false);
                toast.error(`生成失败: ${data.error}`);
                return; // 立即退出，避免继续处理
              }
            } catch (e) {
              console.error('Failed to parse SSE data:', e);
            }
          }
        }
      }
    } catch (err) {
      setIsStreaming(false);
      toast.error(err instanceof Error ? err.message : '流式生成失败');
    }
  };

  // 处理Prompt架构演示
  const handlePromptGenerate = async (prompt: string, architecture: string) => {
    try {
      await startStreamGeneration(prompt, aiConfig);
      toast.success('开始生成...');
    } catch (error) {
      console.error('生成失败:', error);
    }
  };

  // 处理应用场景执行
  const handleScenarioExecute = async (scenario: any, prompt: string) => {
    try {
      await startStreamGeneration(prompt, aiConfig);
      toast.success(`开始${scenario.name}...`);
    } catch (error) {
      console.error('执行失败:', error);
    }
  };

  // 处理元Prompt生成
  const handleMetaPromptGenerate = async (scenario: string, domain: string) => {
    try {
      const metaPromptTemplate = `作为Prompt工程专家，请为"${scenario}"场景在"${domain}"领域设计一个高效的Prompt模板。

要求：
1. 明确角色定位和专业身份
2. 结构化输入格式
3. 具体输出要求
4. 质量检验标准
5. 包含实际应用示例

请按照以下格式输出：

**场景**: ${scenario}
**领域**: ${domain}

**专用Prompt模板:**
[详细的Prompt模板内容]

**使用说明:**
[如何使用此模板的具体指导]

**预期效果:**
[使用此模板能达到的效果和价值]`;

      await startStreamGeneration(metaPromptTemplate, aiConfig);
      toast.success('开始生成元Prompt...');
    } catch (error) {
      console.error('生成失败:', error);
    }
  };

  // 处理效果对比
  const handleShowComparison = () => {
    const comparisonResult = `
# 🎯 Prompt效果对比分析

## 📊 实际案例对比

### 案例1：代码审查

**❌ 模糊提示：**
\`\`\`
"检查这段代码"
\`\`\`

**AI响应：** 
"代码看起来没问题。"

**✅ 精确提示：**
\`\`\`
作为资深代码审查专家，请检查以下Python代码的：
1. 性能问题（时间/空间复杂度）
2. 安全隐患（SQL注入、XSS等）
3. 代码规范（PEP8、命名规范）
4. 潜在bug和边界情况
5. 改进建议和最佳实践

代码：[具体代码]
\`\`\`

**AI响应：** 
详细的多维度分析报告，包含具体问题定位、修复建议和优化方案。

---

### 案例2：需求文档生成

**❌ 模糊提示：**
\`\`\`
"写个登录功能的文档"
\`\`\`

**✅ 精确提示：**
\`\`\`
作为产品经理，为移动端App生成登录功能的PRD文档：

背景：电商平台，目标用户18-35岁
需求：支持手机号、邮箱、第三方登录

请包含：
1. 功能概述和价值主张
2. 用户故事和使用场景
3. 功能流程图（文字描述）
4. 字段定义和验证规则
5. 异常处理和错误提示
6. 性能要求（响应时间<2s）
7. 安全要求（密码加密、防暴力破解）
\`\`\`

---

## 📈 量化效果分析

| 维度 | 模糊提示 | 精确提示 | 提升幅度 |
|------|---------|---------|----------|
| **完整性** | 20% | 95% | **+375%** |
| **准确性** | 40% | 90% | **+125%** |
| **可用性** | 30% | 85% | **+183%** |
| **效率** | 需3-5轮迭代 | 1轮完成 | **5倍提升** |
| **一致性** | 低 | 高 | **显著提升** |

---

## 🔍 核心差异分析

### 模糊提示的问题根源：
1. **认知负担转移** - AI需要猜测用户意图
2. **上下文缺失** - 无法理解具体场景和约束
3. **标准不明** - 不知道什么是"好"的输出
4. **格式随意** - 输出结构不可预测

### 精确提示的设计原理：
1. **角色定位** - 激活特定领域的专业知识
2. **结构化输入** - 清晰的任务分解和要求
3. **示例引导** - 提供期望输出的参考模板
4. **约束条件** - 明确边界和限制条件

---

## 💡 最佳实践指南

### 1. CRISP框架
- **C**ontext（上下文）：提供背景信息
- **R**ole（角色）：明确AI身份
- **I**nstruction（指令）：清晰的任务描述
- **S**tructure（结构）：指定输出格式
- **P**arameters（参数）：设置约束条件

### 2. 提示优化检查清单
- [ ] 是否明确了AI的角色？
- [ ] 是否提供了充分的上下文？
- [ ] 任务描述是否具体可执行？
- [ ] 是否指定了输出格式？
- [ ] 是否包含质量标准？
- [ ] 是否有示例参考？

### 3. 团队协作建议
- 建立组织级Prompt模板库
- 定期评审和优化提示效果
- 分享最佳实践和失败案例
- 建立提示版本管理机制

---

## 🚀 实际价值

使用精确提示可以带来：
- **开发效率提升 70%** - 减少重复沟通
- **文档质量提升 80%** - 结构化和完整性
- **团队协作改善 60%** - 统一标准和格式
- **成本降低 50%** - 减少API调用次数

记住：**好的Prompt是AI时代的核心生产力！**
    `;
    
    setCurrentResult(comparisonResult);
    toast.success('对比分析完成！');
  };

  const sections = [
    {
      id: 'architecture',
      name: '核心架构',
      icon: <Target className="w-4 h-4" />,
      description: '八种Prompt设计模式'
    },
    {
      id: 'scenarios',
      name: '实战场景',
      icon: <Users className="w-4 h-4" />,
      description: '开发和产品应用'
    },
    {
      id: 'meta-prompt',
      name: '元Prompt',
      icon: <Sparkles className="w-4 h-4" />,
      description: 'AI辅助生成模板'
    },
    {
      id: 'comparison',
      name: '效果对比',
      icon: <BarChart3 className="w-4 h-4" />,
      description: '好坏提示对比'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-orange-50">
      <Toaster position="top-right" />
      
      {/* 顶部导航 */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-sm border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Rocket className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-neutral-900">Prompt 工程实战</h1>
                <p className="text-sm text-neutral-600">专业提示词演示工具</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <Badge variant="success">
                <Lightbulb className="w-3 h-3 mr-1" />
                v1.0
              </Badge>
              <APIConfigButton />
              <Button
                variant="outline"
                size="sm"
                icon={<Twitter className="w-4 h-4" />}
                onClick={() => window.open('https://x.com/named_Das', '_blank')}
              >
                Twitter
              </Button>
              <Button
                variant="outline"
                size="sm"
                icon={<Github className="w-4 h-4" />}
                onClick={() => window.open('https://github.com/GeekyWizKid/prompt-lesson', '_blank')}
              >
                GitHub
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* 主要内容 */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* 头部介绍 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-100 text-orange-700 rounded-full text-sm font-medium mb-4">
            <Zap className="w-4 h-4" />
            基于开发和产品团队实际应用场景
          </div>
          <h2 className="text-4xl font-bold text-neutral-900 mb-4">
            掌握 <span className="text-orange-600">AI时代</span> 的核心技能
          </h2>
          <p className="text-xl text-neutral-600 max-w-3xl mx-auto mb-8">
            通过八种核心架构、实战应用场景和元Prompt工具，让你的团队在AI时代高效协作
          </p>
          
          {/* 核心指标 */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {[
              { number: '50+', label: '提示技术', icon: <Target className="w-5 h-5" /> },
              { number: '8大', label: '核心架构', icon: <GitBranch className="w-5 h-5" /> },
              { number: '10x', label: '效率提升', icon: <BarChart3 className="w-5 h-5" /> },
              { number: '4个', label: '应用场景', icon: <Users className="w-5 h-5" /> }
            ].map((metric, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-center p-4 bg-white rounded-xl shadow-soft border border-neutral-200"
              >
                <div className="flex justify-center mb-2 text-orange-600">
                  {metric.icon}
                </div>
                <div className="text-2xl font-bold text-orange-600 mb-1">
                  {metric.number}
                </div>
                <div className="text-sm text-neutral-600">{metric.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* 功能导航 */}
        <div className="mb-8">
          <div className="flex flex-wrap justify-center gap-4">
            {sections.map((section) => (
              <Button
                key={section.id}
                variant={activeSection === section.id ? 'primary' : 'secondary'}
                onClick={() => setActiveSection(section.id)}
                icon={section.icon}
                className="flex-col h-auto p-4 min-w-[120px]"
              >
                <span className="font-semibold">{section.name}</span>
                <span className="text-xs opacity-75 mt-1">{section.description}</span>
              </Button>
            ))}
          </div>
        </div>

        {/* 内容区域 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 主要演示区域 */}
          <div className="lg:col-span-2">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              {activeSection === 'architecture' && (
                <PromptArchitecture 
                  onGenerate={handlePromptGenerate}
                  loading={loading}
                />
              )}
              
              {activeSection === 'scenarios' && (
                <ApplicationScenarios
                  onExecute={handleScenarioExecute}
                  loading={loading}
                />
              )}
              
              {activeSection === 'meta-prompt' && (
                <MetaPromptGenerator
                  onGenerate={handleMetaPromptGenerate}
                  loading={loading}
                  result={currentResult}
                />
              )}
              
              {activeSection === 'comparison' && (
                <EffectComparison
                  onShowComparison={handleShowComparison}
                  result={currentResult}
                />
              )}
            </motion.div>
          </div>

          {/* 侧边栏 - 结果显示 */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-neutral-900 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-orange-600" />
                    AI 响应结果
                  </h3>
                  <div className="flex items-center gap-1">
                    <div className={`w-2 h-2 rounded-full ${aiConfig.apiKey ? 'bg-green-500' : 'bg-red-500'}`} />
                    <span className="text-xs text-neutral-500">
                      {aiConfig.apiKey ? '已配置' : '未配置'}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-neutral-600">
                  执行Prompt后的AI生成内容将显示在这里
                </p>
                {!aiConfig.apiKey && (
                  <div className="mt-2 p-2 bg-yellow-50 rounded-lg border border-yellow-200">
                    <p className="text-xs text-yellow-700">
                      💡 点击右上角"API 配置"按钮配置 DeepSeek 或其他 AI 服务
                    </p>
                  </div>
                )}
              </div>

              <div className="min-h-[400px] max-h-[600px] overflow-y-auto">
                {isStreaming ? (
                  // 显示流式生成的内容
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-orange-600 text-sm font-medium">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        className="w-3 h-3 border-2 border-orange-500 border-t-transparent rounded-full"
                      />
                      流式生成中...
                    </div>
                    <MarkdownRenderer
                      content={currentResult}
                      streaming={true}
                      className="prose prose-sm max-w-none"
                    />
                  </div>
                ) : loading ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <LoadingSpinner size="lg" />
                    <p className="text-neutral-600 mt-4">AI正在思考中...</p>
                  </div>
                ) : currentResult ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-green-600 font-medium">✅ 生成完成</span>
                      <span className="text-xs text-neutral-500">
                        {Math.round(currentResult.length / 4)} tokens
                      </span>
                    </div>
                    <MarkdownRenderer
                      content={currentResult}
                      className="prose prose-sm max-w-none"
                    />
                  </motion.div>
                ) : (
                  <div className="text-center py-12 text-neutral-500">
                    <Code className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>选择左侧功能开始体验</p>
                    <p className="text-sm mt-2">AI生成的内容将在这里显示</p>
                  </div>
                )}
              </div>

              {currentResult && !loading && (
                <div className="mt-4 pt-4 border-t border-neutral-200">
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => navigator.clipboard.writeText(currentResult)}
                      className="flex-1"
                    >
                      复制结果
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setCurrentResult('')}
                    >
                      清空
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          </div>
        </div>

        {/* 底部提示 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-16 p-6 bg-gradient-to-r from-neutral-900 to-neutral-800 rounded-xl text-white"
        >
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-2 flex items-center justify-center gap-2">
              <Lightbulb className="w-5 h-5" />
              Prompt 设计最佳实践
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">
              {[
                {
                  title: '🎭 角色定位',
                  desc: '明确AI扮演的专家角色'
                },
                {
                  title: '📋 结构化输出',
                  desc: '指定返回格式和结构'
                },
                {
                  title: '🎯 具体场景',
                  desc: '提供充分的上下文信息'
                },
                {
                  title: '🔄 迭代优化',
                  desc: '根据效果不断改进模板'
                }
              ].map((tip, index) => (
                <div key={index} className="text-left">
                  <div className="font-semibold text-orange-300 mb-2">{tip.title}</div>
                  <div className="text-sm text-neutral-300">{tip.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}