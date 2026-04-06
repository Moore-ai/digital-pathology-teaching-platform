'use client'

import type { ReactNode } from 'react'
import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Send,
  Bot,
  User,
  Sparkles,
  ChevronLeft,
  BookOpen,
  Video,
  Microscope,
  FileQuestion,
  Plus,
} from 'lucide-react'
import {
  Box,
  Paper,
  Typography,
  Stack,
  Chip,
} from '@mui/material'
import { useAnalysisStore } from '@/stores/analysisStore'
import type { ChatMessage } from '@/types/analysis'

const quickQuestions = [
  '解释这道题',
  '分析我的错题',
  '推荐学习资源',
  '知识点对比',
]

export default function AIAssistantPage(): ReactNode {
  const { chatMessages, isChatLoading, sendMessage } = useAnalysisStore()
  const [input, setInput] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatMessages])

  const handleSend = async (message?: string) => {
    const messageText = message || input.trim()
    if (!messageText || isChatLoading) return

    setInput('')
    await sendMessage(messageText)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleNewChat = () => {
    window.location.reload()
  }

  return (
    <Box sx={{ height: 'calc(100vh - 5rem)', display: 'flex', flexDirection: 'column' }}>
      {/* 顶部导航 */}
      <Box sx={{ px: 3, pt: 3, pb: 2 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Stack direction="row" alignItems="center" spacing={2}>
            <Link href="/analysis" style={{ color: 'var(--muted-foreground)', transition: 'color 0.2s' }}>
              <ChevronLeft className="w-5 h-5" style={{ color: 'var(--muted-foreground)' }} />
            </Link>
            <Box>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Typography variant="h5" sx={{ fontWeight: 600, color: 'var(--foreground)' }}>智能问答助手</Typography>
                <Chip
                  size="small"
                  label={
                    <Stack direction="row" alignItems="center" spacing={0.5}>
                      <Sparkles className="w-3 h-3" style={{ color: 'var(--secondary-foreground)' }} />
                      <span style={{ color: 'var(--secondary-foreground)' }}>RAG</span>
                    </Stack>
                  }
                  sx={{ bgcolor: 'var(--secondary)', color: 'var(--secondary-foreground)' }}
                />
              </Stack>
              <Typography variant="body2" sx={{ color: 'var(--muted-foreground)' }}>基于知识库的智能问答</Typography>
            </Box>
          </Stack>
          <Button variant="outline" size="sm" onClick={handleNewChat} className="gap-2">
            <Plus className="w-4 h-4" />
            新对话
          </Button>
        </Stack>
      </Box>

      {/* 对话区域 */}
      <Box sx={{ flex: 1, overflowY: 'auto', px: 3 }}>
        <Box sx={{ maxWidth: 768, mx: 'auto' }}>
          <Stack spacing={2} sx={{ pb: 2 }}>
            {chatMessages.map((message, index) => {
              const isLastAssistantMessage =
                message.role === 'assistant' &&
                index === chatMessages.length - 1
              return (
                <MessageBubble
                  key={message.id}
                  message={message}
                  isLastAssistantMessage={isLastAssistantMessage}
                  onSendQuestion={handleSend}
                  isChatLoading={isChatLoading}
                />
              )
            })}
            {isChatLoading && (
              <Stack direction="row" spacing={1.5}>
                <Paper
                  elevation={0}
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: 'color-mix(in srgb, var(--primary) 10%, transparent)',
                  }}
                >
                  <Bot className="w-4 h-4" style={{ color: 'var(--primary)' }} />
                </Paper>
                <Paper variant="outlined" sx={{ p: 1.5, bgcolor: 'var(--card)', borderColor: 'var(--border)' }}>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Sparkles className="w-4 h-4 animate-pulse" style={{ color: 'var(--primary)' }} />
                    <Typography variant="body2" sx={{ color: 'var(--muted-foreground)' }}>AI 正在思考...</Typography>
                  </Stack>
                </Paper>
              </Stack>
            )}
            <div ref={messagesEndRef} />
          </Stack>
        </Box>
      </Box>

      {/* 输入区域 */}
      <Paper
        sx={{
          borderTop: '1px solid',
          borderColor: 'var(--border)',
          px: 3,
          py: 2,
          bgcolor: 'var(--card)',
        }}
      >
        <Box sx={{ maxWidth: 768, mx: 'auto' }}>
          {/* 快捷问题 */}
          <Stack direction="row" spacing={1} sx={{ mb: 1.5 }} useFlexGap flexWrap="wrap">
            {quickQuestions.map((q) => (
              <Button
                key={q}
                variant="outline"
                size="sm"
                className="text-xs"
                onClick={() => handleSend(q)}
                disabled={isChatLoading}
              >
                {q}
              </Button>
            ))}
          </Stack>

          {/* 输入框 */}
          <Stack direction="row" spacing={1}>
            <Input
              placeholder="输入您的问题，我会尽力为您解答..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1"
              disabled={isChatLoading}
            />
            <Button onClick={() => handleSend()} disabled={!input.trim() || isChatLoading}>
              <Send className="w-4 h-4" />
            </Button>
          </Stack>
        </Box>
      </Paper>
    </Box>
  )
}

