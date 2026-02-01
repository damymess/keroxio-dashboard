import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { setCrispUser, resetCrispUser } from '../lib/crisp';

export type UserPlan = 'free' | 'pro' | 'business';

interface User {
  id: string;
  username: string;
  email: string;
  role: string;
  plan: UserPlan;
}

interface Subscription {
  plan: UserPlan;
  status: 'active' | 'cancelled' | 'expired';
  currentPeriodEnd?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  subscription: Subscription | null;
  isAuthenticated: boolean;
  hasCompletedOnboarding: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  setUser: (user: User, token: string) => void;
  setSubscription: (subscription: Subscription) => void;
  completeOnboarding: () => void;
  resetOnboarding: () => void;
  // Helpers
  isPro: () => boolean;
  isBusiness: () => boolean;
  hasCRM: () => boolean;
}

const API_URL = import.meta.env.VITE_API_URL || 'https://api.keroxio.fr';

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      subscription: null,
      isAuthenticated: false,
      hasCompletedOnboarding: false,

      login: async (email: string, password: string) => {
        const response = await fetch(`${API_URL}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.detail || 'Login failed');
        }

        const data = await response.json();
        const token = data.access_token;

        // Fetch user profile
        const profileResponse = await fetch(`${API_URL}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!profileResponse.ok) {
          throw new Error('Failed to fetch profile');
        }

        const profile = await profileResponse.json();

        // Determine plan from role
        let plan: UserPlan = 'free';
        if (profile.role === 'pro') plan = 'pro';
        if (profile.role === 'admin' || profile.role === 'business') plan = 'business';

        const user: User = {
          id: profile.id,
          username: profile.name || profile.email.split('@')[0],
          email: profile.email,
          role: profile.role,
          plan,
        };

        // Fetch subscription
        let subscription: Subscription | null = null;
        try {
          const subResponse = await fetch(`${API_URL}/subscription/current`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (subResponse.ok) {
            const subData = await subResponse.json();
            if (subData) {
              subscription = {
                plan: subData.plan as UserPlan,
                status: subData.status,
                currentPeriodEnd: subData.current_period_end,
              };
              // Override plan if subscription exists
              if (subscription.status === 'active') {
                user.plan = subscription.plan;
              }
            }
          }
        } catch (e) {
          console.warn('Could not fetch subscription', e);
        }

        set({
          user,
          token,
          subscription,
          isAuthenticated: true,
        });

        setCrispUser(user.email, user.username);
      },

      logout: () => {
        resetCrispUser();
        set({
          user: null,
          token: null,
          subscription: null,
          isAuthenticated: false,
        });
      },

      setUser: (user: User, token: string) => {
        set({ user, token, isAuthenticated: true });
        setCrispUser(user.email, user.username);
      },

      setSubscription: (subscription: Subscription) => {
        set({ subscription });
      },

      completeOnboarding: () => {
        set({ hasCompletedOnboarding: true });
      },

      resetOnboarding: () => {
        set({ hasCompletedOnboarding: false });
      },

      // Helper methods
      isPro: () => {
        const { user } = get();
        return user?.plan === 'pro' || user?.plan === 'business';
      },

      isBusiness: () => {
        const { user } = get();
        return user?.plan === 'business';
      },

      hasCRM: () => {
        const { user } = get();
        return user?.plan === 'business';
      },
    }),
    {
      name: 'keroxio-auth',
    }
  )
);
