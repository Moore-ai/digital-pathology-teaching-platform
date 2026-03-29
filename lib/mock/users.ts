import { User, UserRole } from '@/types/user';

export const mockUsers: User[] = [
  {
    id: '1',
    name: '李小明',
    email: 'student@example.com',
    role: 'student',
    studentId: '2024001',
    avatar: '/avatars/student1.png',
    createdAt: new Date('2024-09-01'),
    lastLogin: new Date(),
  },
  {
    id: '2',
    name: '张教授',
    email: 'teacher@example.com',
    role: 'teacher',
    teacherId: 'T001',
    avatar: '/avatars/teacher1.png',
    createdAt: new Date('2023-09-01'),
    lastLogin: new Date(),
  },
  {
    id: '3',
    name: '系统管理员',
    email: 'admin@example.com',
    role: 'admin',
    avatar: '/avatars/admin.png',
    createdAt: new Date('2023-01-01'),
    lastLogin: new Date(),
  },
];

// 默认用户（学生角色）
export const currentUser = mockUsers[0];

// 根据角色获取用户
export function getUserByRole(role: UserRole): User {
  return mockUsers.find(u => u.role === role) || mockUsers[0];
}

// 所有学生
export const mockStudents = mockUsers.filter(u => u.role === 'student');

// 所有教师
export const mockTeachers = mockUsers.filter(u => u.role === 'teacher');

// 用户登录验证（Mock）
export function validateUser(email: string, _password: string): User | null {
  const user = mockUsers.find(u => u.email === email);
  // Mock: 任何密码都可以登录
  return user || null;
}
