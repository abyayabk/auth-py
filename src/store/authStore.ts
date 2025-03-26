import { create } from 'zustand';
import { User } from '../types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  points: number;
  login: (user: User) => void;
  logout: () => void;
  addPoints: (amount: number) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  points: 0,
  login: (user) => set({ user, isAuthenticated: true }),
  logout: () => set({ user: null, isAuthenticated: false }),
  addPoints: (amount) => set((state) => ({ points: state.points + amount })),
}));