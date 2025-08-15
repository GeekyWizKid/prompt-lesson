'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, Button, Badge } from '@/components/ui';
import { useAppStore } from '@/lib/store';
import { AIProvider, AIConfig } from '@/types';
import { 
  Settings,
  Eye,
  EyeOff,
  Check,
  X,
  Zap,
  Globe,
  Key,
  Database,
  AlertCircle,
  Info
} from 'lucide-react';

const presetConfigs = {
  openai: {
    name: 'OpenAI',
    baseURL: 'https://api.openai.com/v1',
    models: ['gpt-4', 'gpt-4-turbo', 'gpt-3.5-turbo'],
    description: 'OpenAI 官方 API'
  },
  anthropic: {
    name: 'Anthropic Claude',
    baseURL: 'https://api.anthropic.com',
    models: ['claude-3-sonnet-20240229', 'claude-3-opus-20240229', 'claude-3-haiku-20240307'],
    description: 'Anthropic Claude API'
  },
  deepseek: {
    name: 'DeepSeek',
    baseURL: 'https://api.deepseek.com/v1',
    models: ['deepseek-chat', 'deepseek-coder'],
    description: 'DeepSeek AI API'
  }
};

interface APIConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function APIConfigModal({ isOpen, onClose }: APIConfigModalProps) {
  const { aiConfig, setAIConfig } = useAppStore();
  const [localConfig, setLocalConfig] = useState<AIConfig>(aiConfig);
  const [showApiKey, setShowApiKey] = useState(false);
  const [testingConnection, setTestingConnection] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [mounted, setMounted] = useState(false);

  // 确保组件在客户端渲染
  useEffect(() => {
    setMounted(true);
  }, []);

  // 防止背景滚动
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleProviderChange = (provider: AIProvider) => {
    const preset = presetConfigs[provider as keyof typeof presetConfigs];
    if (preset) {
      setLocalConfig({
        ...localConfig,
        provider,
        baseURL: preset.baseURL,
        model: preset.models[0],
      });
    } else {
      setLocalConfig({
        ...localConfig,
        provider,
      });
    }
  };

  const handleSave = () => {
    setAIConfig(localConfig);
    // 保存到本地存储
    localStorage.setItem('aiConfig', JSON.stringify(localConfig));
    onClose();
  };

  const testConnection = async () => {
    setTestingConnection(true);
    setTestResult(null);

    try {
      const response = await fetch('/api/test-connection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          config: localConfig,
          testPrompt: '你好，请回复"连接测试成功"'
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        setTestResult({ success: true, message: '连接测试成功！' });
      } else {
        setTestResult({ success: false, message: result.error || '连接测试失败' });
      }
    } catch (error) {
      setTestResult({ success: false, message: '网络错误，请检查配置' });
    } finally {
      setTestingConnection(false);
    }
  };

  if (!isOpen || !mounted) return null;

  const modalContent = (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9998] flex items-start justify-center p-4 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="w-full max-w-2xl my-8 mx-auto"
      >
        <Card className="relative max-h-[85vh] overflow-y-auto z-[9999]">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Settings className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-neutral-950">API 配置</h2>
                <p className="text-sm text-neutral-600">配置您的 AI 服务提供商</p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={onClose}
              icon={<X className="w-4 h-4" />}
            >
              关闭
            </Button>
          </div>

