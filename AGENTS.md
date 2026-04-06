# 数字病理教学平台 - 项目规范

> 本文档为 AI Agent 提供项目上下文与开发规范，确保代码实现与设计方案保持一致。

---

## 一、项目概述

**项目名称**：数字病理教学平台

**设计理念**：医学科技极简主义 (Medical Tech Minimalism) —— 专业、精准、有温度

**核心功能**：
- 用户登录与权限管理（学生/教师/管理员）
- 病例资料管理（PDF、PPT、视频、SVS切片文件）
- 教学课件展示（MOOC模式）
- 考试题库与智能组卷
- 学生考试与试卷批改
- SVS切片浏览与处理（标注、测量、计数、导航）
- 讨论交流系统
- 学生进度可视化
- RAG引导的知识点/考试题分析
- 系统设置（功能开关、用户管理、系统日志）

**重要要求**：
- 本项目仅为一个前端原型，**无需考虑编写代码与后端交互**

---

## 二、技术栈

| 层面 | 技术 | 版本要求 |
|------|------|----------|
| 框架 | Next.js | 14+ (App Router) |
| UI库 | Tailwind CSS + shadcn/ui + MUI | - |
| 状态管理 | Zustand | - |
| 切片浏览 | OpenSeadragon | SVS格式支持 |
| 图表可视化 | Recharts | - |
| 动画 | Framer Motion | - |

### Next.js 重要说明

> ⚠️ **This is NOT the Next.js you know**
>
> 本项目使用的 Next.js 可能有 breaking changes — APIs、约定和文件结构可能与训练数据不同。
> 在编写代码前，请阅读 `node_modules/next/dist/docs/` 中的相关指南。
> 注意所有 deprecation notices。

---

## 三、设计规范

### 3.1 色彩系统

本项目使用 **CSS 变量** 实现主题切换，支持浅色/深色模式。

```css
/* 主色调 */
--color-primary: #1E3A5F;        /* 临床蓝 - 主色 */
--color-secondary: #2D8B8B;      /* 病理青 - 次主色 */
--color-accent: #E86A33;         /* 诊断橙 - 强调色 */
--color-background: #F8FAFC;     /* 血清白 - 背景 */
--color-text: #374151;           /* 细胞核灰 - 文本 */

/* 功能语义色 */
--color-success: #10B981;        /* 医疗绿 */
--color-warning: #F59E0B;        /* 胆汁黄 */
--color-error: #EF4444;          /* 动脉红 */
--color-info: #3B82F6;           /* 脑脊液蓝 */
--color-annotation: #8B5CF6;     /* 病理紫 - 标注工具 */

/* 暗色模式 */
--color-dark-bg: #0F172A;
--color-dark-card: #1E293B;
--color-dark-text: #E2E8F0;
--color-dark-accent: #38BDF8;
```

### 3.1.1 主题系统实现

使用 `next-themes` 实现主题切换，在 `app/layout.tsx` 中配置：

```tsx
import { ThemeProvider as NextThemesProvider } from "next-themes";

<NextThemesProvider
  attribute="class"
  defaultTheme="system"
  enableSystem
  disableTransitionOnChange
>
  {children}
</NextThemesProvider>
```

### 3.1.2 CSS 变量使用规范

**推荐使用的 CSS 变量：**

| 变量 | 用途 | 深色模式值 |
|------|------|-----------|
| `var(--foreground)` | 主要文字 | 浅色/白色 |
| `var(--muted-foreground)` | 次要文字 | 浅灰色 |
| `var(--card)` | 卡片背景 | 深色卡片 |
| `var(--primary)` | 主色调 | 保持品牌色 |
| `var(--secondary)` | 次要色 | 保持品牌色 |
| `var(--border)` | 边框 | 深色边框 |
| `var(--background)` | 页面背景 | 深色背景 |

**半透明背景实现：**

```tsx
// 使用 color-mix 实现动态半透明背景
bgcolor: 'color-mix(in srgb, var(--primary) 10%, transparent)'
```

### 3.1.3 MUI 组件深色模式适配

MUI 组件默认不支持 CSS 变量主题，需要手动适配：

```tsx
// 正确示例：使用 CSS 变量
<Typography sx={{ color: 'var(--foreground)' }}>文字</Typography>
<Paper sx={{ bgcolor: 'var(--card)', borderColor: 'var(--border)' }}>

// 错误示例：硬编码颜色（深色模式下不可见）
<Typography sx={{ color: '#374151' }}>文字</Typography>

// Chip 组件需要显式设置 label 颜色
<Chip
  label={<span style={{ color: 'var(--foreground)' }}>标签</span>}
  sx={{ bgcolor: 'var(--muted)', borderColor: 'var(--border)' }}
/>
```

