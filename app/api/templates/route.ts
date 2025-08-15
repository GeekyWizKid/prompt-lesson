import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { ApiResponse } from '@/types';

export async function GET() {
  try {
    const templates = await prisma.promptTemplate.findMany({
      where: { isPublic: true },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json<ApiResponse>({
      success: true,
      data: templates
    });
  } catch (error) {
    console.error('Get templates error:', error);
    return NextResponse.json<ApiResponse>({
      success: false,
      error: '获取模板失败'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, category, type, content, tags } = body;

    if (!name || !category || !type || !content) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: '缺少必要参数'
      }, { status: 400 });
    }

    const template = await prisma.promptTemplate.create({
      data: {
        name,
        description,
        category,
        type,
        content,
        tags: tags || [],
        isPublic: true,
      },
    });

    return NextResponse.json<ApiResponse>({
      success: true,
      data: template
    });
  } catch (error) {
    console.error('Create template error:', error);
    return NextResponse.json<ApiResponse>({
      success: false,
      error: '创建模板失败'
    }, { status: 500 });
  }
}