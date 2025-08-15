const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const promptTemplates = [
  {
    name: '代码审查专家',
    description: '专业的代码质量审查和改进建议',
    category: 'development',
    type: 'role-playing',
    content: `作为资深代码审查专家，请检查以下代码的：
- 性能问题和优化建议
- 安全隐患和防护措施  
- 可维护性和代码结构
- 最佳实践符合度
- 潜在的bug和错误处理

请提供具体的修改建议和代码示例。`,
    tags: JSON.stringify(['代码审查', '质量保证', '最佳实践']),
    isPublic: true
  },
  {
    name: '智能调试助手',
    description: '错误分析和调试解决方案',
    category: 'development', 
    type: 'chain-of-thought',
    content: `作为调试专家，请逐步分析以下错误：

1. 首先识别错误类型和可能原因
2. 然后分析错误发生的具体环境和条件
3. 接下来提供具体的修复步骤和代码示例
4. 最后建议预防类似问题的最佳实践

错误信息：[在此输入错误信息]
相关代码：[在此输入相关代码]`,
    tags: JSON.stringify(['调试', '错误分析', '问题解决']),
    isPublic: true
  },
  {
    name: '产品需求分析师',
    description: '用户需求的结构化分析和优先级评估',
    category: 'product',
    type: 'role-playing', 
    content: `作为产品经理，基于用户反馈进行需求分析：

用户反馈：[在此输入用户反馈]

请输出：
## 需求理解
- 核心痛点识别
- 用户场景分析
- 真实需求挖掘

## 方案评估
- 解决方案建议
- 技术可行性分析
- 资源需求评估

## 优先级判断
- 紧急程度 (高/中/低)
- 重要程度 (P0/P1/P2) 
- 影响范围评估
- 实施建议和时间规划`,
    tags: JSON.stringify(['需求分析', '产品规划', '用户研究']),
    isPublic: true
  },
  {
    name: 'PRD文档生成器',
    description: '自动生成产品需求文档',
    category: 'product',
    type: 'few-shot',
    content: `作为产品经理，基于需求生成完整的PRD文档：

核心需求：[输入核心功能需求]
用户场景：[输入目标用户和使用场景] 
约束条件：[输入技术和业务约束]

请按照以下结构生成PRD：

# 产品需求文档

## 1. 产品概述
## 2. 需求背景  
## 3. 功能规格
## 4. 技术要求
## 5. 用户体验设计
## 6. 验收标准
## 7. 风险评估
## 8. 项目规划`,
    tags: JSON.stringify(['PRD', '产品文档', '需求管理']),
    isPublic: true
  },
  {
    name: 'API设计专家',
    description: 'RESTful API设计和规范建议',
    category: 'development',
    type: 'role-playing',
    content: `作为API设计专家，请设计以下API接口：

业务需求：[输入业务功能描述]
数据模型：[输入涉及的数据实体]
性能要求：[输入QPS、响应时间等要求]

请提供：
## API设计
- 接口路径和HTTP方法
- 请求参数和响应格式
- 状态码和错误处理

## 技术规范
- 认证和授权方案
- 数据验证规则
- 缓存策略

## 最佳实践
- RESTful设计原则
- 性能优化建议
- 安全防护措施`,
    tags: JSON.stringify(['API设计', 'RESTful', '系统架构']),
    isPublic: true
  }
]

async function main() {
  console.log('开始种子数据初始化...')
  
  for (const template of promptTemplates) {
    const result = await prisma.promptTemplate.create({
      data: template,
    })
    console.log(`创建模板: ${result.name}`)
  }
  
  console.log('种子数据初始化完成！')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })