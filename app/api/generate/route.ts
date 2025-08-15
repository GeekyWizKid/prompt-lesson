import { NextRequest, NextResponse } from 'next/server';
import { aiService } from '@/lib/ai-service';
import prisma from '@/lib/prisma';
import { ApiResponse } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { prompt, config, templateId } = body;

    if (!prompt) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: '缺少必要的prompt参数'
      }, { status: 400 });
    }

    // 生成AI响应
    const response = await aiService.generateResponse(prompt, config);

    // 保存会话记录
    const session = await prisma.promptSession.create({
      data: {
        templateId,
        userPrompt: prompt,
        aiResponse: response,
        metadata: JSON.stringify({
          model: config?.model || 'gpt-4',
          executionTime: Date.now(),
          temperature: config?.temperature || 0.7,
        }),
      },
    });

    return NextResponse.json<ApiResponse>({
      success: true,
      data: {
        sessionId: session.id,
        response,
        metadata: session.metadata,
      }
    });
  } catch (error) {
    console.error('Generate API error:', error);
    return NextResponse.json<ApiResponse>({
      success: false,
      error: error instanceof Error ? error.message : '服务器内部错误'
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');

    const sessions = await prisma.promptSession.findMany({
      take: limit,
      skip: offset,
      orderBy: { createdAt: 'desc' },
      include: {
        template: {
          select: {
            name: true,
            category: true,
            type: true,
          }
        }
      }
    });

    return NextResponse.json<ApiResponse>({
      success: true,
      data: sessions
    });
  } catch (error) {
    console.error('Get sessions error:', error);
    return NextResponse.json<ApiResponse>({
      success: false,
      error: '获取会话记录失败'
    }, { status: 500 });
  }
}