'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, Button, Tabs, CodeBlock } from '@/components/ui';
import { useAppStore } from '@/lib/store';
import { 
  Target, 
  FileText, 
  GitBranch, 
  Users,
  Lightbulb,
  Code,
  Bug,
  FileCheck
} from 'lucide-react';

const architectures = [
  {
    id: 'zero-shot',
    name: '零样本提示',
    icon: <Target className="w-5 h-5" />,
    description: '直接提出问题或任务，适用于明确、标准化的场景',
    example: '请解释什么是RESTful API的核心原则',
    template: '请详细解释[具体概念或技术]的核心要点和最佳实践。',
    useCases: ['技术概念解释', '标准化问题回答', '基础知识查询'],
    bestPractices: '确保问题明确、避免歧义、使用专业术语'
  },
  {
    id: 'few-shot',
    name: '少样本提示',
    icon: <FileText className="w-5 h-5" />,
    description: '提供示例帮助AI理解期望的格式和风格',
    example: `示例1: function add(a, b) → 返回两个数的和
示例2: function multiply(a, b) → 返回两个数的乘积

现在请为: function divide(a, b) 写注释`,
    template: `示例1: [输入1] → [期望输出1]
示例2: [输入2] → [期望输出2]

现在请为: [新输入] 提供相同格式的输出`,
    useCases: ['格式化输出', '风格统一', '模式识别'],
    bestPractices: '提供2-5个高质量示例，覆盖边缘情况'
  },
  {
    id: 'chain-of-thought',
    name: '思维链提示',
    icon: <GitBranch className="w-5 h-5" />,
    description: '引导AI逐步推理，适用于复杂的逻辑分析',
    example: `请逐步分析这个性能问题：
1. 首先识别瓶颈点
2. 然后分析根本原因
3. 最后提出优化方案`,
    template: `请逐步分析[问题描述]：
1. 首先[分析步骤1]
2. 然后[分析步骤2]
3. 最后[分析步骤3]`,
    useCases: ['复杂问题分析', '逐步推理', '决策制定'],
    bestPractices: '明确每个步骤的目标，保持逻辑连贯性'
  },
  {
    id: 'role-playing',
    name: '角色扮演',
    icon: <Users className="w-5 h-5" />,
    description: '设定特定身份和专业视角进行分析',
    example: `作为资深产品经理，请分析这个用户需求的优先级和实现难度`,
    template: `作为[专业角色]，请从[视角]角度分析[具体问题]`,
    useCases: ['专业分析', '多角度思考', '专家建议'],
    bestPractices: '选择合适的角色，提供背景信息'
  },
  {
    id: 'self-consistency',
    name: '自我一致性',
    icon: <GitBranch className="w-5 h-5" />,
    description: '生成多个推理路径，选择最一致的答案',
    example: `问题：如果A比B高，B比C高，那么A和C的关系是什么？

让我用不同方法推理：
方法1：传递性原理 A>B, B>C → A>C
方法2：数值假设 A=180, B=170, C=160 → A>C
方法3：逻辑推理 A高于B且B高于C → A必然高于C

结论：A比C高（所有方法一致）`,
    template: `问题：[需要验证的问题]

请用至少3种不同方法推理，并得出一致结论`,
    useCases: ['验证答案', '提高准确性', '减少错误'],
    bestPractices: '使用多个独立推理路径，验证一致性'
  },
  {
    id: 'knowledge-generation',
    name: '知识生成',
    icon: <Lightbulb className="w-5 h-5" />,
    description: '先生成相关知识，再基于知识回答问题',
    example: `步骤1：列出关于"微服务架构"的关键知识点
步骤2：基于这些知识，解释为什么微服务适合大型团队`,
    template: `步骤1：生成关于[主题]的背景知识
步骤2：基于生成的知识，回答[具体问题]`,
    useCases: ['知识密集型任务', '专业问题', '深度分析'],
    bestPractices: '确保生成的知识准确且相关'
  },
  {
    id: 'prompt-chaining',
    name: '提示链',
    icon: <GitBranch className="w-5 h-5" />,
    description: '将复杂任务分解为多个子任务串联执行',
    example: `任务链：创建产品营销方案
1. 市场调研 → 竞品分析报告
2. 目标定位 → 用户画像
3. 策略制定 → 营销策略
4. 内容创作 → 营销文案`,
    template: `复杂任务：[总体目标]
子任务1：[任务1] → [输出1]
子任务2：基于[输出1]，[任务2] → [输出2]
子任务3：基于[输出2]，[任务3] → 最终结果`,
    useCases: ['复杂项目', '多步骤流程', '系统设计'],
    bestPractices: '明确子任务间的依赖关系'
  },
  {
    id: 'react',
    name: 'ReAct框架',
    icon: <GitBranch className="w-5 h-5" />,
    description: '结合推理(Reasoning)和行动(Acting)的迭代框架',
    example: `任务：调试性能问题

Thought 1: 需要确定性能瓶颈
Action 1: 运行性能分析工具
Observation 1: 数据库查询占80%时间

Thought 2: 数据库是主要问题
Action 2: 检查慢查询
Observation 2: 发现缺少索引

Thought 3: 添加索引优化
Action 3: 创建索引
Observation 3: 查询时间减少90%`,
    template: `任务：[目标]

重复以下循环直到完成：
Thought: [当前思考]
Action: [采取行动]
Observation: [观察结果]`,
    useCases: ['问题诊断', '迭代优化', '探索性任务'],
    bestPractices: '清晰记录每个步骤的思考和观察'
  }
];