// 消息气泡组件
function MessageBubble({
  message,
  isLastAssistantMessage,
  onSendQuestion,
  isChatLoading,
}: {
  message: ChatMessage
  isLastAssistantMessage: boolean
  onSendQuestion: (question: string) => void
  isChatLoading: boolean
}) {
  const isUser = message.role === 'user'

  return (
    <Stack
      direction="row"
      spacing={1.5}
      sx={{ alignItems: 'flex-start', ...(isUser && { flexDirection: 'row-reverse' }) }}
    >
      {!isUser && (
        <Paper
          elevation={0}
          sx={{
            width: 32,
            height: 32,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: 'color-mix(in srgb, var(--primary) 10%, transparent)',
          }}
        >
          <Bot className="w-4 h-4" style={{ color: 'var(--primary)' }} />
        </Paper>
      )}

      <Box sx={{ maxWidth: '85%' }}>
        <Paper
          sx={{
            p: 1.5,
            bgcolor: isUser ? 'var(--primary)' : 'var(--muted)',
            color: isUser ? 'var(--primary-foreground)' : 'var(--foreground)',
          }}
        >
          <Box sx={{ fontSize: '0.875rem', whiteSpace: 'pre-wrap' }}>
            {message.content.split('\n').map((line, i) => {
              if (line.startsWith('### ')) {
                return (
                  <Typography key={i} variant="subtitle2" sx={{ fontWeight: 600, mt: 1.5, mb: 1, color: 'inherit' }}>
                    {line.slice(4)}
                  </Typography>
                )
              }
              if (line.startsWith('**') && line.endsWith('**')) {
                return (
                  <Typography key={i} variant="body2" sx={{ fontWeight: 600, color: 'inherit' }}>
                    {line.slice(2, -2)}
                  </Typography>
                )
              }
              if (line.startsWith('- ')) {
                return (
                  <Typography key={i} variant="body2" sx={{ ml: 2, color: 'inherit' }}>• {line.slice(2)}</Typography>
                )
              }
              if (line.match(/^\d+\.\s/)) {
                return <Typography key={i} variant="body2" sx={{ ml: 2, color: 'inherit' }}>{line}</Typography>
              }
              return line ? <Typography key={i} variant="body2" sx={{ mb: 0.5, color: 'inherit' }}>{line}</Typography> : null
            })}
          </Box>
          <Typography
            variant="caption"
            suppressHydrationWarning
            sx={{
              mt: 1,
              display: 'block',
              color: isUser ? 'color-mix(in srgb, var(--primary-foreground) 70%, transparent)' : 'var(--muted-foreground)',
            }}
          >
            {message.timestamp.toLocaleTimeString()}
          </Typography>
        </Paper>

        {/* 引用来源 */}
        {!isUser && message.sources && message.sources.length > 0 && (
          <Stack direction="row" spacing={1} sx={{ mt: 1 }} useFlexGap flexWrap="wrap">
            {message.sources.map((source, index) => (
              <SourceBadge key={index} source={source} />
            ))}
          </Stack>
        )}

        {/* 建议问题 - 只有最后一条助手消息才显示 */}
        {!isUser && isLastAssistantMessage && message.suggestedQuestions && message.suggestedQuestions.length > 0 && (
          <Box sx={{ pt: 1 }}>
            <Typography variant="caption" sx={{ color: 'var(--muted-foreground)' }}>您还想知道：</Typography>
            <Stack direction="row" spacing={1} sx={{ mt: 1 }} useFlexGap flexWrap="wrap">
              {message.suggestedQuestions.map((q, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="text-xs h-auto py-1.5"
                  onClick={() => onSendQuestion(q)}
                  disabled={isChatLoading}
                >
                  {q}
                </Button>
              ))}
            </Stack>
          </Box>
        )}

        {/* 关联操作 */}
        {!isUser && message.actions && message.actions.length > 0 && (
          <Stack direction="row" spacing={1} sx={{ pt: 1 }} useFlexGap flexWrap="wrap">
            {message.actions.map((action, index) => (
              <Button key={index} variant="outline" size="sm" className="text-xs gap-1.5">
                {action.action === 'view_slice' && <Microscope className="w-3 h-3" />}
                {action.action === 'watch_course' && <Video className="w-3 h-3" />}
                {action.action === 'practice' && <FileQuestion className="w-3 h-3" />}
                {action.label}
              </Button>
            ))}
          </Stack>
        )}
      </Box>

      {isUser && (
        <Paper
          elevation={0}
          sx={{
            width: 32,
            height: 32,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: 'color-mix(in srgb, var(--secondary) 10%, transparent)',
          }}
        >
          <User className="w-4 h-4" style={{ color: 'var(--secondary)' }} />
        </Paper>
      )}
    </Stack>
  )
}

// 来源徽章组件
function SourceBadge({ source }: { source: NonNullable<ChatMessage['sources']>[number] }) {
  const icons = {
    textbook: BookOpen,
    course: Video,
    slice: Microscope,
    question: FileQuestion,
  }
  const Icon = icons[source.type]
  const labels = {
    textbook: '教材',
    course: '课程',
    slice: '切片',
    question: '题目',
  }

  return (
    <Chip
      size="small"
      variant="outlined"
      label={
        <Stack direction="row" alignItems="center" spacing={0.5}>
          <Icon className="w-3 h-3" style={{ color: 'var(--muted-foreground)' }} />
          <span style={{ color: 'var(--foreground)' }}>{labels[source.type]}</span>
          <Typography variant="caption" sx={{ color: 'var(--muted-foreground)' }}>·</Typography>
          <span style={{ color: 'var(--foreground)' }}>{source.title}</span>
          {source.page && (
            <Typography variant="caption" sx={{ color: 'var(--muted-foreground)' }}>({source.page})</Typography>
          )}
        </Stack>
      }
      sx={{ color: 'var(--foreground)', borderColor: 'var(--border)' }}
    />
  )
}
