// ============================================================
// STORE - Auth Store (Zustand)
// ============================================================

import { create } from 'zustand';

interface AuthState {
  isAuthenticated: boolean;
  username: string | null;
  isLoading: boolean;
  error: string | null;

  setAuth: (username: string) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  username: null,
  isLoading: false,
  error: null,

  setAuth: (username: string) => set({
    isAuthenticated: true,
    username: username,
    error: null,
  }),

  logout: () => set({
    isAuthenticated: false,
    username: null,
    error: null,
  }),

  setLoading: (loading: boolean) => set({ isLoading: loading }),

  setError: (error: string | null) => set({ error: error }),

  clearError: () => set({ error: null }),
}));
