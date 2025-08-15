import { NextRequest, NextResponse } from 'next/server';
import { aiService } from '@/lib/ai-service';
import { ApiResponse } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { error, code, context } = body;

    if (!error) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: '缺少必要的error参数'
      }, { status: 400 });
    }

    const analysis = await aiService.debugError(error, code, context);

    return NextResponse.json<ApiResponse>({
      success: true,
      data: {
        analysis,
        originalError: error,
        code,
        context,
        analyzedAt: new Date().toISOString(),
      }
    });
  } catch (error) {
    console.error('Debug analysis error:', error);
    return NextResponse.json<ApiResponse>({
      success: false,
      error: error instanceof Error ? error.message : '错误分析失败'
    }, { status: 500 });
  }
}