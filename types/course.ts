export interface Course {
  id: string;
  title: string;
  description: string;
  coverImage: string;
  category: CourseCategory;
  chapters: Chapter[];
  totalLessons: number;
  duration: number;          // 总时长(分钟)
  progress: number;          // 进度百分比
  status: CourseStatus;
  instructor: Instructor;
  createdAt: Date;
  updatedAt: Date;
}

export type CourseStatus = 'not_started' | 'in_progress' | 'completed';

export type CourseCategory =
  | 'digestive'      // 消化系统
  | 'respiratory'    // 呼吸系统
  | 'cardiovascular' // 心血管系统
  | 'endocrine'      // 内分泌系统
  | 'nervous'        // 神经系统
  | 'breast'         // 乳腺
  | 'urinary'        // 泌尿系统
  | 'reproductive'   // 生殖系统
  | 'musculoskeletal' // 肌骨系统
  | 'skin'           // 皮肤
  | 'other';         // 其他

export interface Chapter {
  id: string;
  title: string;
  order: number;
  lessons: Lesson[];
  relatedSlices: SliceReference[];
}

export interface Lesson {
  id: string;
  title: string;
  type: LessonType;
  duration: number;        // 时长(分钟)
  videoUrl?: string;
  fileUrl?: string;
  completed: boolean;
  // 课件相关
  courseware?: Courseware;
  coursewareSlides?: CoursewareSlide[];
}

export type LessonType = 'video' | 'pdf' | 'ppt';

/** 课件文件 */
export interface Courseware {
  id: string;
  title: string;
  type: CoursewareType;
  fileUrl: string;
  totalPages: number;
  fileSize: number;
  uploadedAt: Date;
}

export type CoursewareType = 'ppt' | 'pptx' | 'pdf';

/** 课时节片标注 */
export interface CoursewareSlide {
  id: string;
  slideIndex: number;        // 幻灯片索引 (0-based)
  thumbnailUrl: string;      // 缩略图URL
  imageUrl: string;          // 大图URL
  notes?: string;            // 讲师备注
  videoTimestamp?: number;   // 对应视频时间点（秒）
}

export interface Instructor {
  id: string;
  name: string;
  title: string;
  avatar?: string;
  bio?: string;
}

// 切片引用（简化版）
export interface SliceReference {
  id: string;
  title: string;
  thumbnailUrl: string;
}

// 课程分类标签
export const CourseCategoryLabels: Record<CourseCategory, string> = {
  digestive: '消化系统',
  respiratory: '呼吸系统',
  cardiovascular: '心血管系统',
  endocrine: '内分泌系统',
  nervous: '神经系统',
  breast: '乳腺',
  urinary: '泌尿系统',
  reproductive: '生殖系统',
  musculoskeletal: '肌骨系统',
  skin: '皮肤',
  other: '其他',
};