**图标颜色：**

```tsx
// 使用 style 属性设置图标颜色
<Icon className="w-4 h-4" style={{ color: 'var(--muted-foreground)' }} />
```

### 3.2 字体系统

| 类型 | 字体 | 应用场景 |
|------|------|----------|
| 标题 | Source Serif 4 | 页面标题、模块名称 |
| 正文 | IBM Plex Sans | 正文、按钮、表单 |
| 数据 | JetBrains Mono | 数据、代码、测量数值 |
| 中文 | 思源黑体 | 中文界面补充 |

### 3.3 字阶规范

```css
--font-hero: 3.5rem;      /* 首屏主标题 */
--font-h1: 2.25rem;       /* 页面标题 */
--font-h2: 1.75rem;       /* 模块标题 */
--font-h3: 1.25rem;       /* 卡片标题 */
--font-h4: 1rem;          /* 小节标题 */
--font-body-lg: 1.125rem; /* 强调正文 */
--font-body: 1rem;        /* 标准正文 */
--font-body-sm: 0.875rem; /* 辅助文本 */
--font-caption: 0.75rem;  /* 说明文字 */
```

---

## 四、页面结构

### 4.1 核心页面清单

| 优先级 | 页面 | 路由 | 说明 |
|--------|------|------|------|
| P0 | 登录页 | `/login` | 用户认证入口 |
| P0 | 首页仪表盘 | `/` | 三角色差异化视图 |
| P0 | 切片浏览器 | `/slice/[id]` | 核心功能页面 |
| P1 | 课程列表 | `/courses` | MOOC课程列表 |
| P1 | 课程播放 | `/courses/[id]/[chapter]` | 视频/PPT播放 |
| P1 | 考试中心 | `/exam` | 考试列表与答题 |
| P2 | 进度可视化 | `/progress` | 学习数据统计 |
| P2 | 智能组卷 | `/exam/create` | 教师组卷功能 |
| P2 | RAG分析 | `/analysis` | 智能问答分析 |
| P3 | 系统设置 | `/settings` | 管理员配置 |

### 4.2 布局结构

```
┌─────────────────────────────────────────┐
│              顶部导航栏                  │
├────────┬────────────────────────────────┤
│        │                                │
│  侧边  │          主内容区              │
│  导航  │                                │
│  栏    │       (响应式网格)             │
│        │                                │
├────────┴────────────────────────────────┤
│              页脚信息                    │
└─────────────────────────────────────────┘
```

---

## 五、用户角色与权限

| 角色 | 权限范围 |
|------|----------|
| 学生 | 课程学习、考试答题、切片浏览、进度查看、讨论交流 |
| 教师 | 课程管理、题库管理、智能组卷、试卷批改、学生进度查看 |
| 管理员 | 全部权限 + 用户管理、系统设置、日志查看 |

---

## 六、SVS切片浏览器规范

### 6.1 技术实现

使用 **OpenSeadragon** 渲染 DZI 格式切片瓦片。

### 6.2 工具面板

| 工具 | 功能 |
|------|------|
| 缩放 | 鼠标滚轮/滑块控制放大倍率 |
| 平移 | 拖拽移动切片视图 |
| 画笔 | 自由绘制标注 |
| 测量 | 线性测量、区域测量 |
| 计数 | 细胞/病灶计数 |
| 标签 | 添加文字标注 |
| 讨论 | 在特定位置发起讨论 |

### 6.3 性能要求

- 切片瓦片懒加载
- 标注数据实时同步
- 支持撤销/重做操作

---

## 七、项目结构详解

### 7.1 目录结构总览

