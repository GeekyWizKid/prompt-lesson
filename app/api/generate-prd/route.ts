import { NextRequest, NextResponse } from 'next/server';
import { aiService } from '@/lib/ai-service';
import { ApiResponse } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { requirements, context, projectName } = body;

    if (!requirements) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: '缺少必要的requirements参数'
      }, { status: 400 });
    }

    const prd = await aiService.generatePRD(requirements, context);

    return NextResponse.json<ApiResponse>({
      success: true,
      data: {
        prd,
        projectName: projectName || '新产品项目',
        requirements,
        context,
        generatedAt: new Date().toISOString(),
      }
    });
  } catch (error) {
    console.error('PRD generation error:', error);
    return NextResponse.json<ApiResponse>({
      success: false,
      error: error instanceof Error ? error.message : 'PRD生成失败'
    }, { status: 500 });
  }
}