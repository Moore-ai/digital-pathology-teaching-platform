import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuthState, UserRole } from '@/types/user';
import { mockUsers, currentUser } from '@/lib/mock/users';

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: currentUser,
      isAuthenticated: true,

      login: async (email: string, _password: string) => {
        // Mock 登录逻辑
        const user = mockUsers.find(u => u.email === email);
        if (user) {
          set({ user, isAuthenticated: true });
        } else {
          throw new Error('用户名或密码错误');
        }
      },

      logout: () => {
        set({ user: null, isAuthenticated: false });
      },

      switchRole: (role: UserRole) => {
        const user = mockUsers.find(u => u.role === role);
        if (user) {
          set({ user });
        }
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);
