'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, Button, CodeBlock } from '@/components/ui';
import { Sparkles, RefreshCw, Download } from 'lucide-react';

const metaScenarios = [
  { value: 'code-review', label: '代码审查', domain: '软件开发' },
  { value: 'bug-analysis', label: '错误分析', domain: '软件调试' },
  { value: 'requirement-analysis', label: '需求分析', domain: '产品管理' },
  { value: 'prd-review', label: 'PRD评审', domain: '产品文档' },
  { value: 'api-design', label: 'API设计', domain: '系统架构' },
  { value: 'user-research', label: '用户研究', domain: '产品调研' },
  { value: 'data-analysis', label: '数据分析', domain: '业务分析' },
  { value: 'testing-strategy', label: '测试策略', domain: '质量保证' },
];

interface MetaPromptGeneratorProps {
  onGenerate: (scenario: string, domain: string) => void;
  loading: boolean;
  result?: string;
}

export function MetaPromptGenerator({ onGenerate, loading, result }: MetaPromptGeneratorProps) {
  const [selectedScenario, setSelectedScenario] = useState(metaScenarios[0]);
  const [customDomain, setCustomDomain] = useState('');

  const handleGenerate = () => {
    const domain = customDomain.trim() || selectedScenario.domain;
    onGenerate(selectedScenario.value, domain);
  };

  const downloadPrompt = () => {
    if (!result) return;
    
    const blob = new Blob([result], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `meta-prompt-${selectedScenario.value}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Card className="w-full">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-neutral-950 mb-2 flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-orange-600" />
          元 Prompt 工具
        </h2>
        <p className="text-neutral-600">让AI成为你的Prompt工程师，自动生成专业模板</p>
      </div>

      {/* 场景选择 */}
      <div className="mb-6">
        <label className="block font-semibold text-neutral-900 mb-3">🎯 选择应用场景</label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {metaScenarios.map((scenario) => (
            <button
              key={scenario.value}
              onClick={() => setSelectedScenario(scenario)}
              className={`p-3 rounded-lg text-sm font-medium transition-all ${
                selectedScenario.value === scenario.value
                  ? 'bg-orange-100 text-orange-900 border-orange-500 border'
                  : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200 border border-neutral-200'
              }`}
            >
              {scenario.label}
            </button>
          ))}
        </div>
      </div>

      {/* 领域定制 */}
      <div className="mb-6">
        <label className="block font-semibold text-neutral-900 mb-2">🏷️ 专业领域 (可选)</label>
        <input
          type="text"
          value={customDomain}
          onChange={(e) => setCustomDomain(e.target.value)}
          placeholder={`默认：${selectedScenario.domain}`}
          className="w-full p-3 border-2 border-neutral-300 rounded-lg focus:border-orange-500 focus:outline-none transition-colors"
        />
        <p className="text-sm text-neutral-500 mt-1">
          可以指定特定的技术栈或业务领域，如 "React开发"、"金融产品"等
        </p>
      </div>

      {/* 生成按钮 */}
      <div className="mb-6">
        <Button
          onClick={handleGenerate}
          loading={loading}
          disabled={loading}
          className="w-full"
          icon={!loading ? <Sparkles className="w-4 h-4" /> : undefined}
        >
          {loading ? '生成中...' : `为 "${selectedScenario.label}" 生成专用Prompt`}
        </Button>
      </div>

      {/* 生成结果 */}
      {result && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-4"
        >
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-neutral-900">✨ 生成的专用Prompt</h3>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={downloadPrompt}
                icon={<Download className="w-4 h-4" />}
              >
                下载
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleGenerate}
                icon={<RefreshCw className="w-4 h-4" />}
              >
                重新生成
              </Button>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-lg border border-orange-200">
            <div className="prose prose-sm max-w-none">
              <pre className="whitespace-pre-wrap font-sans text-neutral-800 leading-relaxed">
                {result}
              </pre>
            </div>
          </div>

          {/* 使用提示 */}
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h4 className="font-semibold text-blue-900 mb-2">💡 使用建议</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• 复制生成的Prompt模板到你的工作流中</li>
              <li>• 根据具体项目需求调整模板内容</li>
              <li>• 建立团队的Prompt模板库，提升协作效率</li>
              <li>• 定期根据使用效果优化模板结构</li>
            </ul>
          </div>
        </motion.div>
      )}
    </Card>
  );
}

// 效果对比组件
interface EffectComparisonProps {
  onShowComparison: () => void;
  result?: string;
}

export function EffectComparison({ onShowComparison, result }: EffectComparisonProps) {
  return (
    <Card className="w-full">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-neutral-950 mb-2">⚡ 效果对比演示</h2>
        <p className="text-neutral-600">直观体验好与坏的Prompt设计差异</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* 模糊提示 */}
        <div className="p-4 bg-red-50 rounded-lg border-l-4 border-red-500">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-red-600 font-bold">❌ 模糊的提示</span>
          </div>
          <CodeBlock code="帮我写注释" language="text" />
          <div className="mt-3 text-sm text-red-700">
            <strong>问题：</strong>
            <ul className="list-disc list-inside mt-1 space-y-1">
              <li>缺少上下文信息</li>
              <li>没有指定格式要求</li>
              <li>无法判断代码复杂度</li>
              <li>结果质量难以预期</li>
            </ul>
          </div>
        </div>

        {/* 精确提示 */}
        <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-green-600 font-bold">✅ 精确的提示</span>
          </div>
          <CodeBlock 
            code={`作为代码审查专家，请为以下Java方法添加详细的文档注释，包括：
- 方法功能描述
- 参数说明 (@param)
- 返回值说明 (@return)
- 可能的异常 (@throws)
- 使用示例

[代码内容]`} 
            language="text" 
          />
          <div className="mt-3 text-sm text-green-700">
            <strong>优势：</strong>
            <ul className="list-disc list-inside mt-1 space-y-1">
              <li>明确角色定位</li>
              <li>详细输出要求</li>
              <li>结构化格式</li>
              <li>包含具体示例</li>
            </ul>
          </div>
        </div>
      </div>

      {/* 对比结果 */}
      {result ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg border border-orange-200"
        >
          <h3 className="font-semibold text-orange-900 mb-2">🎯 对比结果</h3>
          <div className="prose prose-sm text-orange-800">
            {result}
          </div>
        </motion.div>
      ) : (
        <div className="text-center">
          <Button
            onClick={onShowComparison}
            className="w-full md:w-auto"
            icon={<RefreshCw className="w-4 h-4" />}
          >
            🔍 查看详细对比分析
          </Button>
        </div>
      )}
    </Card>
  );
}