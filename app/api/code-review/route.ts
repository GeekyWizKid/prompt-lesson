import { NextRequest, NextResponse } from 'next/server';
import { aiService } from '@/lib/ai-service';
import { ApiResponse } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { code, language = 'javascript' } = body;

    if (!code) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: '缺少必要的code参数'
      }, { status: 400 });
    }

    const review = await aiService.reviewCode(code, language);

    return NextResponse.json<ApiResponse>({
      success: true,
      data: {
        review,
        originalCode: code,
        language,
        reviewedAt: new Date().toISOString(),
      }
    });
  } catch (error) {
    console.error('Code review error:', error);
    return NextResponse.json<ApiResponse>({
      success: false,
      error: error instanceof Error ? error.message : '代码审查失败'
    }, { status: 500 });
  }
}