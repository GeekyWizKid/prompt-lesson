import { NextRequest, NextResponse } from 'next/server';
import { aiService } from '@/lib/ai-service';
import { ApiResponse } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { scenario, domain, complexity = 'intermediate', config } = body;

    if (!scenario || !domain) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: '缺少必要的scenario和domain参数'
      }, { status: 400 });
    }

    const metaPrompt = await aiService.generateMetaPrompt(scenario, domain, config);

    return NextResponse.json<ApiResponse>({
      success: true,
      data: {
        metaPrompt,
        scenario,
        domain,
        complexity,
        generatedAt: new Date().toISOString(),
      }
    });
  } catch (error) {
    console.error('Meta prompt generation error:', error);
    return NextResponse.json<ApiResponse>({
      success: false,
      error: error instanceof Error ? error.message : '元Prompt生成失败'
    }, { status: 500 });
  }
}