          {/* 提供商选择 */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-neutral-900 mb-3">
              选择 AI 服务提供商
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {Object.entries(presetConfigs).map(([key, preset]) => (
                <button
                  key={key}
                  onClick={() => handleProviderChange(key as AIProvider)}
                  className={`p-3 rounded-lg border text-left transition-all ${
                    localConfig.provider === key
                      ? 'border-orange-500 bg-orange-50 ring-2 ring-orange-200'
                      : 'border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50'
                  }`}
                >
                  <div className="font-medium text-neutral-900">{preset.name}</div>
                  <div className="text-xs text-neutral-600 mt-1">{preset.description}</div>
                </button>
              ))}
              <button
                onClick={() => handleProviderChange('custom')}
                className={`p-3 rounded-lg border text-left transition-all ${
                  localConfig.provider === 'custom'
                    ? 'border-orange-500 bg-orange-50 ring-2 ring-orange-200'
                    : 'border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50'
                }`}
              >
                <div className="font-medium text-neutral-900">自定义</div>
                <div className="text-xs text-neutral-600 mt-1">配置自定义 API</div>
              </button>
            </div>
          </div>

          {/* API 配置表单 */}
          <div className="space-y-4 mb-6">
            {/* API Key */}
            <div>
              <label className="block text-sm font-medium text-neutral-900 mb-2">
                <Key className="w-4 h-4 inline mr-1" />
                API Key
              </label>
              <div className="relative">
                <input
                  type={showApiKey ? 'text' : 'password'}
                  value={localConfig.apiKey || ''}
                  onChange={(e) => setLocalConfig({ ...localConfig, apiKey: e.target.value })}
                  placeholder="输入您的 API Key"
                  className="w-full p-3 pr-12 border border-neutral-300 rounded-lg focus:border-orange-500 focus:outline-none transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-500 hover:text-neutral-700"
                >
                  {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Base URL */}
            <div>
              <label className="block text-sm font-medium text-neutral-900 mb-2">
                <Globe className="w-4 h-4 inline mr-1" />
                Base URL
              </label>
              <input
                type="text"
                value={localConfig.baseURL || ''}
                onChange={(e) => setLocalConfig({ ...localConfig, baseURL: e.target.value })}
                placeholder="https://api.example.com/v1"
                className="w-full p-3 border border-neutral-300 rounded-lg focus:border-orange-500 focus:outline-none transition-colors"
              />
            </div>

            {/* 模型选择 */}
            <div>
              <label className="block text-sm font-medium text-neutral-900 mb-2">
                <Database className="w-4 h-4 inline mr-1" />
                模型
              </label>
              <div className="flex gap-2">
                <select
                  value={localConfig.model}
                  onChange={(e) => setLocalConfig({ ...localConfig, model: e.target.value })}
                  className="flex-1 p-3 border border-neutral-300 rounded-lg focus:border-orange-500 focus:outline-none transition-colors"
                >
                  {localConfig.provider !== 'custom' && presetConfigs[localConfig.provider as keyof typeof presetConfigs] ? (
                    presetConfigs[localConfig.provider as keyof typeof presetConfigs].models.map(model => (
                      <option key={model} value={model}>{model}</option>
                    ))
                  ) : (
                    <option value={localConfig.model}>{localConfig.model || '请输入模型名称'}</option>
                  )}
                </select>
                {localConfig.provider === 'custom' && (
                  <input
                    type="text"
                    value={localConfig.model}
                    onChange={(e) => setLocalConfig({ ...localConfig, model: e.target.value })}
                    placeholder="输入模型名称"
                    className="flex-1 p-3 border border-neutral-300 rounded-lg focus:border-orange-500 focus:outline-none transition-colors"
                  />
                )}
              </div>
            </div>

            {/* 高级参数 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-900 mb-2">
                  温度 (Temperature)
                </label>
                <input
                  type="number"
                  min="0"
                  max="2"
                  step="0.1"
                  value={localConfig.temperature || 0.7}
                  onChange={(e) => setLocalConfig({ ...localConfig, temperature: parseFloat(e.target.value) })}
                  className="w-full p-3 border border-neutral-300 rounded-lg focus:border-orange-500 focus:outline-none transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-900 mb-2">
                  最大令牌数
                </label>
                <input
                  type="number"
                  min="1"
                  max="8000"
                  value={localConfig.maxTokens || 2000}
                  onChange={(e) => setLocalConfig({ ...localConfig, maxTokens: parseInt(e.target.value) })}
                  className="w-full p-3 border border-neutral-300 rounded-lg focus:border-orange-500 focus:outline-none transition-colors"
                />
              </div>
            </div>
          </div>

          {/* DeepSeek 配置提示 */}
          {localConfig.provider === 'deepseek' && (
            <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-blue-600 mt-0.5" />
                <div className="text-sm">
                  <div className="font-medium text-blue-900 mb-1">DeepSeek 配置说明</div>
                  <ul className="text-blue-700 space-y-1">
                    <li>• API Key: 从 <a href="https://platform.deepseek.com" target="_blank" rel="noopener noreferrer" className="underline">DeepSeek 控制台</a> 获取</li>
                    <li>• 推荐模型: deepseek-chat (通用对话), deepseek-coder (代码生成)</li>
                    <li>• Base URL: https://api.deepseek.com/v1</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* 连接测试 */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-3">
              <Button
                onClick={testConnection}
                loading={testingConnection}
                disabled={!localConfig.apiKey || testingConnection}
                variant="outline"
                icon={<Zap className="w-4 h-4" />}
              >
                {testingConnection ? '测试中...' : '测试连接'}
              </Button>
              
              {testResult && (
                <Badge variant={testResult.success ? 'success' : 'error'}>
                  {testResult.success ? <Check className="w-3 h-3 mr-1" /> : <AlertCircle className="w-3 h-3 mr-1" />}
                  {testResult.message}
                </Badge>
              )}
            </div>
          </div>

          {/* 操作按钮 */}
          <div className="flex gap-3 pt-4 border-t border-neutral-200">
            <Button
              onClick={handleSave}
              className="flex-1"
              disabled={!localConfig.apiKey || !localConfig.model}
            >
              保存配置
            </Button>
            <Button
              variant="outline"
              onClick={onClose}
            >
              取消
            </Button>
          </div>
        </Card>
      </motion.div>
    </div>
  );

  return createPortal(modalContent, document.body);
}

interface APIConfigButtonProps {
  className?: string;
}

export function APIConfigButton({ className }: APIConfigButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { aiConfig } = useAppStore();

  const isConfigured = aiConfig.apiKey && aiConfig.model;

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsModalOpen(true)}
        icon={<Settings className="w-4 h-4" />}
        className={className}
      >
        API 配置
        {isConfigured && (
          <Badge variant="success" size="sm">
            <Check className="w-3 h-3" />
          </Badge>
        )}
      </Button>
      
      <AnimatePresence>
        {isModalOpen && (
          <APIConfigModal 
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}