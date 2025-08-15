import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';
import { AIProvider, AIConfig } from '@/types';

export class AIService {
  private openai: OpenAI | null = null;
  private anthropic: Anthropic | null = null;

  constructor() {
    // 初始化OpenAI客户端
    if (process.env.OPENAI_API_KEY) {
      this.openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });
    }

    // 初始化Anthropic客户端
    if (process.env.ANTHROPIC_API_KEY) {
      this.anthropic = new Anthropic({
        apiKey: process.env.ANTHROPIC_API_KEY,
      });
    }
  }

  // 创建动态的OpenAI客户端
  private createOpenAIClient(config: AIConfig): OpenAI {
    return new OpenAI({
      apiKey: config.apiKey || process.env.OPENAI_API_KEY,
      baseURL: config.baseURL,
    });
  }

  async generateResponse(prompt: string, config: AIConfig = {
    provider: 'openai',
    model: 'gpt-4',
    temperature: 0.7,
    maxTokens: 2000
  }): Promise<string> {
    const startTime = Date.now();

    try {
      if (config.provider === 'openai' || config.provider === 'deepseek' || config.provider === 'custom') {
        // 使用动态客户端或默认客户端
        const client = config.apiKey || config.baseURL ? this.createOpenAIClient(config) : this.openai;
        
        if (!client) {
          throw new Error('OpenAI API 未配置');
        }

        const response = await client.chat.completions.create({
          model: config.model,
          messages: [{ role: 'user', content: prompt }],
          temperature: config.temperature,
          max_tokens: config.maxTokens,
          top_p: config.topP,
        });

        const executionTime = Date.now() - startTime;
        console.log(`API call completed in ${executionTime}ms`);
        
        return response.choices[0]?.message?.content || '无法生成响应';
      }

      if (config.provider === 'anthropic' && this.anthropic) {
        const response = await this.anthropic.messages.create({
          model: config.model || 'claude-3-sonnet-20240229',
          max_tokens: config.maxTokens || 2000,
          temperature: config.temperature,
          messages: [{ role: 'user', content: prompt }],
        });

        const executionTime = Date.now() - startTime;
        console.log(`Anthropic API call completed in ${executionTime}ms`);
        
        return response.content[0]?.type === 'text' 
          ? response.content[0].text 
          : '无法生成响应';
      }

      throw new Error('未配置可用的AI服务提供商');
    } catch (error) {
      console.error('AI API调用失败:', error);
      throw new Error('AI服务暂时不可用，请稍后重试');
    }
  }

  // 流式生成响应
  async generateStreamResponse(
    prompt: string, 
    config: AIConfig,
    onChunk: (chunk: string) => void
  ): Promise<string> {
    const startTime = Date.now();
    let fullResponse = '';

    try {
      if (config.provider === 'openai' || config.provider === 'deepseek' || config.provider === 'custom') {
        const client = config.apiKey || config.baseURL ? this.createOpenAIClient(config) : this.openai;
        
        if (!client) {
          throw new Error('OpenAI API 未配置');
        }

        const stream = await client.chat.completions.create({
          model: config.model,
          messages: [{ role: 'user', content: prompt }],
          temperature: config.temperature,
          max_tokens: config.maxTokens,
          top_p: config.topP,
          stream: true,
        });

        for await (const chunk of stream) {
          const content = chunk.choices[0]?.delta?.content || '';
          if (content) {
            fullResponse += content;
            onChunk(content);
          }
        }

        const executionTime = Date.now() - startTime;
        console.log(`Stream API call completed in ${executionTime}ms`);
        
        return fullResponse;
      }

      if (config.provider === 'anthropic' && this.anthropic) {
        // Anthropic 暂时使用非流式，因为SDK复杂性
        const response = await this.anthropic.messages.create({
          model: config.model || 'claude-3-sonnet-20240229',
          max_tokens: config.maxTokens || 2000,
          temperature: config.temperature,
          messages: [{ role: 'user', content: prompt }],
        });

        const content = response.content[0]?.type === 'text' 
          ? response.content[0].text 
          : '无法生成响应';
        
        // 模拟流式输出
        const words = content.split(' ');
        for (let i = 0; i < words.length; i++) {
          const chunk = (i === 0 ? '' : ' ') + words[i];
          fullResponse += chunk;
          onChunk(chunk);
          await new Promise(resolve => setTimeout(resolve, 50)); // 50ms延迟
        }

        return fullResponse;
      }

      throw new Error('未配置可用的AI服务提供商');
    } catch (error) {
      console.error('AI API调用失败:', error);
      throw new Error('AI服务暂时不可用，请稍后重试');
    }
  }

  // 生成元Prompt
  async generateMetaPrompt(scenario: string, domain: string, config?: AIConfig): Promise<string> {
    const metaPromptTemplate = `作为Prompt工程专家，请为"${scenario}"场景在"${domain}"领域设计一个高效的Prompt模板。

要求：
1. 明确角色定位和专业身份
2. 结构化输入格式
3. 具体输出要求
4. 质量检验标准
5. 包含实际应用示例

请按照以下格式输出：

**场景**: ${scenario}
**领域**: ${domain}

**专用Prompt模板:**
[详细的Prompt模板内容]

**使用说明:**
[如何使用此模板的具体指导]

**预期效果:**
[使用此模板能达到的效果和价值]`;

    return await this.generateResponse(metaPromptTemplate, config || {
      provider: 'openai',
      model: 'gpt-4',
      temperature: 0.3, // 较低温度确保结构化输出
    });
  }

  // 生成PRD
  async generatePRD(requirements: string, context?: string): Promise<string> {
    const prdPrompt = `作为资深产品经理，基于以下需求生成完整的产品需求文档(PRD)：

**原始需求:**
${requirements}

**背景信息:**
${context || '暂无额外背景信息'}

**请按照以下结构生成PRD:**

# 产品需求文档 (PRD)

## 1. 产品概述
- 产品名称
- 产品定位
- 目标用户群体

## 2. 需求背景
- 问题描述
- 市场机会
- 商业价值

## 3. 产品目标
- 核心目标
- 成功指标
- 预期收益

## 4. 功能需求
### 4.1 核心功能
- 功能列表
- 功能描述
- 优先级排序

### 4.2 功能规格
- 详细功能说明
- 交互流程
- 业务规则

## 5. 非功能需求
- 性能要求
- 安全要求
- 可用性要求

## 6. 技术要求
- 技术选型建议
- 架构约束
- 集成要求

## 7. 用户体验设计
- 界面要求
- 交互设计
- 响应式设计

## 8. 项目规划
- 开发阶段
- 时间计划
- 资源需求

## 9. 风险评估
- 技术风险
- 市场风险
- 资源风险

## 10. 验收标准
- 功能验收
- 性能验收
- 用户验收

请确保内容详细、专业且可执行。`;

    return await this.generateResponse(prdPrompt, {
      provider: 'openai',
      model: 'gpt-4',
      temperature: 0.2,
      maxTokens: 4000,
    });
  }

  // 代码审查
  async reviewCode(code: string, language: string = 'javascript'): Promise<string> {
    const reviewPrompt = `作为资深${language}代码审查专家，请对以下代码进行全面审查：

**代码内容:**
\`\`\`${language}
${code}
\`\`\`

**请从以下维度进行审查:**

## 🔍 代码质量分析
- 可读性和代码风格
- 命名规范
- 代码结构和组织

## ⚡ 性能评估
- 时间复杂度分析
- 空间复杂度分析
- 潜在性能瓶颈

## 🔒 安全隐患
- 输入验证问题
- 潜在安全漏洞
- 数据安全风险

## 🛠 最佳实践
- 设计模式应用
- 错误处理机制
- 代码重用性

## 🎯 改进建议
- 具体修改方案
- 重构建议
- 性能优化方向

**请为每个问题提供具体的修改建议和代码示例。**`;

    return await this.generateResponse(reviewPrompt, {
      provider: 'openai',
      model: 'gpt-4',
      temperature: 0.3,
      maxTokens: 3000,
    });
  }

  // 调试助手
  async debugError(error: string, code?: string, context?: string): Promise<string> {
    const debugPrompt = `作为调试专家，请分析以下错误：

**错误信息:**
${error}

${code ? `**相关代码:**
\`\`\`
${code}
\`\`\`` : ''}

${context ? `**上下文信息:**
${context}` : ''}

**请按照以下结构进行分析:**

## 🎯 错误定位
- 错误类型分类
- 发生位置定位
- 触发条件分析

## 🔍 根因分析
- 直接原因
- 根本原因
- 相关因素

## ⚡ 解决方案
### 临时修复方案
- 快速解决方法
- 风险评估

### 长期解决方案  
- 彻底修复方法
- 代码重构建议

## 🛡️ 预防措施
- 类似问题预防
- 代码质量改进
- 测试用例建议

**请提供具体的代码修改示例。**`;

    return await this.generateResponse(debugPrompt, {
      provider: 'openai',
      model: 'gpt-4',
      temperature: 0.3,
    });
  }
}

// 导出单例实例
export const aiService = new AIService();