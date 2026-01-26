import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { setCrispUser, setCrispCompany, resetCrispUser } from '../lib/crisp';

interface User {
  id: string;
  username: string;
  email: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  hasCompletedOnboarding: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  setUser: (user: User, token: string) => void;
  completeOnboarding: () => void;
  resetOnboarding: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      hasCompletedOnboarding: false,

      login: async (email: string, password: string) => {
        // TODO: Call actual auth API
        // For now, simulate login
        const mockUser = {
          id: '1',
          username: 'admin',
          email: email,
        };
        const mockToken = 'mock-jwt-token';

        set({
          user: mockUser,
          token: mockToken,
          isAuthenticated: true,
        });

        // Identify user in Crisp chat
        setCrispUser(mockUser.email, mockUser.username);
      },

      logout: () => {
        // Reset Crisp session
        resetCrispUser();

        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
      },

      setUser: (user: User, token: string) => {
        set({
          user,
          token,
          isAuthenticated: true,
        });

        // Identify user in Crisp chat
        setCrispUser(user.email, user.username);
      },

      completeOnboarding: () => {
        set({ hasCompletedOnboarding: true });
      },

      resetOnboarding: () => {
        set({ hasCompletedOnboarding: false });
      },
    }),
    {
      name: 'keroxio-auth',
    }
  )
);