```
digital-pathology-teaching-platform/
├── app/                          # Next.js App Router 页面
│   ├── (auth)/                   # 认证路由组
│   │   └── login/                # 登录页
│   ├── (dashboard)/              # 仪表盘路由组（含侧边栏布局）
│   │   ├── analysis/             # 智能分析模块
│   │   │   ├── assistant/        # AI问答助手
│   │   │   ├── errors/           # 错题诊断
│   │   │   ├── exam/[id]/        # 考试分析详情
│   │   │   └── knowledge/        # 知识点分析
│   │   ├── courses/              # 课程模块
│   │   │   └── [id]/[lessonId]/  # 课程详情/课时
│   │   │       └── courseware/   # 课件播放
│   │   ├── discussions/          # 讨论交流
│   │   ├── exams/                # 考试模块
│   │   │   ├── [id]/             # 考试详情
│   │   │   │   └── result/       # 考试结果
│   │   │   ├── create/           # 智能组卷
│   │   │   └── results/          # 成绩管理
│   │   ├── my-learning/          # 我的学习
│   │   ├── profile/              # 个人中心
│   │   ├── progress/             # 学习进度
│   │   ├── resources/            # 资源管理
│   │   │   ├── [id]/preview/     # 资源预览
│   │   │   └── upload/           # 资源上传
│   │   ├── slices/               # 切片管理
│   │   │   ├── [id]/             # 切片浏览
│   │   │   └── upload/           # 切片上传
│   │   └── system-settings/      # 系统设置
│   ├── (immersive)/              # 沉浸式路由组（无侧边栏）
│   │   └── exams/[id]/
│   │       ├── grading/          # 试卷批改
│   │       └── take/             # 考试答题
│   ├── layout.tsx                # 根布局
│   └── page.tsx                  # 首页重定向
├── components/                   # 组件目录
│   ├── features/                 # 功能组件（按业务模块划分）
│   │   ├── analytics/            # 数据分析图表
│   │   ├── auth/                 # 认证相关
│   │   ├── course/               # 课程相关
│   │   │   └── courseware/       # 课件播放器
│   │   ├── dashboard/            # 仪表盘
│   │   ├── discussion/           # 讨论交流
│   │   ├── exam/                 # 考试相关
│   │   │   └── grading/          # 批改功能
│   │   ├── resource/             # 资源管理
│   │   │   └── preview/          # 预览组件
│   │   ├── settings/             # 系统设置
│   │   └── slice/                # 切片浏览器
│   ├── layout/                   # 布局组件
│   │   ├── Header.tsx            # 顶部导航
│   │   ├── Sidebar.tsx           # 侧边栏
│   │   └── PageWrapper.tsx       # 页面包装器
│   ├── shared/                   # 共享组件
│   │   ├── EmptyState.tsx        # 空状态
│   │   ├── LoadingSkeleton.tsx   # 加载骨架
│   │   └── ThemeToggle.tsx       # 主题切换
│   └── ui/                       # shadcn/ui 基础组件
├── config/                       # 配置文件
│   └── navigation.ts             # 导航配置
├── lib/                          # 工具库
│   ├── mock/                     # Mock 数据
│   │   ├── courses.ts            # 课程数据
│   │   ├── exams.ts              # 考试数据
│   │   ├── questions.ts          # 题库数据
│   │   ├── resources.ts          # 资源数据
│   │   ├── slices.ts             # 切片数据
│   │   └── users.ts              # 用户数据
│   ├── constants.ts              # 常量定义
│   └── utils.ts                  # 工具函数
├── stores/                       # Zustand 状态管理
│   ├── analysisStore.ts          # 智能分析状态
│   ├── authStore.ts              # 认证状态
│   ├── courseStore.ts            # 课程状态
│   ├── discussionStore.ts        # 讨论状态
│   ├── examStore.ts              # 考试状态
│   ├── resourceStore.ts          # 资源状态
│   ├── sliceStore.ts             # 切片状态
│   ├── sliceUploadStore.ts       # 切片上传状态
│   └── themeStore.ts             # 主题状态
├── types/                        # TypeScript 类型定义
│   ├── analysis.ts               # 分析模块类型
│   ├── course.ts                 # 课程类型
│   ├── discussion.ts             # 讨论类型
│   ├── exam.ts                   # 考试类型
│   ├── resource.ts               # 资源类型
│   ├── slice.ts                  # 切片类型
│   └── user.ts                   # 用户类型
├── public/                       # 静态资源
└── docs/                         # 文档目录
```

### 7.2 组件原则

- 使用 Tailwind CSS + shadcn/ui 基础组件
- MUI 用于复杂交互组件（如数据表格、日期选择器）
- 保持组件原子化，便于复用

### 7.3 路由组说明

| 路由组 | 布局特点 | 适用场景 |
|--------|----------|----------|
| `(auth)` | 简洁布局，无侧边栏 | 登录、注册等认证页面 |
| `(dashboard)` | 标准布局，含侧边栏和顶部导航 | 常规功能页面 |
| `(immersive)` | 沉浸式布局，无侧边栏 | 考试答题、试卷批改等需要全屏的场景 |

