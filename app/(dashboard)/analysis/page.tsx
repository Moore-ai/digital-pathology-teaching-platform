'use client'

import type { ReactNode } from 'react'
import { useState, useRef, useEffect } from 'react'
import { PageWrapper } from '@/components/layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import {
  Send,
  Bot,
  User,
  Sparkles,
  BarChart3,
  FileText,
  HelpCircle,
  Lightbulb,
  Plus,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

interface QuickAction {
  label: string
  icon: typeof BarChart3
  prompt: string
}

const quickActions: QuickAction[] = [
  {
    label: '薄弱知识点分析',
    icon: BarChart3,
    prompt: '请分析我在各章节的薄弱知识点',
  },
  {
    label: '学习建议生成',
    icon: Lightbulb,
    prompt: '请根据我的学习数据生成个性化学习建议',
  },
  {
    label: '试题难度评估',
    icon: FileText,
    prompt: '请评估最近考试的试题难度分布',
  },
  {
    label: '错题原因分析',
    icon: HelpCircle,
    prompt: '请分析我最近考试错题的主要原因',
  },
]

// 模拟 AI 回复
const aiResponses: Record<string, string> = {
  '请分析我在各章节的薄弱知识点': `根据您的学习数据分析，以下是各章节的薄弱知识点：

**1. 消化系统章节**
- 肝细胞癌的病理特征辨析（错误率 35%）
- 肝硬化的分期判断（错误率 28%）
- 建议：重点复习肝细胞癌与胆管细胞癌的鉴别诊断

**2. 呼吸系统章节**
- 肺腺癌的分类标准（错误率 32%）
- 建议：结合切片浏览加深理解

**3. 乳腺章节**
- 乳腺癌的分级标准（错误率 25%）
- 建议：多练习病例分析

📚 推荐学习资源：
- 课程：消化病理学 第6章 肝肿瘤
- 切片：肝细胞癌、肝硬化`,

  '请根据我的学习数据生成个性化学习建议': `基于您的学习数据分析，为您生成以下学习建议：

**📈 学习进度分析**
- 总进度：58%，处于中等偏上水平
- 学习时长：240小时，超出平均水平 20%
- 考试成绩：82分，班级排名前30%

**🎯 近期学习建议**
1. **重点突破消化系统**
   - 您在该章节的正确率较低（68%）
   - 建议每天投入1-2小时专项学习

2. **巩固呼吸系统**
   - 肺腺癌分类是薄弱点
   - 推荐观看相关视频课程

3. **保持优势科目**
   - 泌尿系统掌握良好（85%）
   - 可适当减少复习时间

**⏰ 学习计划推荐**
- 周一至周三：消化系统强化
- 周四至周五：呼吸系统巩固
- 周末：综合练习与切片浏览`,

  '请评估最近考试的试题难度分布': `最近一次考试试题难度分布分析：

**📊 难度分布**
- 简单题：30%（15题）- 正确率 92%
- 中等题：50%（25题）- 正确率 76%
- 困难题：20%（10题）- 正确率 58%

**📈 各题型表现**
| 题型 | 数量 | 正确率 | 用时 |
|------|------|--------|------|
| 单选题 | 20 | 85% | 15分钟 |
| 多选题 | 10 | 70% | 20分钟 |
| 判断题 | 10 | 90% | 8分钟 |
| 简答题 | 2 | 65% | 25分钟 |

**💡 改进建议**
1. 多选题是主要失分点，建议加强概念辨析训练
2. 简答题答题时间偏长，建议练习快速组织答案
3. 困难题正确率较低，属于正常范围，可作为拔高训练`,

  '请分析我最近考试错题的主要原因': `根据最近3次考试的错题分析，主要原因如下：

**🔍 错误类型分布**
1. **概念混淆（40%）**
   - 主要涉及：肝细胞癌 vs 胆管细胞癌
   - 建议：制作对比表格进行区分

2. **切片判读失误（25%）**
   - 主要涉及：肺腺癌分类判断
   - 建议：增加切片浏览实践

3. **知识点遗忘（20%）**
   - 主要涉及：较早学习的内容
   - 建议：定期复习，使用间隔重复法

4. **审题不仔细（15%）**
   - 主要涉及：多选题漏选
   - 建议：养成标记关键词的习惯

**📋 改进措施**
- 每周复习1-2个已学章节
- 切片浏览时间增加至每周3小时
- 建立错题本，定期回顾`,
}

