'use client';

import { useEffect } from 'react';
import { useAppStore } from '@/lib/store';

export function useInitializeConfig() {
  const { setAIConfig } = useAppStore();

  useEffect(() => {
    // 从本地存储加载配置
    const savedConfig = localStorage.getItem('aiConfig');
    if (savedConfig) {
      try {
        const config = JSON.parse(savedConfig);
        setAIConfig(config);
      } catch (error) {
        console.error('Failed to load AI config from localStorage:', error);
      }
    }
  }, [setAIConfig]);
}