interface PromptArchitectureProps {
  onGenerate: (prompt: string, architecture: string) => void;
  loading: boolean;
}

export function PromptArchitecture({ onGenerate, loading }: PromptArchitectureProps) {
  const { activeTab, setActiveTab } = useAppStore();
  const [customPrompt, setCustomPrompt] = useState('');

  const currentArchitecture = architectures.find(arch => arch.id === activeTab);

  const handleGenerate = () => {
    if (!customPrompt.trim()) return;
    onGenerate(customPrompt, activeTab);
  };

  const loadExample = () => {
    if (currentArchitecture) {
      setCustomPrompt(currentArchitecture.example);
    }
  };

  return (
    <Card className="w-full">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-neutral-950 mb-2 flex items-center gap-2">
          <Lightbulb className="w-6 h-6 text-orange-600" />
          八种核心 Prompt 架构
        </h2>
        <p className="text-neutral-600">掌握从基础到高级的提示工程技术，让AI更好地理解你的需求</p>
      </div>

      <Tabs
        tabs={architectures.map(arch => ({
          id: arch.id,
          label: arch.name,
          icon: arch.icon
        }))}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      <AnimatePresence mode="wait">
        {currentArchitecture && (
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="mt-6"
          >
            {/* 架构介绍 */}
            <div className="mb-6 p-4 bg-orange-50 rounded-lg border border-orange-200">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  {currentArchitecture.icon}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-orange-900 mb-2">
                    {currentArchitecture.name}
                  </h3>
                  <p className="text-orange-700 text-sm mb-3">
                    {currentArchitecture.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {currentArchitecture.useCases.map((useCase, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-orange-200 text-orange-800 text-xs rounded-full"
                      >
                        {useCase}
                      </span>
                    ))}
                  </div>
                  {currentArchitecture.bestPractices && (
                    <div className="mt-3 p-2 bg-orange-100 rounded-md">
                      <p className="text-xs text-orange-800">
                        <span className="font-semibold">💡 最佳实践：</span>
                        {currentArchitecture.bestPractices}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* 示例展示 */}
            <div className="mb-6">
              <h4 className="font-semibold text-neutral-900 mb-3">📝 示例模板</h4>
              <CodeBlock code={currentArchitecture.template} copyable />
            </div>

            {/* 实际案例 */}
            <div className="mb-6">
              <h4 className="font-semibold text-neutral-900 mb-3">🎯 实际案例</h4>
              <CodeBlock code={currentArchitecture.example} copyable />
            </div>

            {/* 自定义输入 */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-neutral-900">✍️ 自定义 Prompt</h4>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={loadExample}
                  icon={<FileText className="w-4 h-4" />}
                >
                  加载示例
                </Button>
              </div>
              <textarea
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                placeholder={`在这里输入你的${currentArchitecture.name}提示词...`}
                className="w-full h-32 p-4 border-2 border-neutral-300 rounded-lg font-mono text-sm resize-none focus:border-orange-500 focus:outline-none transition-colors"
              />
            </div>

            {/* 操作按钮 */}
            <div className="flex gap-3">
              <Button
                onClick={handleGenerate}
                disabled={!customPrompt.trim() || loading}
                loading={loading}
                className="flex-1"
                icon={!loading ? <Target className="w-4 h-4" /> : undefined}
              >
                {loading ? '生成中...' : '执行提示'}
              </Button>
              <Button
                variant="secondary"
                onClick={() => setCustomPrompt('')}
                disabled={!customPrompt.trim()}
              >
                清空
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}

// 应用场景组件
const scenarios = [
  {
    id: 'code-review',
    name: '代码审查',
    category: 'development' as const,
    icon: <Code className="w-5 h-5" />,
    description: '自动化代码质量检查和改进建议',
    template: `作为资深代码审查专家，请检查以下代码的：
- 性能问题
- 安全隐患
- 可维护性
- 最佳实践符合度

[在此粘贴要审查的代码]`,
  },
  {
    id: 'debug-analysis',
    name: '调试分析',
    category: 'development' as const,
    icon: <Bug className="w-5 h-5" />,
    description: '智能错误分析和解决方案推荐',
    template: `作为调试专家，请分析以下错误：
1. 错误类型和可能原因
2. 修复建议和步骤
3. 预防类似问题的最佳实践

错误信息：[具体错误信息]
相关代码：[相关代码片段]`,
  },
  {
    id: 'prd-generation',
    name: 'PRD生成',
    category: 'product' as const,
    icon: <FileCheck className="w-5 h-5" />,
    description: '基于需求自动生成产品需求文档',
    template: `作为产品经理，基于以下需求生成完整PRD：

核心需求：[核心功能需求]
用户场景：[目标用户和使用场景]
约束条件：[技术和业务约束]

请包含：功能规格、技术要求、验收标准`,
  },
  {
    id: 'requirement-analysis',
    name: '需求分析',
    category: 'product' as const,
    icon: <FileText className="w-5 h-5" />,
    description: '用户反馈的结构化需求分析',
    template: `作为产品经理，基于用户反馈分析需求：

用户反馈：[具体反馈内容]

输出：
- 核心需求提取
- 优先级评估 (P0/P1/P2)
- 实现建议和资源评估
- 潜在风险和依赖`,
  }
];

interface ApplicationScenariosProps {
  onExecute: (scenario: any, prompt: string) => void;
  loading: boolean;
}

export function ApplicationScenarios({ onExecute, loading }: ApplicationScenariosProps) {
  const [activeScenario, setActiveScenario] = useState(scenarios[0]);
  const [customInput, setCustomInput] = useState('');

  const handleExecute = () => {
    if (!customInput.trim()) return;
    onExecute(activeScenario, customInput);
  };

  const developmentScenarios = scenarios.filter(s => s.category === 'development');
  const productScenarios = scenarios.filter(s => s.category === 'product');

  return (
    <Card className="w-full">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-neutral-950 mb-2 flex items-center gap-2">
          <Users className="w-6 h-6 text-orange-600" />
          团队实战场景
        </h2>
        <p className="text-neutral-600">针对开发和产品团队的实际工作场景</p>
      </div>

      {/* 场景分类 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <h3 className="font-semibold text-neutral-900 mb-3 flex items-center gap-2">
            <Code className="w-4 h-4" />
            开发场景
          </h3>
          <div className="space-y-2">
            {developmentScenarios.map((scenario) => (
              <button
                key={scenario.id}
                onClick={() => {
                  setActiveScenario(scenario);
                  setCustomInput(scenario.template);
                }}
                className={`w-full p-3 rounded-lg text-left transition-all ${
                  activeScenario.id === scenario.id
                    ? 'bg-orange-100 border-orange-500 border'
                    : 'bg-neutral-100 hover:bg-neutral-200 border border-neutral-200'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  {scenario.icon}
                  <span className="font-medium">{scenario.name}</span>
                </div>
                <p className="text-sm text-neutral-600">{scenario.description}</p>
              </button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-neutral-900 mb-3 flex items-center gap-2">
            <FileCheck className="w-4 h-4" />
            产品场景
          </h3>
          <div className="space-y-2">
            {productScenarios.map((scenario) => (
              <button
                key={scenario.id}
                onClick={() => {
                  setActiveScenario(scenario);
                  setCustomInput(scenario.template);
                }}
                className={`w-full p-3 rounded-lg text-left transition-all ${
                  activeScenario.id === scenario.id
                    ? 'bg-orange-100 border-orange-500 border'
                    : 'bg-neutral-100 hover:bg-neutral-200 border border-neutral-200'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  {scenario.icon}
                  <span className="font-medium">{scenario.name}</span>
                </div>
                <p className="text-sm text-neutral-600">{scenario.description}</p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 选中场景的详细信息 */}
      <motion.div
        key={activeScenario.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center gap-2 mb-2">
            {activeScenario.icon}
            <h3 className="font-semibold text-blue-900">{activeScenario.name}</h3>
          </div>
          <p className="text-blue-700 text-sm">{activeScenario.description}</p>
        </div>

        <div className="mb-4">
          <label className="block font-semibold text-neutral-900 mb-2">
            📝 输入内容 (可以修改模板)
          </label>
          <textarea
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            className="w-full h-40 p-4 border-2 border-neutral-300 rounded-lg font-mono text-sm resize-none focus:border-orange-500 focus:outline-none transition-colors"
            placeholder="在这里输入具体内容..."
          />
        </div>

        <div className="flex gap-3">
          <Button
            onClick={handleExecute}
            disabled={!customInput.trim() || loading}
            loading={loading}
            className="flex-1"
            icon={!loading ? activeScenario.icon : undefined}
          >
            {loading ? '处理中...' : `执行${activeScenario.name}`}
          </Button>
          <Button
            variant="secondary"
            onClick={() => setCustomInput(activeScenario.template)}
          >
            重置模板
          </Button>
        </div>
      </motion.div>
    </Card>
  );
}