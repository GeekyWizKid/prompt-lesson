import { NextRequest } from 'next/server';
import { aiService } from '@/lib/ai-service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { prompt, config } = body;

    if (!prompt) {
      return new Response('缺少必要的prompt参数', { status: 400 });
    }

    // 创建流式响应
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          await aiService.generateStreamResponse(prompt, config, (chunk: string) => {
            // 发送数据块
            const data = JSON.stringify({ chunk, type: 'chunk' });
            controller.enqueue(encoder.encode(`data: ${data}\n\n`));
          });

          // 发送完成信号
          const endData = JSON.stringify({ type: 'end' });
          controller.enqueue(encoder.encode(`data: ${endData}\n\n`));
          controller.close();
        } catch (error) {
          // 发送错误信息
          const errorData = JSON.stringify({ 
            type: 'error', 
            error: error instanceof Error ? error.message : '生成失败' 
          });
          controller.enqueue(encoder.encode(`data: ${errorData}\n\n`));
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  } catch (error) {
    console.error('Stream generation error:', error);
    return new Response('服务器内部错误', { status: 500 });
  }
}