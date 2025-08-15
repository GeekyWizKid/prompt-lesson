import { NextRequest, NextResponse } from 'next/server';
import { aiService } from '@/lib/ai-service';
import { ApiResponse } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { config, testPrompt = '你好，请回复"连接测试成功"' } = body;

    if (!config || !config.apiKey || !config.model) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: '缺少必要的配置参数'
      }, { status: 400 });
    }

    // 使用提供的配置测试连接
    const response = await aiService.generateResponse(testPrompt, config);

    return NextResponse.json<ApiResponse>({
      success: true,
      data: {
        response,
        message: '连接测试成功',
        config: {
          provider: config.provider,
          model: config.model,
          baseURL: config.baseURL,
        }
      }
    });
  } catch (error) {
    console.error('Connection test error:', error);
    
    let errorMessage = '连接测试失败';
    if (error instanceof Error) {
      if (error.message.includes('401')) {
        errorMessage = 'API Key 验证失败，请检查密钥是否正确';
      } else if (error.message.includes('404')) {
        errorMessage = 'API 端点不存在，请检查 Base URL 和模型名称';
      } else if (error.message.includes('timeout')) {
        errorMessage = '连接超时，请检查网络或 API 服务状态';
      } else {
        errorMessage = error.message;
      }
    }

    return NextResponse.json<ApiResponse>({
      success: false,
      error: errorMessage
    }, { status: 500 });
  }
}