'use client';

import { create } from 'zustand';
import { AIConfig, PromptSession, PromptTemplate } from '@/types';

interface AppState {
  // AI配置
  aiConfig: AIConfig;
  setAIConfig: (config: Partial<AIConfig>) => void;

  // 当前会话
  currentSession: PromptSession | null;
  setCurrentSession: (session: PromptSession | null) => void;

  // 会话历史
  sessions: PromptSession[];
  addSession: (session: PromptSession) => void;
  setSessions: (sessions: PromptSession[]) => void;

  // 模板管理
  templates: PromptTemplate[];
  setTemplates: (templates: PromptTemplate[]) => void;
  addTemplate: (template: PromptTemplate) => void;

  // UI状态
  loading: boolean;
  setLoading: (loading: boolean) => void;
  
  activeTab: string;
  setActiveTab: (tab: string) => void;

  // 错误处理
  error: string | null;
  setError: (error: string | null) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  // AI配置初始状态
  aiConfig: {
    provider: 'deepseek',
    model: 'deepseek-chat',
    temperature: 0.7,
    maxTokens: 2000,
    baseURL: 'https://api.deepseek.com/v1',
  },
  setAIConfig: (config) => set((state) => ({
    aiConfig: { ...state.aiConfig, ...config }
  })),

  // 会话管理
  currentSession: null,
  setCurrentSession: (session) => set({ currentSession: session }),

  sessions: [],
  addSession: (session) => set((state) => ({
    sessions: [session, ...state.sessions]
  })),
  setSessions: (sessions) => set({ sessions }),

  // 模板管理
  templates: [],
  setTemplates: (templates) => set({ templates }),
  addTemplate: (template) => set((state) => ({
    templates: [template, ...state.templates]
  })),

  // UI状态
  loading: false,
  setLoading: (loading) => set({ loading }),

  activeTab: 'zero-shot',
  setActiveTab: (tab) => set({ activeTab: tab }),

  // 错误处理
  error: null,
  setError: (error) => set({ error }),
}));