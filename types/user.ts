export type UserRole = 'student' | 'teacher' | 'admin';

export type UserStatus = 'active' | 'inactive';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status?: UserStatus;
  avatar?: string;
  studentId?: string;      // 学号
  teacherId?: string;      // 工号
  createdAt: Date;
  lastLogin?: Date;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  switchRole: (role: UserRole) => void;
}

// 用户统计数据（学生）
export interface StudentStats {
  totalLearningHours: number;
  completedCourses: number;
  completedExams: number;
  averageScore: number;
}

// 用户统计数据（教师）
export interface TeacherStats {
  totalCourses: number;
  totalStudents: number;
  pendingExams: number;
  averageRating: number;
}
