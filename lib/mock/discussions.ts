import { Discussion, DiscussionStats } from '@/types/discussion';

export const mockDiscussions: Discussion[] = [
  {
    id: '1',
    title: '肝细胞癌与胆管细胞癌如何鉴别？',
    content: '在病理诊断中，肝细胞癌和胆管细胞癌的鉴别一直是我困惑的问题。请问各位老师，除了免疫组化之外，还有哪些形态学特征可以帮助鉴别？',
    author: {
      id: 'S001',
      name: '李同学',
      avatar: '/avatars/student1.jpg',
      role: 'student',
    },
    category: 'slice',
    tags: ['肝脏', '肿瘤鉴别', '免疫组化'],
    replies: [
      {
        id: 'r1',
        content: '除了免疫组化，可以关注以下几点：1. 胆汁分泌是肝细胞癌的特征；2. 胆管细胞癌常见黏液分泌；3. 肝细胞癌血窦丰富，胆管细胞癌间质纤维化明显。',
        author: {
          id: 'T001',
          name: '王老师',
          role: 'teacher',
        },
        likes: 15,
        isAccepted: true,
        createdAt: new Date('2026-03-28'),
      },
      {
        id: 'r2',
        content: '同意王老师的观点。补充一点：肝细胞癌常伴肝硬化背景，而胆管细胞癌一般没有。',
        author: {
          id: 'S002',
          name: '张同学',
          role: 'student',
        },
        likes: 8,
        isAccepted: false,
        createdAt: new Date('2026-03-28'),
      },
    ],
    likes: 25,
    views: 156,
    isPinned: true,
    isSolved: true,
    createdAt: new Date('2026-03-27'),
    updatedAt: new Date('2026-03-28'),
  },
  {
    id: '2',
    title: '消化病理学第五章课后习题讨论',
    content: '第五章关于肝硬化的课后习题第5题，关于假小叶的形成机制，我有些不理解。有没有同学可以讨论一下？',
    author: {
      id: 'S003',
      name: '赵同学',
      role: 'student',
    },
    category: 'course',
    tags: ['消化病理学', '肝硬化', '课后习题'],
    replies: [
      {
        id: 'r3',
        content: '假小叶的形成是由于肝细胞坏死后的再生结节被纤维间隔包绕形成的。关键是要理解纤维化的机制。',
        author: {
          id: 'S001',
          name: '李同学',
          role: 'student',
        },
        likes: 5,
        isAccepted: false,
        createdAt: new Date('2026-03-29'),
      },
    ],
    likes: 12,
    views: 89,
    isPinned: false,
    isSolved: false,
    createdAt: new Date('2026-03-29'),
    updatedAt: new Date('2026-03-29'),
  },
  {
    id: '3',
    title: '肺腺癌切片标注问题求助',
    content: '在浏览肺腺癌切片时，发现一个区域不太确定是肿瘤还是炎症，请老师帮忙看一下。',
    author: {
      id: 'S002',
      name: '张同学',
      role: 'student',
    },
    category: 'help',
    tags: ['肺腺癌', '切片浏览', '诊断'],
    replies: [],
    likes: 8,
    views: 45,
    isPinned: false,
    isSolved: false,
    createdAt: new Date('2026-03-29'),
    updatedAt: new Date('2026-03-29'),
  },
  {
    id: '4',
    title: '期中考试复习重点讨论',
    content: '期中考试快到了，大家来讨论一下复习重点吧！我个人觉得消化系统是重点。',
    author: {
      id: 'S004',
      name: '周同学',
      role: 'student',
    },
    category: 'exam',
    tags: ['期中考试', '复习', '消化系统'],
    replies: [
      {
        id: 'r4',
        content: '根据老师的提示，消化系统和呼吸系统都是重点，各占30%。',
        author: {
          id: 'S001',
          name: '李同学',
          role: 'student',
        },
        likes: 20,
        isAccepted: false,
        createdAt: new Date('2026-03-28'),
      },
    ],
    likes: 35,
    views: 234,
    isPinned: false,
    isSolved: false,
    createdAt: new Date('2026-03-28'),
    updatedAt: new Date('2026-03-29'),
  },
  {
    id: '5',
    title: '欢迎新同学加入平台！',
    content: '欢迎各位新同学加入数字病理教学平台！请在这里简单介绍一下自己，有任何问题都可以在讨论区提问。',
    author: {
      id: 'admin',
      name: '管理员',
      role: 'admin',
    },
    category: 'general',
    tags: ['公告', '新同学'],
    replies: [
      {
        id: 'r5',
        content: '大家好，我是2024级病理学专业的学生，希望能在这里学到更多知识！',
        author: {
          id: 'S005',
          name: '孙同学',
          role: 'student',
        },
        likes: 10,
        isAccepted: false,
        createdAt: new Date('2026-03-25'),
      },
    ],
    likes: 42,
    views: 567,
    isPinned: true,
    isSolved: false,
    createdAt: new Date('2026-03-25'),
    updatedAt: new Date('2026-03-26'),
  },
];

// 获取讨论详情
export function getDiscussionById(id: string): Discussion | undefined {
  return mockDiscussions.find(d => d.id === id);
}

// 根据分类筛选
export function getDiscussionsByCategory(category: string): Discussion[] {
  return mockDiscussions.filter(d => d.category === category);
}

// 讨论区统计
export const discussionStats: DiscussionStats = {
  totalDiscussions: 156,
  totalReplies: 423,
  activeUsers: 89,
  todayPosts: 12,
};
