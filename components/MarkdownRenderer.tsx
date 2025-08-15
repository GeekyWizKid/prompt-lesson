'use client';

import { useEffect, useState, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';
import { motion, AnimatePresence } from 'framer-motion';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import { Copy, Check } from 'lucide-react';
import 'highlight.js/styles/github-dark.css';

interface MarkdownRendererProps {
  content: string;
  streaming?: boolean;
  className?: string;
}

export function MarkdownRenderer({ content, streaming = false, className = '' }: MarkdownRendererProps) {
  const [isStreaming, setIsStreaming] = useState(streaming);

  // 使用 useMemo 来避免不必要的重新渲染
  const displayContent = useMemo(() => content, [content]);

  useEffect(() => {
    setIsStreaming(streaming);
  }, [streaming]);

  const CodeBlock = ({ node, inline, className, children, ...props }: any) => {
    const [copied, setCopied] = useState(false);
    const match = /language-(\w+)/.exec(className || '');
    const language = match ? match[1] : '';

    const handleCopy = async () => {
      await navigator.clipboard.writeText(String(children).replace(/\n$/, ''));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    };

    if (inline) {
      return (
        <code className="bg-neutral-100 text-orange-700 px-1.5 py-0.5 rounded text-sm font-mono" {...props}>
          {children}
        </code>
      );
    }

    return (
      <div className="relative group my-4">
        <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 px-2 py-1 bg-neutral-700 hover:bg-neutral-600 text-white text-xs rounded transition-colors"
          >
            {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
            {copied ? '已复制' : '复制'}
          </button>
        </div>
        <SyntaxHighlighter
          style={oneDark}
          language={language}
          PreTag="div"
          className="rounded-lg !bg-neutral-950 !mt-0"
          {...props}
        >
          {String(children).replace(/\n$/, '')}
        </SyntaxHighlighter>
      </div>
    );
  };

  const components = {
    code: CodeBlock,
    h1: ({ children }: any) => (
      <h1 className="text-2xl font-bold text-neutral-900 mt-6 mb-4 pb-2 border-b border-neutral-200">
        {children}
      </h1>
    ),
    h2: ({ children }: any) => (
      <h2 className="text-xl font-semibold text-neutral-900 mt-5 mb-3">
        {children}
      </h2>
    ),
    h3: ({ children }: any) => (
      <h3 className="text-lg font-medium text-neutral-900 mt-4 mb-2">
        {children}
      </h3>
    ),
    p: ({ children }: any) => (
      <p className="text-neutral-700 leading-relaxed mb-4">
        {children}
      </p>
    ),
    ul: ({ children }: any) => (
      <ul className="list-disc list-inside text-neutral-700 space-y-1 mb-4 ml-4">
        {children}
      </ul>
    ),
    ol: ({ children }: any) => (
      <ol className="list-decimal list-inside text-neutral-700 space-y-1 mb-4 ml-4">
        {children}
      </ol>
    ),
    li: ({ children }: any) => (
      <li className="text-neutral-700">{children}</li>
    ),
    blockquote: ({ children }: any) => (
      <blockquote className="border-l-4 border-orange-500 pl-4 py-2 my-4 bg-orange-50 text-neutral-700 italic">
        {children}
      </blockquote>
    ),
    table: ({ children }: any) => (
      <div className="overflow-x-auto my-4">
        <table className="min-w-full border border-neutral-200 rounded-lg overflow-hidden">
          {children}
        </table>
      </div>
    ),
    th: ({ children }: any) => (
      <th className="bg-neutral-100 border-b border-neutral-200 px-4 py-2 text-left font-semibold text-neutral-900">
        {children}
      </th>
    ),
    td: ({ children }: any) => (
      <td className="border-b border-neutral-200 px-4 py-2 text-neutral-700">
        {children}
      </td>
    ),
    strong: ({ children }: any) => (
      <strong className="font-semibold text-neutral-900">{children}</strong>
    ),
    em: ({ children }: any) => (
      <em className="italic text-neutral-700">{children}</em>
    ),
    hr: () => (
      <hr className="my-6 border-neutral-200" />
    ),
    a: ({ children, href }: any) => (
      <a 
        href={href} 
        target="_blank" 
        rel="noopener noreferrer"
        className="text-orange-600 hover:text-orange-700 underline transition-colors"
      >
        {children}
      </a>
    ),
  };

  return (
    <div className={`markdown-content ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight, rehypeRaw]}
        components={components}
      >
        {displayContent}
      </ReactMarkdown>
      
      {isStreaming && (
        <motion.div
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 1, repeat: Infinity }}
          className="inline-block w-2 h-5 bg-orange-500 ml-1"
        />
      )}
    </div>
  );
}

interface StreamingMarkdownProps {
  onStreamComplete?: (content: string) => void;
  prompt: string;
  config: any;
  className?: string;
}

export function StreamingMarkdown({ 
  onStreamComplete, 
  prompt, 
  config, 
  className = '' 
}: StreamingMarkdownProps) {
  const [content, setContent] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startStreaming = async () => {
    setIsStreaming(true);
    setError(null);
    setContent('');
    let accumulatedContent = '';

    try {
      const response = await fetch('/api/generate-stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, config }),
      });

      if (!response.body) {
        throw new Error('No response body');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        
        // 保留最后一行（可能不完整）
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              
              if (data.type === 'chunk') {
                accumulatedContent += data.chunk;
                setContent(accumulatedContent);
              } else if (data.type === 'end') {
                setIsStreaming(false);
                onStreamComplete?.(accumulatedContent);
              } else if (data.type === 'error') {
                setError(data.error);
                setIsStreaming(false);
              }
            } catch (e) {
              console.error('Failed to parse SSE data:', e);
            }
          }
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '流式生成失败');
      setIsStreaming(false);
    }
  };

  useEffect(() => {
    if (prompt && config) {
      startStreaming();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prompt, config]);

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-700">错误: {error}</p>
      </div>
    );
  }

  return (
    <div className={className}>
      <MarkdownRenderer 
        content={content} 
        streaming={isStreaming}
      />
      
      {isStreaming && content === '' && (
        <div className="flex items-center gap-2 text-neutral-500">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full"
          />
          <span className="text-sm">AI 正在思考中...</span>
        </div>
      )}
    </div>
  );
}