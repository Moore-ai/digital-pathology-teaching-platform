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

## 七、组件开发规范

### 7.1 组件原则

- 使用 Tailwind CSS + shadcn/ui 基础组件
- MUI 用于复杂交互组件（如数据表格、日期选择器）
- 保持组件原子化，便于复用

### 7.2 命名规范

```
components/
├── ui/                    # 基础UI组件 (shadcn)
│   ├── button.tsx
│   ├── card.tsx
│   └── input.tsx
├── layout/                # 布局组件
│   ├── Header.tsx
│   ├── Sidebar.tsx
│   └── Footer.tsx
├── features/              # 功能组件
│   ├── SliceViewer/       # 切片浏览器
│   ├── CoursePlayer/      # 课程播放器
│   └── ExamCard/          # 考试卡片
└── shared/                # 共享组件
    ├── ProgressChart.tsx
    └── StatusBadge.tsx
```

### 7.3 状态管理

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

### 7.4 编写规范

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
| 2026-03-29 | 1.0 | 初始版本，基于设计方案创建 |
