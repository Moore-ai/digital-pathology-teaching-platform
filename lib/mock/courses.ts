import { Course, CourseCategory, Courseware, CoursewareSlide } from '@/types/course';

// 生成课件幻灯片的辅助函数
function generateSlides(prefix: string, count: number): CoursewareSlide[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `${prefix}-slide-${i}`,
    slideIndex: i,
    thumbnailUrl: `/slides/${prefix}-thumb-${i}.jpg`,
    imageUrl: `/slides/${prefix}-${i}.jpg`,
    notes: i === 0 ? '本节概览' : undefined,
    videoTimestamp: i === 0 ? 0 : i * 60,
  }));
}

// 课件数据
export const mockCoursewares: Record<string, Courseware> = {
  'l1-1': {
    id: 'cw-1',
    title: '食管的正常结构.pptx',
    type: 'pptx',
    fileUrl: '/courseware/esophagus-normal.pptx',
    totalPages: 24,
    fileSize: 3145728,
    uploadedAt: new Date('2024-09-01'),
  },
  'l1-2': {
    id: 'cw-2',
    title: '食管炎与Barrett食管.pptx',
    type: 'pptx',
    fileUrl: '/courseware/esophagitis.pptx',
    totalPages: 32,
    fileSize: 4194304,
    uploadedAt: new Date('2024-09-05'),
  },
  'l1-3': {
    id: 'cw-3',
    title: '食管癌.pptx',
    type: 'pptx',
    fileUrl: '/courseware/esophageal-cancer.pptx',
    totalPages: 28,
    fileSize: 3670016,
    uploadedAt: new Date('2024-09-10'),
  },
  'l2-1': {
    id: 'cw-4',
    title: '慢性胃炎.pptx',
    type: 'pptx',
    fileUrl: '/courseware/gastritis.pptx',
    totalPages: 36,
    fileSize: 45056,
    uploadedAt: new Date('2024-09-15'),
  },
  'l2-2': {
    id: 'cw-5',
    title: '胃溃疡.pptx',
    type: 'pptx',
    fileUrl: '/courseware/gastric-ulcer.pptx',
    totalPages: 30,
    fileSize: 3932160,
    uploadedAt: new Date('2024-09-20'),
  },
  'l4-1': {
    id: 'cw-6',
    title: '细菌性肺炎.pptx',
    type: 'pptx',
    fileUrl: '/courseware/bacterial-pneumonia.pptx',
    totalPages: 26,
    fileSize: 3407872,
    uploadedAt: new Date('2024-10-05'),
  },
};

// 幻灯片数据
export const mockSlides: Record<string, CoursewareSlide[]> = {
  'l1-1': generateSlides('esophagus-normal', 24),
  'l1-2': generateSlides('esophagitis', 32),
  'l1-3': generateSlides('esophageal-cancer', 28),
  'l2-1': generateSlides('gastritis', 36),
  'l2-2': generateSlides('gastric-ulcer', 30),
  'l4-1': generateSlides('bacterial-pneumonia', 26),
};