### 7.4 状态管理

使用 Zustand 按功能模块划分 store：

```typescript
// stores/sliceStore.ts
interface SliceState {
  currentSlice: Slice | null;
  annotations: Annotation[];
  tool: ToolType;
  // ...
}
```

### 7.5 编写规范

**声明组件：**

```typescript
interface PartProps {
  paramA: string
  paramB: number
}

export function Part({paramA, paramB}: PartProps): ReactNode {
  ...
}
```

### 7.6 Mock 数据规范

所有 Mock 数据位于 `lib/mock/` 目录，用于前端原型开发：

| 文件 | 说明 |
|------|------|
| `courses.ts` | 课程列表、章节信息 |
| `exams.ts` | 考试列表、考试详情 |
| `questions.ts` | 题库数据 |
| `results.ts` | 考试成绩数据 |
| `resources.ts` | 教学资源数据 |
| `slices.ts` | 病理切片数据 |
| `users.ts` | 用户信息、学生名单 |
| `discussions.ts` | 讨论帖子数据 |
| `grading.ts` | 批改相关数据 |

---

## 八、API 规范

### 8.1 RESTful 端点设计

```
/api/auth/*           # 认证相关
/api/users/*          # 用户管理
/api/courses/*        # 课程管理
/api/slices/*         # 切片管理
/api/exams/*          # 考试管理
/api/questions/*      # 题库管理
/api/progress/*       # 学习进度
/api/discussions/*    # 讨论交流
/api/analysis/*       # RAG分析
/api/settings/*       # 系统设置
```

### 8.2 响应格式

```typescript
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}
```

---

## 九、动效规范

### 9.1 使用 Framer Motion

```typescript
// 页面进入动画
const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};
```

### 9.2 交互微动效

| 元素 | 触发 | 动效 |
|------|------|------|
| 按钮 | hover | 上浮1px + 阴影 |
| 卡片 | hover | 边框变色 + 阴影增强 |
| 输入框 | focus | 边框高亮 |
| 切片 | load | 模糊变清晰 |

---

## 十、响应式断点

| 断点 | 宽度 | 布局 |
|------|------|------|
| Mobile | < 640px | 单列，底部导航 |
| Tablet | 640px - 1023px | 两列，可折叠侧边栏 |
| Desktop | 1024px - 1439px | 标准布局 |
| Large | ≥ 1440px | 最大宽度1440px居中 |

---

## 十一、设计文档参考

详细设计方案请参考：`docs/设计方案.md`

---

## 更新日志

| 日期 | 版本 | 变更内容 |
|------|------|----------|
| 2026-04-06 | 1.1 | 添加深色模式规范、主题系统实现指南、MUI 组件适配规范 |
| 2026-03-29 | 1.0 | 初始版本，基于设计方案创建 |

---

## 十二、深色模式开发指南

### 12.1 核心原则

**深色模式下文字颜色原则：** 所有文字应为浅色或白色，确保可读性。

### 12.2 Button 组件适配

Button 组件需要在 variant 中显式设置深色模式文字颜色：

```tsx
// button.tsx variants 配置
outline: "border-border bg-background text-foreground hover:bg-muted hover:text-foreground dark:text-foreground..."
ghost: "text-foreground hover:bg-muted hover:text-foreground dark:text-foreground..."
```

### 12.3 时间戳与水合警告

使用时间戳等客户端生成内容时，需添加 `suppressHydrationWarning`：

```tsx
<Typography variant="caption" suppressHydrationWarning>
  {message.timestamp.toLocaleTimeString()}
</Typography>
```

### 12.4 智能问答助手组件规范

**建议问题功能实现：**

```tsx
// 只有最后一条助手消息显示建议问题
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

// MessageBubble 组件中的建议问题按钮
<Button
  variant="outline"
  size="sm"
  onClick={() => onSendQuestion(q)}
  disabled={isChatLoading}
>
  {q}
</Button>
```

### 12.5 避免的常见错误

1. **硬编码颜色值** - 深色模式下不可见
2. **MUI 组件使用默认主题色** - 与 Tailwind 主题不兼容
3. **忽略 `dark:` 前缀** - Tailwind 类需要在深色模式下显式设置
4. **rgba 硬编码** - 使用 `color-mix()` 替代
