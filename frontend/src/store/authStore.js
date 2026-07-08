import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      idToken: null,
      isAuthenticated: false,

      setAuth: ({ user, accessToken, idToken }) =>
        set({ user, accessToken, idToken, isAuthenticated: true }),

      clearAuth: () =>
        set({ user: null, accessToken: null, idToken: null, isAuthenticated: false }),

      getToken: () => get().idToken,
    }),
    {
      name: 'cloudarch-auth',
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        idToken: state.idToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)