export const mockCourses: Course[] = [
  {
    id: '1',
    title: '消化病理学',
    description: '系统学习消化系统疾病的病理变化，包括胃肠道、肝脏、胰腺等器官的病理特征。涵盖炎症、肿瘤、代谢性疾病等多种病变的诊断要点。',
    coverImage: '/images/courses/digestive.jpg',
    category: 'digestive',
    totalLessons: 32,
    duration: 1920,
    progress: 75,
    status: 'in_progress',
    instructor: {
      id: 't1',
      name: '张教授',
      title: '主任医师',
      avatar: '',
      bio: '从事病理诊断工作20余年，擅长消化系统病理诊断',
    },
    chapters: [
      {
        id: 'c1-1',
        title: '第一章 食管疾病',
        order: 1,
        lessons: [
          {
            id: 'l1-1',
            title: '食管的正常结构',
            type: 'video',
            duration: 25,
            completed: true,
            videoUrl: '/videos/esophagus-normal.mp4',
            courseware: mockCoursewares['l1-1'],
            coursewareSlides: mockSlides['l1-1'],
          },
          {
            id: 'l1-2',
            title: '食管炎与Barrett食管',
            type: 'video',
            duration: 30,
            completed: true,
            videoUrl: '/videos/esophagitis.mp4',
            courseware: mockCoursewares['l1-2'],
            coursewareSlides: mockSlides['l1-2'],
          },
          {
            id: 'l1-3',
            title: '食管癌',
            type: 'video',
            duration: 35,
            completed: true,
            videoUrl: '/videos/esophageal-cancer.mp4',
            courseware: mockCoursewares['l1-3'],
            coursewareSlides: mockSlides['l1-3'],
          },
        ],
        relatedSlices: [
          { id: 's1', title: '食管鳞状细胞癌', thumbnailUrl: '/images/slices/esophageal-scc-thumb.jpg' },
        ],
      },
      {
        id: 'c1-2',
        title: '第二章 胃疾病',
        order: 2,
        lessons: [
          {
            id: 'l2-1',
            title: '慢性胃炎',
            type: 'video',
            duration: 35,
            completed: true,
            videoUrl: '/videos/gastritis.mp4',
            courseware: mockCoursewares['l2-1'],
            coursewareSlides: mockSlides['l2-1'],
          },
          {
            id: 'l2-2',
            title: '胃溃疡',
            type: 'video',
            duration: 40,
            completed: false,
            videoUrl: '/videos/gastric-ulcer.mp4',
            courseware: mockCoursewares['l2-2'],
            coursewareSlides: mockSlides['l2-2'],
          },
          {
            id: 'l2-3',
            title: '胃癌',
            type: 'video',
            duration: 45,
            completed: false,
            videoUrl: '/videos/gastric-cancer.mp4'
          },
        ],
        relatedSlices: [
          { id: 's2', title: '胃腺癌', thumbnailUrl: '/images/slices/gastric-adenocarcinoma-thumb.jpg' },
        ],
      },
      {
        id: 'c1-3',
        title: '第三章 肝脏疾病',
        order: 3,
        lessons: [
          { id: 'l3-1', title: '病毒性肝炎', type: 'video', duration: 40, completed: false, videoUrl: '/videos/viral-hepatitis.mp4' },
          { id: 'l3-2', title: '肝硬化', type: 'video', duration: 35, completed: false, videoUrl: '/videos/cirrhosis.mp4' },
          { id: 'l3-3', title: '肝细胞癌', type: 'video', duration: 45, completed: false, videoUrl: '/videos/hcc.mp4' },
        ],
        relatedSlices: [
          { id: 's3', title: '肝细胞癌', thumbnailUrl: '/images/slices/hcc-thumb.jpg' },
          { id: 's4', title: '肝硬化', thumbnailUrl: '/images/slices/cirrhosis-thumb.jpg' },
        ],
      },
    ],
    createdAt: new Date('2024-09-01'),
    updatedAt: new Date('2024-12-01'),
  },
  {
    id: '2',
    title: '呼吸病理学',
    description: '学习呼吸系统疾病的病理变化，包括肺部感染性疾病、慢性阻塞性肺疾病、肺部肿瘤等的病理诊断。',
    coverImage: '/images/courses/respiratory.jpg',
    category: 'respiratory',
    totalLessons: 28,
    duration: 1680,
    progress: 30,
    status: 'in_progress',
    instructor: {
      id: 't2',
      name: '李教授',
      title: '副主任医师',
      avatar: '',
    },
    chapters: [
      {
        id: 'c2-1',
        title: '第一章 肺部感染性疾病',
        order: 1,
        lessons: [
          {
            id: 'l4-1',
            title: '细菌性肺炎',
            type: 'video',
            duration: 30,
            completed: true,
            videoUrl: '/videos/bacterial-pneumonia.mp4',
            courseware: mockCoursewares['l4-1'],
            coursewareSlides: mockSlides['l4-1'],
          },
          { id: 'l4-2', title: '病毒性肺炎', type: 'video', duration: 35, completed: false, videoUrl: '/videos/viral-pneumonia.mp4' },
        ],
        relatedSlices: [],
      },
      {
        id: 'c2-2',
        title: '第二章 肺肿瘤',
        order: 2,
        lessons: [
          { id: 'l5-1', title: '肺腺癌', type: 'video', duration: 40, completed: false, videoUrl: '/videos/lung-adenocarcinoma.mp4' },
          { id: 'l5-2', title: '肺鳞状细胞癌', type: 'video', duration: 35, completed: false, videoUrl: '/videos/lung-scc.mp4' },
          { id: 'l5-3', title: '小细胞肺癌', type: 'video', duration: 30, completed: false, videoUrl: '/videos/sclc.mp4' },
        ],
        relatedSlices: [
          { id: 's5', title: '肺腺癌', thumbnailUrl: '/images/slices/lung-adenocarcinoma-thumb.jpg' },
        ],
      },
    ],
    createdAt: new Date('2024-10-01'),
    updatedAt: new Date('2024-12-01'),
  },
  {
    id: '3',
    title: '乳腺病理学',
    description: '深入理解乳腺疾病的病理诊断，包括良性病变、原位癌、浸润性癌等的鉴别诊断要点。',
    coverImage: '/images/courses/breast.jpg',
    category: 'breast',
    totalLessons: 24,
    duration: 1440,
    progress: 0,
    status: 'not_started',
    instructor: {
      id: 't1',
      name: '张教授',
      title: '主任医师',
    },
    chapters: [],
    createdAt: new Date('2024-11-01'),
    updatedAt: new Date('2024-12-01'),
  },
  {
    id: '4',
    title: '心血管病理学',
    description: '系统学习心血管系统疾病的病理变化，包括动脉粥样硬化、心肌病、心脏肿瘤等。',
    coverImage: '/images/courses/cardiovascular.jpg',
    category: 'cardiovascular',
    totalLessons: 26,
    duration: 1560,
    progress: 90,
    status: 'in_progress',
    instructor: {
      id: 't3',
      name: '王教授',
      title: '主任医师',
      avatar: '',
    },
    chapters: [],
    createdAt: new Date('2024-08-01'),
    updatedAt: new Date('2024-12-01'),
  },
  {
    id: '5',
    title: '神经系统病理学',
    description: '学习神经系统疾病的病理特征，包括脑血管病、神经退行性疾病、脑肿瘤等。',
    coverImage: '/images/courses/nervous.jpg',
    category: 'nervous',
    totalLessons: 36,
    duration: 2160,
    progress: 100,
    status: 'completed',
    instructor: {
      id: 't2',
      name: '李教授',
      title: '副主任医师',
    },
    chapters: [],
    createdAt: new Date('2024-06-01'),
    updatedAt: new Date('2024-12-01'),
  },
];

// 根据分类筛选课程
export function getCoursesByCategory(category: CourseCategory): Course[] {
  return mockCourses.filter(c => c.category === category);
}

// 根据状态筛选课程
export function getCoursesByStatus(status: Course['status']): Course[] {
  return mockCourses.filter(c => c.status === status);
}

// 获取课程详情
export function getCourseById(id: string): Course | undefined {
  return mockCourses.find(c => c.id === id);
}

// 正在学习的课程
export const inProgressCourses = mockCourses.filter(c => c.status === 'in_progress');

// 已完成的课程
export const completedCourses = mockCourses.filter(c => c.status === 'completed');