export default function AnalysisPage(): ReactNode {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: '您好！我是您的智能学习助手。我可以帮您分析学习数据、生成学习建议、评估考试表现等。请问有什么可以帮您的？',
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const handleSend = async (prompt?: string) => {
    const messageText = prompt || input.trim()
    if (!messageText) return

    // 添加用户消息
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: messageText,
      timestamp: new Date(),
    }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsTyping(true)

    // 模拟 AI 回复
    setTimeout(() => {
      const aiResponse = aiResponses[messageText] || '抱歉，我暂时无法回答这个问题。请尝试其他问题，或者联系老师获取帮助。'
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, assistantMessage])
      setIsTyping(false)
    }, 1500)
  }

  const handleNewChat = () => {
    setMessages([
      {
        id: Date.now().toString(),
        role: 'assistant',
        content: '新对话已开始。请问有什么可以帮您的？',
        timestamp: new Date(),
      },
    ])
  }

  return (
    <PageWrapper className="h-[calc(100vh-5rem)] flex flex-col">
      {/* 页面标题 */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-heading font-semibold text-foreground">智能分析助手</h1>
          <p className="text-muted-foreground mt-1">
            基于您的学习数据，提供个性化分析与建议
          </p>
        </div>
        <Button variant="outline" onClick={handleNewChat} className="gap-2">
          <Plus className="w-4 h-4" />
          新对话
        </Button>
      </div>

      <div className="flex-1 flex gap-4 min-h-0">
        {/* 对话区域 */}
        <Card className="flex-1 flex flex-col">
          {/* 消息列表 */}
          <ScrollArea className="flex-1 p-4" ref={scrollRef}>
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "flex gap-3",
                    message.role === 'user' && "justify-end"
                  )}
                >
                  {message.role === 'assistant' && (
                    <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center shrink-0">
                      <Bot className="w-4 h-4 text-secondary" />
                    </div>
                  )}
                  <div
                    className={cn(
                      "max-w-[80%] rounded-lg p-3",
                      message.role === 'assistant'
                        ? "bg-muted"
                        : "bg-primary text-primary-foreground"
                    )}
                  >
                    <div className="text-sm whitespace-pre-wrap">{message.content}</div>
                    <div className={cn(
                      "text-xs mt-1",
                      message.role === 'assistant' ? "text-muted-foreground" : "text-primary-foreground/70"
                    )}>
                      {message.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                  {message.role === 'user' && (
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <User className="w-4 h-4 text-primary" />
                    </div>
                  )}
                </div>
              ))}
              {isTyping && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center">
                    <Bot className="w-4 h-4 text-secondary" />
                  </div>
                  <div className="bg-muted rounded-lg p-3">
                    <div className="flex items-center gap-1">
                      <Sparkles className="w-4 h-4 text-secondary animate-pulse" />
                      <span className="text-sm text-muted-foreground">正在分析...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          <Separator />

          {/* 输入区域 */}
          <div className="p-4">
            <div className="flex gap-2">
              <Input
                placeholder="输入您的问题..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                className="flex-1"
              />
              <Button onClick={() => handleSend()} disabled={!input.trim() || isTyping}>
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Card>

        {/* 快捷操作面板 */}
        <Card className="w-72 shrink-0">
          <CardHeader>
            <CardTitle className="text-base font-medium">快捷提问</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {quickActions.map((action, index) => {
              const Icon = action.icon
              return (
                <Button
                  key={index}
                  variant="outline"
                  className="w-full justify-start gap-2 h-auto py-3"
                  onClick={() => handleSend(action.prompt)}
                  disabled={isTyping}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="text-sm">{action.label}</span>
                </Button>
              )
            })}

            <Separator className="my-4" />

            <div className="text-xs text-muted-foreground">
              <p className="font-medium mb-2">💡 提示</p>
              <p>您可以询问关于学习进度、考试分析、知识点掌握情况等问题。</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageWrapper>
  )
}
