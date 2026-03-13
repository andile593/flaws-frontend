import { create } from 'zustand'
import { getMe } from '../api/auth.api'

interface User {
  id: string
  name: string
  email: string
  phone?: string
}

interface AuthStore {
  user: User | null
  token: string | null
  setAuth: (token: string, user: User) => void
  logout: () => void
  fetchMe: () => Promise<void>
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  token: localStorage.getItem('token'),

  setAuth: (token, user) => {
    localStorage.setItem('token', token)
    set({ token, user })
  },

  logout: () => {
    localStorage.removeItem('token')
    set({ token: null, user: null })
  },

  fetchMe: async () => {
    try {
      const user = await getMe()
      set({ user })
    } catch {
      localStorage.removeItem('token')
      set({ token: null, user: null })
    }
  },
}))