// Prompt相关类型定义
export interface PromptTemplate {
  id: string;
  name: string;
  description?: string;
  category: 'development' | 'product' | 'general';
  type: 'zero-shot' | 'few-shot' | 'chain-of-thought' | 'role-playing';
  content: string;
  tags: string[];
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface PromptSession {
  id: string;
  templateId?: string;
  userPrompt: string;
  aiResponse?: string;
  metadata?: {
    model?: string;
    executionTime?: number;
    tokenCount?: number;
    temperature?: number;
  };
  rating?: number;
  createdAt: Date;
}

// AI服务提供商类型
export type AIProvider = 'openai' | 'anthropic' | 'deepseek' | 'custom';

export interface AIConfig {
  provider: AIProvider;
  model: string;
  temperature?: number;
  maxTokens?: number;
  topP?: number;
  // 自定义API配置
  apiKey?: string;
  baseURL?: string;
  endpoint?: string;
}

// Prompt架构类型
export interface PromptArchitecture {
  id: string;
  name: string;
  description: string;
  icon: string;
  example: string;
  useCases: string[];
  template: string;
}

// 应用场景类型
export interface ApplicationScenario {
  id: string;
  name: string;
  category: 'development' | 'product';
  description: string;
  icon: string;
  template: string;
  expectedOutput: string;
  tips: string[];
}

// API响应类型
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// 用户反馈类型
export interface UserFeedback {
  id: string;
  sessionId?: string;
  type: 'bug' | 'feature' | 'improvement';
  content: string;
  rating?: number;
  email?: string;
  resolved: boolean;
  createdAt: Date;
}

// 元Prompt生成器选项
export interface MetaPromptOptions {
  scenario: string;
  domain: string;
  outputFormat: string;
  complexity: 'basic' | 'intermediate' | 'advanced';
  includeBestPractices: boolean;
}